#!/usr/bin/env python3
"""Extract the GameOutline DOCX into a reviewable JSON roster, not learner content.

One activity record represents one source table row. Repeated quests are not
expanded, final exams are not invented, and ambiguous types/numbers stay null.
Source cells and body paragraphs remain available alongside normalized fields.
Row IDs are locators within a source revision, not canonical curriculum IDs;
use them together with source.sha256 when matching subsequent source material.
"""
from __future__ import annotations

import argparse
import re
import sys
import zipfile
from pathlib import Path
from typing import Any

from extract_gamer_icu import (
    ISLAND_BY_NUMBER,
    WORD_NS_HINT,
    _docx_table_record,
    _hash_stream,
    _is_xml,
    _read_zip_xml,
    _source_id,
    _text_with_breaks,
    _write_json,
)

ACTIVITY_TYPES = {
    "video": "video",
    "reading/graphic": "reading",
    "quiz": "quiz",
    "clinical case vignette": "case_vignette",
    "vent lab": "vent_lab",
}
REQUIRED_COLUMNS = ("topic", "strategy", "time (min)", "peep points", "notes:")
STATUS_COLUMNS = {"status", "app dev", "creation status"}


def normalized_text(text: str) -> str:
    return " ".join(text.split())


def number(text: str) -> int | float | None:
    value = text.strip()
    if not re.fullmatch(r"\d+(?:\.\d+)?", value):
        return None
    return float(value) if "." in value else int(value)


def extract_outline(path: Path) -> dict[str, Any]:
    with path.open("rb") as stream:
        byte_size, sha256 = _hash_stream(stream)
    with zipfile.ZipFile(path) as archive:
        root, error = _read_zip_xml(archive, "word/document.xml")
    if error or root is None:
        raise ValueError(error or "Missing document XML")
    body = next((node for node in root.iter() if _is_xml(node, "body", WORD_NS_HINT)), None)
    if body is None:
        raise ValueError("Missing document body")

    paragraphs: list[dict[str, Any]] = []
    islands: list[dict[str, Any]] = []
    issues: list[dict[str, Any]] = []
    heading: dict[str, Any] | None = None
    section_paragraphs: list[str] = []
    table_index = 0

    for body_index, element in enumerate(body):
        if _is_xml(element, "p", WORD_NS_HINT):
            text = _text_with_breaks(element, "t", namespace_hint=WORD_NS_HINT)
            locator = {"bodyIndex": body_index}
            if text.strip():
                paragraphs.append({"text": text, "sourceLocator": locator})
            island_id = normalized_text(text).lower().replace(" ", "-")
            if island_id in ISLAND_BY_NUMBER.values():
                heading = {"id": island_id, "title": normalized_text(text), "sourceLocator": locator}
                section_paragraphs = []
            elif heading is not None and text.strip():
                section_paragraphs.append(text)
            continue
        if not _is_xml(element, "tbl", WORD_NS_HINT):
            continue
        table_index += 1
        if heading is None:
            raise ValueError(f"Table {table_index} has no recognized island heading")

        table = _docx_table_record(element)
        # The corpus helper preserves individual paragraphs even where its flat
        # cell text concatenates them. Keep those boundaries in the source text.
        rows = [
            ["\n".join(p["text"] for p in cell["paragraphs"]) for cell in row["cells"]]
            for row in table["rowRecords"]
        ]
        if not rows:
            raise ValueError(f"Table {table_index} is empty")
        headers = rows[0]
        columns = [normalized_text(header).lower() for header in headers]
        for required in REQUIRED_COLUMNS:
            if columns.count(required) != 1:
                raise ValueError(f"Table {table_index} must have exactly one {required!r} column")

        island: dict[str, Any] = {
            **heading,
            "order": len(islands) + 1,
            "description": "\n".join(section_paragraphs),
            "sourceTable": {"tableIndex": table_index, "bodyIndex": body_index, "headers": headers},
            "activities": [],
        }
        totals = None
        for row_index, cells in enumerate(rows[1:], start=2):
            locator = {"bodyIndex": body_index, "tableIndex": table_index, "rowIndex": row_index}
            if len(cells) < len(headers):
                raise ValueError(f"Table {table_index}, row {row_index} has missing cells")
            values = {column: cells[columns.index(column)] for column in REQUIRED_COLUMNS}
            source_row = {"sourceLocator": locator, "sourceCells": cells}
            if re.match(r"^TOTAL\s*:", values["topic"].strip(), re.IGNORECASE):
                if totals is not None or row_index != len(rows):
                    raise ValueError(f"Table {table_index} must end with exactly one totals row")
                count = re.search(r"(\d+)\s*activities", values["topic"], re.IGNORECASE)
                compliance = re.search(r"compliance\s*=\s*(\d+)", values["topic"], re.IGNORECASE)
                totals = {
                    **source_row,
                    "activityCount": int(count[1]) if count else None,
                    "complianceActivityCount": int(compliance[1]) if compliance else None,
                    "estimatedMinutes": number(values["time (min)"]),
                    "peepPoints": number(values["peep points"]),
                }
                if any(totals[key] is None for key in ("activityCount", "complianceActivityCount", "estimatedMinutes", "peepPoints")):
                    raise ValueError(f"Table {table_index} has unparseable declared totals")
                continue

            if not values["topic"].strip():
                raise ValueError(f"Table {table_index}, row {row_index} has no topic")
            row_id = f"outline-{island['id']}-{len(island['activities']) + 1:02d}"
            strategy = normalized_text(values["strategy"]).lower()
            activity_type = ACTIVITY_TYPES.get(strategy)
            if re.match(r"^quest\b", strategy):
                activity_type = "quest"
            repeat = re.search(r"available to do\s*x\s*(\d+)", strategy)
            activity = {
                **source_row,
                "rowId": row_id,
                "sequence": len(island["activities"]) + 1,
                "title": normalized_text(values["topic"]),
                "activityType": activity_type,
                "strategy": values["strategy"],
                "estimatedMinutes": number(values["time (min)"]),
                "peepPoints": number(values["peep points"]),
                "explicitRepeatCount": int(repeat[1]) if repeat else None,
                "sourceStatus": {headers[i]: cells[i] for i, column in enumerate(columns) if column in STATUS_COLUMNS},
                "notes": [text for i, text in enumerate(cells) if text.strip() and (i >= len(headers) or columns[i] in {"notes:", ""})],
            }
            island["activities"].append(activity)

            def flag(code: str, field: str, observed: Any) -> None:
                issues.append({"code": code, "islandId": island["id"], "rowId": row_id,
                               "field": field, "observed": observed, "sourceLocator": locator})

            if activity_type is None:
                flag("ambiguous_activity_type", "activityType", values["strategy"])
            for field, column in (("estimatedMinutes", "time (min)"), ("peepPoints", "peep points")):
                if activity[field] is None:
                    flag("ambiguous_numeric_value", field, values[column])
            if repeat:
                flag("repeated_activity_row", "explicitRepeatCount", activity["explicitRepeatCount"])
            for i, text in enumerate(cells):
                if text.strip() and (i >= len(columns) or columns[i] not in {*REQUIRED_COLUMNS, *STATUS_COLUMNS}):
                    flag("unmapped_source_column", f"sourceCells[{i}]", text)

        if totals is None:
            raise ValueError(f"Table {table_index} has no totals row")
        island["declaredTotals"] = totals
        computed = {"activityCount": len(island["activities"])}
        for field in ("estimatedMinutes", "peepPoints"):
            numbers = [activity[field] for activity in island["activities"]]
            computed[field] = None if any(value is None for value in numbers) else sum(numbers)
        island["computedRowTotals"] = computed
        for field, value in computed.items():
            if value is not None and value != totals[field]:
                issues.append({"code": "declared_total_mismatch", "islandId": island["id"],
                               "field": field, "declared": totals[field], "computed": value,
                               "sourceLocator": totals["sourceLocator"]})
        islands.append(island)
        heading = None
        section_paragraphs = []

    if [island["id"] for island in islands] != list(ISLAND_BY_NUMBER.values()):
        raise ValueError("Expected exactly the six named island tables in document order")
    return {
        "schemaVersion": 1,
        "purpose": "Source-outline reconciliation; not a published learner curriculum",
        "source": {"relativePath": path.name, "sourceId": _source_id(path.name), "sha256": sha256, "byteSize": byte_size},
        "conventions": {
            "sourceLocator": "bodyIndex is zero-based in word/document.xml; tableIndex and rowIndex are one-based, including the header row",
            "rowId": "Source-revision locator only; pair with source.sha256. Not an existing curriculum activity ID",
            "null": "No unambiguous normalized value; consult sourceCells and issues",
            "sourceStatus": "Verbatim document markings, not verified source-file availability or clinical approval",
            "totals": "Computed from source rows without expanding repeated quests; ambiguous numeric values make the corresponding sum null",
            "scope": "Island activity tables and body paragraph text; embedded document images are not extracted by this command",
        },
        "documentParagraphs": paragraphs,
        "islands": islands,
        "issues": issues,
        "summary": {"islandCount": len(islands), "activityRowCount": sum(len(island["activities"]) for island in islands), "issueCount": len(issues)},
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path, help="original GameOutline DOCX")
    parser.add_argument("--out", required=True, type=Path, help="output JSON roster")
    args = parser.parse_args(argv)
    try:
        source = args.source.expanduser().resolve()
        out = args.out.expanduser().resolve()
        if source == out:
            raise ValueError("Output must not overwrite the source document")
        roster = extract_outline(source)
        out.parent.mkdir(parents=True, exist_ok=True)
        _write_json(out, roster)
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Outline extraction failed: {error}\n")
    summary = roster["summary"]
    print(
        f"Extracted {summary['activityRowCount']} activity rows across "
        f"{summary['islandCount']} islands; {summary['issueCount']} source issues require review."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
