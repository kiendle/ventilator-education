#!/usr/bin/env python3
"""Deterministically inventory and extract the GAMER-ICU source corpus.

The corpus is intentionally treated as source material, not as application
content.  This tool writes hashes, structured text, parser outcomes, and
media metadata only; it never copies source media into the generated output.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import posixpath
import re
import shutil
import struct
import subprocess
import tempfile
import sys
import unicodedata
import urllib.parse
import xml.etree.ElementTree as ET
import zipfile
import zlib
from pathlib import Path
from typing import Any, BinaryIO, Iterable


CHUNK_SIZE = 1024 * 1024
MAX_XML_MEMBER_SIZE = 16 * 1024 * 1024


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"

ISLAND_BY_NUMBER = {
    1: "lake-mucosa",
    2: "interlobar-divides",
    3: "valley-of-pulmonara",
    4: "bronchial-bluffs",
    5: "mount-pneumora",
    6: "alveolar-highlands",
}

KIND_ORDER = ("docx", "pptx", "pdf", "png", "video", "audio")

VIDEO_SUFFIXES = {
    ".3gp",
    ".avi",
    ".flv",
    ".m2ts",
    ".m4v",
    ".mkv",
    ".mov",
    ".mp4",
    ".mpeg",
    ".mpg",
    ".mts",
    ".ts",
    ".vob",
    ".webm",
    ".wmv",
}
AUDIO_SUFFIXES = {
    ".aac",
    ".aif",
    ".aiff",
    ".flac",
    ".m4a",
    ".mka",
    ".mp3",
    ".oga",
    ".ogg",
    ".opus",
    ".wav",
    ".wma",
}
IMAGE_SUFFIXES = {".bmp", ".gif", ".jpeg", ".jpg", ".svg", ".tif", ".tiff", ".webp"}
CONVERTIBLE_MEDIA_SUFFIXES = {".wdp": "wdp", ".jxr": "wdp", ".emf": "emf", ".wmf": "wmf"}
CONVERTER_SCRIPT = Path(__file__).with_name("convert_curriculum_media.js")
TIMESTAMP_WORDS = ("date", "time", "created", "modified", "encoded", "creation")

# OOXML namespace URIs used by both transitional and strict files.  Matching
# by URI suffix also keeps the parser useful for files produced by other OOXML
# writers without introducing a package dependency.
WORD_NS_HINT = "/wordprocessingml/"
DRAWING_NS_HINT = "/drawingml/"
PRESENTATION_NS_HINT = "/presentationml/"


class ExtractionError(Exception):
    """An expected parser failure represented in output rather than raised."""



def _nfc(value: str) -> str:
    return unicodedata.normalize("NFC", value)


def _local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def _namespace(tag: str) -> str:
    return tag[1:].split("}", 1)[0] if tag.startswith("{") and "}" in tag else ""


def _is_xml(element: ET.Element, local: str, namespace_hint: str | None = None) -> bool:
    if _local_name(element.tag) != local:
        return False
    return namespace_hint is None or namespace_hint in _namespace(element.tag)


def _attribute(element: ET.Element, name: str) -> str | None:
    if name in element.attrib:
        return element.attrib[name]
    for key, value in element.attrib.items():
        if _local_name(key) == name:
            return value
    return None


def _clean_member_name(name: str) -> str:
    """Return a safe, deterministic archive-relative member name."""
    value = _nfc(name.replace("\\", "/"))
    value = posixpath.normpath(value).lstrip("/")
    while value.startswith("../"):
        value = value[3:]
    return "" if value == "." else value


def _resolve_member(base_member: str, target: str) -> str | None:
    if not target:
        return None
    target = urllib.parse.unquote(target.replace("\\", "/"))
    if target.startswith("/"):
        target = target.lstrip("/")
    value = posixpath.normpath(posixpath.join(posixpath.dirname(base_member), target))
    if value == ".." or value.startswith("../") or value.startswith("/"):
        return None
    return _clean_member_name(value)


def _normalize_relative(root: Path, path: Path) -> str:
    relative = path.relative_to(root).as_posix()
    return _nfc(relative)


def _classify(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".docx":
        return "docx"
    if suffix == ".pptx":
        return "pptx"
    if suffix == ".pdf":
        return "pdf"
    if suffix == ".png":
        return "png"
    if suffix in VIDEO_SUFFIXES:
        return "video"
    if suffix in AUDIO_SUFFIXES:
        return "audio"
    return "unsupported"


def _media_kind(name: str) -> str:
    suffix = Path(name).suffix.lower()
    if suffix == ".png":
        return "png"
    if suffix in IMAGE_SUFFIXES:
        return "image"
    if suffix in VIDEO_SUFFIXES:
        return "video"
    if suffix in AUDIO_SUFFIXES:
        return "audio"
    return "embedded"


def _hash_stream(stream: BinaryIO) -> tuple[int, str]:
    digest = hashlib.sha256()
    size = 0
    while True:
        chunk = stream.read(CHUNK_SIZE)
        if not chunk:
            break
        size += len(chunk)
        digest.update(chunk)
    return size, digest.hexdigest()


def _hash_file(path: Path) -> tuple[int | None, str | None, str | None]:
    try:
        with path.open("rb") as stream:
            size, digest = _hash_stream(stream)
        return size, digest, None
    except (OSError, ValueError):
        return None, None, "source_read_error"


def _source_id(relative_path: str, occurrence: int = 1) -> str:
    value = "source\0" + relative_path
    if occurrence > 1:
        value += "\0" + str(occurrence)
    return "source-" + hashlib.sha256(value.encode("utf-8")).hexdigest()[:20]


def _asset_id(source_id: str, member_path: str | None, relative_path: str) -> str:
    value = "asset\0" + source_id + "\0" + (member_path or relative_path)
    return "asset-" + hashlib.sha256(value.encode("utf-8")).hexdigest()[:20]


def _island_id(relative_path: str) -> str | None:
    parts = relative_path.split("/")[:-1]
    numbered = re.compile(r"^\s*(\d{1,2})(?:\s*[.\-_:)]|\s+)\s*", re.UNICODE)
    for part in parts:
        match = numbered.match(part)
        if match:
            number = int(match.group(1))
            return ISLAND_BY_NUMBER.get(number)
    return None


def _error_list(*errors: str) -> list[str]:
    return sorted({_nfc(error) for error in errors if error})


def _status_for_content(content: Any, errors: list[str], missing: list[str], *, empty: bool = False) -> str:
    if missing:
        return "missing_dependency"
    if errors:
        return "error"
    if empty:
        return "empty"
    return "ok"


def _text_with_breaks(
    element: ET.Element,
    text_local: str,
    *,
    tab_local: str = "tab",
    break_local: str = "br",
    namespace_hint: str | None = None,
) -> str:
    pieces: list[str] = []
    for child in element.iter():
        local = _local_name(child.tag)
        if local == text_local and child.text and (namespace_hint is None or namespace_hint in _namespace(child.tag)):
            pieces.append(child.text)
        elif local == tab_local and (namespace_hint is None or namespace_hint in _namespace(child.tag)):
            pieces.append("\t")
        elif local in {break_local, "cr", "lineBreak"} and (namespace_hint is None or namespace_hint in _namespace(child.tag)):
            pieces.append("\n")
    return _nfc("".join(pieces))


def _xml_bool(parent: ET.Element, local: str, namespace_hint: str) -> bool:
    return any(_is_xml(child, local, namespace_hint) for child in parent.iter())


def _docx_run_record(run: ET.Element) -> dict[str, Any]:
    record: dict[str, Any] = {
        "text": _text_with_breaks(run, "t", namespace_hint=WORD_NS_HINT),
    }
    properties = next((child for child in list(run) if _is_xml(child, "rPr", WORD_NS_HINT)), None)
    if properties is not None:
        for key in ("b", "i", "strike", "smallCaps", "vanish"):
            if _xml_bool(properties, key, WORD_NS_HINT):
                record[key] = True
        underline = next((child for child in properties.iter() if _is_xml(child, "u", WORD_NS_HINT)), None)
        if underline is not None:
            record["underline"] = _attribute(underline, "val") or True
        vert_align = next((child for child in properties.iter() if _is_xml(child, "vertAlign", WORD_NS_HINT)), None)
        if vert_align is not None:
            record["vertAlign"] = _attribute(vert_align, "val")
    return record


def _docx_runs(paragraph: ET.Element) -> list[dict[str, Any]]:
    return [_docx_run_record(run) for run in paragraph.iter() if _is_xml(run, "r", WORD_NS_HINT)]


def _drawing_run_record(run: ET.Element) -> dict[str, Any]:
    record: dict[str, Any] = {"text": _text_with_breaks(run, "t", namespace_hint=DRAWING_NS_HINT)}
    if any(_is_xml(node, "b", DRAWING_NS_HINT) for node in run.iter()):
        record["bold"] = True
    if any(_is_xml(node, "i", DRAWING_NS_HINT) for node in run.iter()):
        record["italic"] = True
    return record


def _drawing_paragraph_records(element: ET.Element) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for index, paragraph in enumerate(
        (child for child in element.iter() if _is_xml(child, "p", DRAWING_NS_HINT))
    ):
        runs = [
            _drawing_run_record(run)
            for run in paragraph.iter()
            if _is_xml(run, "r", DRAWING_NS_HINT)
        ]
        records.append(
            {
                "paragraphIndex": index,
                "text": _nfc("".join(run["text"] for run in runs)),
                "runs": runs,
            }
        )
    return records


def _answer_provenance(
    runs: Iterable[dict[str, Any]],
    *,
    locator: dict[str, Any],
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for run in runs:
        text = run.get("text", "")
        if not text:
            continue
        if run.get("b") or run.get("bold") or re.search(r"\b(?:answer|correct)\b", text, re.IGNORECASE):
            candidates.append({"text": text, "evidence": "format_or_label", **locator})
    return candidates


def _read_zip_xml(zf: zipfile.ZipFile, member: str) -> tuple[ET.Element | None, str | None]:
    try:
        info = zf.getinfo(member)
    except KeyError:
        return None, "missing_member:" + member
    if info.file_size > MAX_XML_MEMBER_SIZE:
        return None, "xml_member_too_large:" + member
    try:
        data = zf.read(info)
    except (OSError, RuntimeError, zipfile.BadZipFile, zlib.error):
        return None, "member_read_error:" + member
    try:
        return ET.fromstring(data), None
    except ET.ParseError:
        return None, "xml_parse_error:" + member




def _zip_info_map(zf: zipfile.ZipFile) -> dict[str, zipfile.ZipInfo]:
    result: dict[str, zipfile.ZipInfo] = {}
    try:
        infos = sorted(zf.infolist(), key=lambda info: (_clean_member_name(info.filename), info.header_offset))
    except (OSError, RuntimeError, zipfile.BadZipFile):
        return result
    for info in infos:
        name = _clean_member_name(info.filename)
        if name and name not in result and not info.is_dir():
            result[name] = info
    return result


def _archive_member_record(
    zf: zipfile.ZipFile,
    info: zipfile.ZipInfo,
    source_id: str,
    relative_path: str,
) -> tuple[dict[str, Any], str | None]:
    member_path = _clean_member_name(info.filename)
    try:
        with zf.open(info, "r") as stream:
            byte_size, digest = _hash_stream(stream)
        status = "ok"
        error = None
    except (OSError, RuntimeError, ValueError, zipfile.BadZipFile, zlib.error):
        byte_size, digest, status, error = None, None, "error", "member_read_error"
    extension = Path(member_path).suffix.lower().lstrip(".")
    storage_key = "media/" + digest + ("." + extension if extension else "") if digest else None
    record = {
        "assetId": _asset_id(source_id, member_path, relative_path),
        "sourceId": source_id,
        "relativePath": relative_path,
        "memberPath": member_path,
        "kind": _media_kind(member_path),
        "byteSize": byte_size,
        "sha256": digest,
        "storageKey": storage_key,
        "status": status,
    }
    return record, error


def _archive_media(
    zf: zipfile.ZipFile,
    prefix: str,
    source_id: str,
    relative_path: str,
) -> tuple[list[dict[str, Any]], list[str]]:
    assets: list[dict[str, Any]] = []
    errors: list[str] = []
    infos = _zip_info_map(zf)
    for member_path, info in sorted(infos.items()):
        if not member_path.startswith(prefix):
            continue
        record, error = _archive_member_record(zf, info, source_id, relative_path)
        assets.append(record)
        if error:
            errors.append(error + ":" + member_path)
    return assets, errors
def _convert_embedded_assets(
    zf: zipfile.ZipFile,
    assets: Iterable[dict[str, Any]],
    *,
    relative_path: str,
) -> tuple[list[dict[str, Any]], list[str]]:
    derived: list[dict[str, Any]] = []
    errors: list[str] = []
    if not CONVERTER_SCRIPT.is_file():
        return [], ["missing_dependency:curriculum_media_converter"]
    for asset in assets:
        member_path = asset.get("memberPath")
        if not isinstance(member_path, str):
            continue
        source_format = CONVERTIBLE_MEDIA_SUFFIXES.get(Path(member_path).suffix.lower())
        if source_format is None:
            continue
        try:
            source_bytes = zf.read(member_path)
        except (KeyError, OSError, RuntimeError, zipfile.BadZipFile, zlib.error):
            errors.append("conversion_source_read_error:" + member_path)
            continue
        try:
            with tempfile.TemporaryDirectory(prefix="gamer-icu-media-") as directory:
                directory_path = Path(directory)
                input_path = directory_path / Path(member_path).name
                output_path = directory_path / (Path(member_path).stem + ".png")
                input_path.write_bytes(source_bytes)
                result = subprocess.run(
                    [
                        "node",
                        str(CONVERTER_SCRIPT),
                        "--format",
                        source_format,
                        "--input",
                        str(input_path),
                        "--output",
                        str(output_path),
                    ],
                    check=False,
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0 or not output_path.is_file():
                    errors.append("conversion_failed:" + member_path)
                    continue
                converted = output_path.read_bytes()
        except (OSError, ValueError):
            errors.append("conversion_failed:" + member_path)
            continue
        digest = hashlib.sha256(converted).hexdigest()
        derived.append(
            {
                "assetId": _asset_id(asset["sourceId"], member_path + "#browser-png", relative_path),
                "sourceAssetId": asset["assetId"],
                "sourceId": asset["sourceId"],
                "relativePath": relative_path,
                "memberPath": None,
                "sourceMemberPath": member_path,
                "kind": "image",
                "byteSize": len(converted),
                "sha256": digest,
                "storageKey": "media/" + digest + ".png",
                "status": "ok",
                "browserCompatible": True,
                "originalSha256": asset.get("sha256"),
                "originalStorageKey": asset.get("storageKey"),
                "conversion": {
                    "sourceFormat": source_format,
                    "outputFormat": "png",
                    "tool": "tools/convert_curriculum_media.js",
                    "jpegxr": "jpegxr@0.3.0" if source_format == "wdp" else None,
                    "emfConverter": "emf-converter@2.0.2" if source_format in {"emf", "wmf"} else None,
                    "canvas": "@napi-rs/canvas@1.0.5" if source_format in {"emf", "wmf"} else None,
                },
            }
        )
    return derived, errors


def _parse_relationships(
    zf: zipfile.ZipFile,
    rel_member: str,
) -> tuple[list[dict[str, Any]], list[str]]:
    root, error = _read_zip_xml(zf, rel_member)
    if error:
        return [], [error]
    relationships: list[dict[str, Any]] = []
    assert root is not None
    for child in list(root):
        if _local_name(child.tag) != "Relationship":
            continue
        rel_id = _attribute(child, "Id") or ""
        target = _nfc(_attribute(child, "Target") or "")
        rel_type = _nfc(_attribute(child, "Type") or "")
        target_mode = _nfc(_attribute(child, "TargetMode") or "")
        item: dict[str, Any] = {"id": rel_id, "target": target, "type": rel_type}
        if target_mode:
            item["targetMode"] = target_mode
        relationships.append(item)
    return relationships, []


def _relationship_ids(element: ET.Element) -> list[str]:
    ids: list[str] = []
    for child in element.iter():
        for key, value in child.attrib.items():
            if _local_name(key) in {"embed", "link", "id"} and value.startswith("rId"):
                if value not in ids:
                    ids.append(value)
    return ids


def _docx_drawing_record(drawing: ET.Element) -> dict[str, Any]:
    record: dict[str, Any] = {
        "relationshipIds": _relationship_ids(drawing),
        "xmlTag": _local_name(drawing.tag),
    }
    extent = next((node for node in drawing.iter() if _is_xml(node, "extent", "/wordprocessingDrawing/")), None)
    if extent is not None:
        record["extent"] = {
            "cx": _attribute(extent, "cx"),
            "cy": _attribute(extent, "cy"),
        }
    doc_pr = next((node for node in drawing.iter() if _is_xml(node, "docPr", "/wordprocessingDrawing/")), None)
    if doc_pr is not None:
        record["docPr"] = {
            "id": _attribute(doc_pr, "id"),
            "name": _attribute(doc_pr, "name"),
            "descr": _attribute(doc_pr, "descr"),
        }
    return record
def _docx_ordered_content(paragraph: ET.Element) -> list[dict[str, Any]]:
    """Preserve the paragraph's text/drawing order from the OOXML tree.

    Existing ``text``, ``runs``, and ``drawings`` fields remain aggregate
    compatibility views. This sequence is the lossless learner-facing view
    for paragraphs that interleave authored text and inline drawings.
    """
    ordered: list[dict[str, Any]] = []
    consumed_drawings: set[int] = set()
    run_index = 0
    drawing_index = 0
    for node in paragraph.iter():
        if _is_xml(node, "r", WORD_NS_HINT):
            run = _docx_run_record(node)
            for child in node.iter():
                if child is node:
                    continue
                if _is_xml(child, "drawing", WORD_NS_HINT):
                    drawing = _docx_drawing_record(child)
                    consumed_drawings.add(id(child))
                    ordered.append(
                        {
                            "kind": "drawing",
                            "runIndex": run_index,
                            "drawingIndex": drawing_index,
                            **drawing,
                        }
                    )
                    drawing_index += 1
                elif _is_xml(child, "t", WORD_NS_HINT) and child.text:
                    ordered.append({"kind": "text", "text": _nfc(child.text), "runIndex": run_index})
                elif _is_xml(child, "tab", WORD_NS_HINT):
                    ordered.append({"kind": "text", "text": "\t", "runIndex": run_index})
                elif _is_xml(child, "br", WORD_NS_HINT) or _is_xml(child, "cr", WORD_NS_HINT):
                    ordered.append({"kind": "text", "text": "\n", "runIndex": run_index})
            run_index += 1
        elif _is_xml(node, "drawing", WORD_NS_HINT) and id(node) not in consumed_drawings:
            ordered.append(
                {
                    "kind": "drawing",
                    "runIndex": None,
                    "drawingIndex": drawing_index,
                    **_docx_drawing_record(node),
                }
            )
            drawing_index += 1
    return ordered


def _docx_enrich_record_media(
    record: dict[str, Any],
    media_refs: Iterable[dict[str, Any]],
    *,
    block_index: int,
) -> list[dict[str, Any]]:
    references = list(media_refs)

    def refs_for_ids(relationship_ids: Iterable[str]) -> list[dict[str, Any]]:
        return [
            {
                **reference,
                "blockIndex": block_index,
                "relationshipId": relationship_id,
            }
            for relationship_id in relationship_ids
            for reference in references
            if reference["relationshipId"] == relationship_id
        ]

    collected: list[dict[str, Any]] = []
    drawings = record.get("drawings")
    if isinstance(drawings, list):
        for drawing in drawings:
            if isinstance(drawing, dict):
                collected.extend(refs_for_ids(drawing.get("relationshipIds", [])))
    ordered_content = record.get("orderedContent")
    if isinstance(ordered_content, list):
        enriched: list[dict[str, Any]] = []
        for item in ordered_content:
            if not isinstance(item, dict) or item.get("kind") != "drawing":
                enriched.append(item)
                continue
            item_refs = refs_for_ids(item.get("relationshipIds", []))
            enriched.append({**item, "mediaRefs": item_refs})
        record["orderedContent"] = enriched
    row_records = record.get("rowRecords")
    if isinstance(row_records, list):
        for row in row_records:
            if not isinstance(row, dict):
                continue
            cells = row.get("cells")
            if not isinstance(cells, list):
                continue
            for cell in cells:
                if not isinstance(cell, dict):
                    continue
                paragraphs = cell.get("paragraphs")
                if not isinstance(paragraphs, list):
                    continue
                for paragraph in paragraphs:
                    if isinstance(paragraph, dict):
                        collected.extend(_docx_enrich_record_media(paragraph, references, block_index=block_index))
    if collected:
        record["mediaRefs"] = collected
    return collected






def _docx_paragraph_record(
    paragraph: ET.Element,
    *,
    block_index: int | None = None,
    body_index: int | None = None,
) -> dict[str, Any]:
    runs = _docx_runs(paragraph)
    record: dict[str, Any] = {
        "kind": "paragraph",
        "text": _text_with_breaks(paragraph, "t", namespace_hint=WORD_NS_HINT),
        "runs": runs,
        "drawings": [
            _docx_drawing_record(drawing)
            for drawing in paragraph.iter()
            if _is_xml(drawing, "drawing", WORD_NS_HINT)
        ],
        "orderedContent": _docx_ordered_content(paragraph),
    }
    if block_index is not None:
        record["blockIndex"] = block_index
    if body_index is not None:
        record["bodyIndex"] = body_index
    answer_evidence = _answer_provenance(runs, locator={"kind": "body", "blockIndex": block_index})
    if answer_evidence:
        record["answerEvidence"] = answer_evidence
    return record


def _docx_table_record(
    table: ET.Element,
    *,
    block_index: int | None = None,
    body_index: int | None = None,
) -> dict[str, Any]:
    rows: list[list[str]] = []
    row_records: list[dict[str, Any]] = []
    for row_index, row in enumerate(child for child in list(table) if _is_xml(child, "tr", WORD_NS_HINT)):
        cells: list[str] = []
        cell_records: list[dict[str, Any]] = []
        for cell_index, cell in enumerate(child for child in list(row) if _is_xml(child, "tc", WORD_NS_HINT)):
            text = _text_with_breaks(cell, "t", namespace_hint=WORD_NS_HINT)
            cells.append(text)
            cell_records.append(
                {
                    "cellIndex": cell_index,
                    "text": text,
                    "paragraphs": [
                        _docx_paragraph_record(paragraph)
                        for paragraph in cell.iter()
                        if _is_xml(paragraph, "p", WORD_NS_HINT)
                    ],
                }
            )
        rows.append(cells)
        row_records.append({"rowIndex": row_index, "cells": cell_records})
    record: dict[str, Any] = {"kind": "table", "rows": rows, "rowRecords": row_records}
    if block_index is not None:
        record["blockIndex"] = block_index
    if body_index is not None:
        record["bodyIndex"] = body_index
    return record


def _docx_table(table: ET.Element) -> dict[str, Any]:
    return _docx_table_record(table)


def _parse_docx(
    path: Path,
    source_id: str,
    relative_path: str,
) -> tuple[str, dict[str, Any] | None, list[str], list[str], list[dict[str, Any]], list[dict[str, Any]]]:
    errors: list[str] = []
    missing: list[str] = []
    media_assets: list[dict[str, Any]] = []
    media_refs: list[dict[str, Any]] = []
    try:
        zf = zipfile.ZipFile(path, "r")
    except (OSError, zipfile.BadZipFile):
        return "error", None, ["invalid_zip"], missing, media_assets, media_refs
    with zf:
        info_map = _zip_info_map(zf)
        root, xml_error = _read_zip_xml(zf, "word/document.xml")
        if xml_error:
            errors.append(xml_error)
            content = {"format": "docx", "blocks": [], "relationships": [], "mediaMembers": []}
            return "error", content, errors, missing, media_assets, media_refs
        assert root is not None
        relationships, rel_errors = _parse_relationships(zf, "word/_rels/document.xml.rels")
        if rel_errors and "word/_rels/document.xml.rels" in info_map:
            errors.extend(rel_errors)
        for relationship in relationships:
            target = relationship.get("target", "")
            if relationship.get("targetMode", "").lower() == "external":
                continue
            resolved = _resolve_member("word/document.xml", target)
            if resolved:
                relationship["resolvedMemberPath"] = resolved
            rel_type = relationship.get("type", "").lower()
            if resolved and ("/media/" in "/" + resolved or "image" in rel_type):
                present = resolved in info_map
                media_refs.append(
                    {
                        "relationshipId": relationship.get("id", ""),
                        "memberPath": resolved,
                        "status": "ok" if present else "missing",
                    }
                )
                if not present:
                    errors.append("missing_media_member:" + resolved)
        body = next((node for node in root.iter() if _is_xml(node, "body", WORD_NS_HINT)), None)
        blocks: list[dict[str, Any]] = []
        answer_provenance: list[dict[str, Any]] = []
        if body is None:
            errors.append("missing_body")
        else:
            block_index = 0
            for body_index, child in enumerate(list(body)):
                if _is_xml(child, "p", WORD_NS_HINT):
                    block = _docx_paragraph_record(
                        child,
                        block_index=block_index,
                        body_index=body_index,
                    )
                elif _is_xml(child, "tbl", WORD_NS_HINT):
                    block = _docx_table_record(
                        child,
                        block_index=block_index,
                        body_index=body_index,
                    )
                else:
                    continue
                block["sourceId"] = source_id
                block["relativePath"] = relative_path
                block["documentKind"] = "docx"
                block["orderedIndex"] = block_index
                block["locator"] = {"kind": "body", "bodyIndex": body_index, "blockIndex": block_index}
                _docx_enrich_record_media(block, media_refs, block_index=block_index)
                for evidence in block.get("answerEvidence", []):
                    answer_provenance.append(
                        {
                            **evidence,
                            "relativePath": relative_path,
                            "sourceId": source_id,
                        }
                    )
                blocks.append(block)
                block_index += 1
        media_assets, media_errors = _archive_media(zf, "word/media/", source_id, relative_path)
        errors.extend(media_errors)
        derived_assets, conversion_errors = _convert_embedded_assets(zf, media_assets, relative_path=relative_path)
        media_assets.extend(derived_assets)
        errors.extend(conversion_errors)
        asset_by_member = {asset["memberPath"]: asset for asset in media_assets if asset.get("memberPath")}
        for reference in media_refs:
            asset = asset_by_member.get(reference["memberPath"])
            if asset is not None:
                reference["assetId"] = asset["assetId"]
        for block in blocks:
            _docx_enrich_record_media(block, media_refs, block_index=block.get("blockIndex", -1))
        for relationship in relationships:
            asset = asset_by_member.get(relationship.get("resolvedMemberPath"))
            if asset is not None:
                relationship["assetId"] = asset["assetId"]
        content = {
            "format": "docx",
            "documentKind": "docx",
            "blocks": blocks,
            "orderedBlocks": blocks,
            "relationships": relationships,
            "mediaRefs": media_refs,
            "answerProvenance": answer_provenance,
            "mediaMembers": [
                {
                    "assetId": asset["assetId"],
                    "sourceAssetId": asset.get("sourceAssetId"),
                    "memberPath": asset["memberPath"],
                    "sourceMemberPath": asset.get("sourceMemberPath"),
                    "kind": asset["kind"],
                    "byteSize": asset["byteSize"],
                    "sha256": asset["sha256"],
                    "originalSha256": asset.get("originalSha256"),
                    "storageKey": asset["storageKey"],
                    "originalStorageKey": asset.get("originalStorageKey"),
                    "conversion": asset.get("conversion"),
                    "status": asset["status"],
                }
                for asset in media_assets
            ],
        }
        status = _status_for_content(content, errors, missing, empty=not blocks)
        return status, content, _error_list(*errors), missing, media_assets, media_refs


def _drawing_text(paragraph: ET.Element) -> str:
    return _text_with_breaks(
        paragraph,
        "t",
        tab_local="tab",
        break_local="br",
        namespace_hint=DRAWING_NS_HINT,
    )


def _drawing_paragraphs(element: ET.Element) -> list[str]:
    return [
        record["text"]
        for record in _drawing_paragraph_records(element)
    ]


def _drawing_table(table: ET.Element) -> list[list[str]]:
    rows: list[list[str]] = []
    for row in list(table):
        if not _is_xml(row, "tr", DRAWING_NS_HINT):
            continue
        cells: list[str] = []
        for cell in list(row):
            if _is_xml(cell, "tc", DRAWING_NS_HINT):
                cells.append("\n".join(_drawing_paragraphs(cell)))
        rows.append(cells)
    return rows


def _drawing_table_records(table: ET.Element) -> dict[str, Any]:
    rows: list[list[str]] = []
    row_records: list[dict[str, Any]] = []
    for row_index, row in enumerate(child for child in list(table) if _is_xml(child, "tr", DRAWING_NS_HINT)):
        cells: list[str] = []
        cell_records: list[dict[str, Any]] = []
        for cell_index, cell in enumerate(child for child in list(row) if _is_xml(child, "tc", DRAWING_NS_HINT)):
            paragraphs = _drawing_paragraph_records(cell)
            text = "\n".join(paragraph["text"] for paragraph in paragraphs)
            cells.append(text)
            cell_records.append({"cellIndex": cell_index, "text": text, "paragraphs": paragraphs})
        rows.append(cells)
        row_records.append({"rowIndex": row_index, "cells": cell_records})
    return {"rows": rows, "rowRecords": row_records}


def _numeric_attribute(value: str | None) -> int | float | None:
    if value is None:
        return None
    try:
        number = int(value)
        return number
    except ValueError:
        try:
            return float(value)
        except ValueError:
            return value


def _shape_geometry(shape: ET.Element) -> dict[str, int | float | None]:
    transform = next((node for node in shape.iter() if _is_xml(node, "xfrm", DRAWING_NS_HINT)), None)
    if transform is None:
        return {"x": None, "y": None, "w": None, "h": None}
    offset = next((node for node in transform if _is_xml(node, "off", DRAWING_NS_HINT)), None)
    extent = next((node for node in transform if _is_xml(node, "ext", DRAWING_NS_HINT)), None)
    return {
        "x": _numeric_attribute(_attribute(offset, "x")) if offset is not None else None,
        "y": _numeric_attribute(_attribute(offset, "y")) if offset is not None else None,
        "w": _numeric_attribute(_attribute(extent, "cx")) if extent is not None else None,
        "h": _numeric_attribute(_attribute(extent, "cy")) if extent is not None else None,
    }


def _shape_identity(shape: ET.Element) -> dict[str, Any]:
    properties = next((node for node in shape.iter() if _is_xml(node, "cNvPr", DRAWING_NS_HINT)), None)
    return {
        "shapeType": _local_name(shape.tag),
        "shapeId": _attribute(properties, "id") if properties is not None else None,
        "name": _attribute(properties, "name") if properties is not None else None,
    }


def _pptx_shape_record(shape: ET.Element, shape_index: int) -> dict[str, Any]:
    paragraphs = _drawing_paragraph_records(shape)
    tables = [
        _drawing_table_records(table)
        for table in shape.iter()
        if _is_xml(table, "tbl", DRAWING_NS_HINT)
    ]
    text = "\n".join(paragraph["text"] for paragraph in paragraphs)
    record = {
        **_shape_identity(shape),
        **_shape_geometry(shape),
        "shapeIndex": shape_index,
        "zOrder": shape_index,
        "text": text,
        "paragraphs": paragraphs,
        "tables": tables,
        "relationshipIds": _relationship_ids(shape),
        "xml": _nfc(ET.tostring(shape, encoding="unicode")),
    }
    evidence = _answer_provenance(
        [run for paragraph in paragraphs for run in paragraph["runs"]],
        locator={"shapeIndex": shape_index},
    )
    if evidence:
        record["answerEvidence"] = evidence
    return record

def _pptx_slide_record(
    zf: zipfile.ZipFile,
    slide_member: str,
    slide_index: int,
    info_map: dict[str, zipfile.ZipInfo],
) -> tuple[dict[str, Any], list[str], list[dict[str, Any]]]:
    errors: list[str] = []
    media_refs: list[dict[str, Any]] = []
    root, xml_error = _read_zip_xml(zf, slide_member)
    if xml_error:
        return {
            "slide": slide_index,
            "slideIndex": slide_index,
            "memberPath": slide_member,
            "paragraphs": [],
            "tables": [],
            "shapes": [],
            "orderedBlocks": [],
            "text": "",
            "notes": None,
            "relationships": [],
            "mediaRefs": [],
            "answerProvenance": [],
        }, [xml_error], media_refs
    assert root is not None
    shape_tree = next((node for node in root.iter() if _is_xml(node, "spTree", PRESENTATION_NS_HINT)), None)
    shapes: list[dict[str, Any]] = []
    if shape_tree is not None:
        shape_children = list(shape_tree)
        for xml_index, shape in enumerate(shape_children):
            if _local_name(shape.tag) in {"nvGrpSpPr", "grpSpPr"}:
                continue
            shapes.append(_pptx_shape_record(shape, xml_index))
    paragraphs = [paragraph["text"] for shape in shapes for paragraph in shape["paragraphs"]]
    tables = [table["rows"] for shape in shapes for table in shape["tables"]]
    rel_member = posixpath.join(posixpath.dirname(slide_member), "_rels", Path(slide_member).name + ".rels")
    relationships, rel_errors = _parse_relationships(zf, _clean_member_name(rel_member))
    if rel_errors and _clean_member_name(rel_member) in info_map:
        errors.extend(rel_errors)
    for relationship in relationships:
        target = relationship.get("target", "")
        resolved = _resolve_member(slide_member, target)
        if resolved:
            relationship["resolvedMemberPath"] = resolved
        rel_type = relationship.get("type", "").lower()
        if "notesslide" in rel_type or "noteslide" in rel_type:
            continue
        if resolved and ("/media/" in "/" + resolved or "/image" in rel_type or "/media" in rel_type):
            present = resolved in info_map
            ref = {
                "relationshipId": relationship.get("id", ""),
                "memberPath": resolved,
                "status": "ok" if present else "missing",
            }
            media_refs.append(ref)
            if not present:
                errors.append("missing_media_member:" + resolved)
    for shape in shapes:
        refs = []
        for relationship_id in shape["relationshipIds"]:
            refs.extend(
                {
                    **reference,
                    "shapeIndex": shape["shapeIndex"],
                    "relationshipId": relationship_id,
                }
                for reference in media_refs
                if reference["relationshipId"] == relationship_id
            )
        if refs:
            shape["mediaRefs"] = refs
    notes: dict[str, Any] | None = None
    notes_relationship = next(
        (relationship for relationship in relationships if "notesslide" in relationship.get("type", "").lower() or "noteslide" in relationship.get("type", "").lower()),
        None,
    )
    if notes_relationship is not None:
        notes_member = notes_relationship.get("resolvedMemberPath")
        if notes_member is None:
            errors.append("invalid_notes_member")
        else:
            notes_root, notes_error = _read_zip_xml(zf, notes_member)
            if notes_error:
                errors.append(notes_error)
            elif notes_root is not None:
                note_records = _drawing_paragraph_records(notes_root)
                notes = {
                    "memberPath": notes_member,
                    "paragraphs": [record["text"] for record in note_records],
                    "paragraphRecords": note_records,
                    "text": "\n".join(record["text"] for record in note_records),
                }
    answer_provenance: list[dict[str, Any]] = []
    for shape in shapes:
        for evidence in shape.get("answerEvidence", []):
            answer_provenance.append({"slide": slide_index, **evidence})
    if notes is not None:
        answer_provenance.extend(
            {
                "slide": slide_index,
                **evidence,
                "kind": "speaker_note",
            }
            for evidence in _answer_provenance(
                [run for paragraph in notes["paragraphRecords"] for run in paragraph["runs"]],
                locator={"memberPath": notes["memberPath"]},
            )
        )
    slide = {
        "slide": slide_index,
        "slideIndex": slide_index,
        "memberPath": slide_member,
        "paragraphs": paragraphs,
        "tables": tables,
        "shapes": shapes,
        "orderedBlocks": shapes,
        "text": "\n".join(paragraphs),
        "notes": notes,
        "relationships": relationships,
        "mediaRefs": media_refs,
        "answerProvenance": answer_provenance,
    }
    return slide, errors, media_refs
def _parse_pptx(
    path: Path,
    source_id: str,
    relative_path: str,
) -> tuple[str, dict[str, Any] | None, list[str], list[str], list[dict[str, Any]], list[dict[str, Any]]]:
    errors: list[str] = []
    missing: list[str] = []
    media_refs: list[dict[str, Any]] = []
    try:
        zf = zipfile.ZipFile(path, "r")
    except (OSError, zipfile.BadZipFile):
        return "error", None, ["invalid_zip"], missing, [], media_refs
    with zf:
        info_map = _zip_info_map(zf)
        root, xml_error = _read_zip_xml(zf, "ppt/presentation.xml")
        if xml_error:
            errors.append(xml_error)
            content = {"format": "pptx", "slides": [], "relationships": [], "mediaMembers": []}
            return "error", content, errors, missing, [], media_refs
        assert root is not None
        presentation_rels, rel_errors = _parse_relationships(zf, "ppt/_rels/presentation.xml.rels")
        if rel_errors and "ppt/_rels/presentation.xml.rels" in info_map:
            errors.extend(rel_errors)
        relationship_by_id = {item.get("id", ""): item for item in presentation_rels}
        slide_members: list[str] = []
        slide_list = next((node for node in root.iter() if _is_xml(node, "sldIdLst", PRESENTATION_NS_HINT)), None)
        if slide_list is None:
            errors.append("missing_slide_list")
        else:
            for child in list(slide_list):
                if not _is_xml(child, "sldId", PRESENTATION_NS_HINT):
                    continue
                rel_id = next(
                    (
                        value
                        for key, value in child.attrib.items()
                        if key
                        in {
                            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id",
                            "{http://purl.oclc.org/ooxml/officeDocument/relationships}id",
                        }
                        and value.startswith("rId")
                    ),
                    "",
                )
                relationship = relationship_by_id.get(rel_id)
                if relationship is None:
                    errors.append("missing_slide_relationship:" + rel_id)
                    continue
                member = _resolve_member("ppt/presentation.xml", relationship.get("target", ""))
                if member is None:
                    errors.append("invalid_slide_member:" + rel_id)
                else:
                    slide_members.append(member)
        if not slide_members:
            fallback = sorted(name for name in info_map if re.fullmatch(r"ppt/slides/slide\d+\.xml", name))
            if fallback:
                slide_members = fallback
                errors.append("slide_order_fallback")
        slides: list[dict[str, Any]] = []
        all_slide_relationships: list[dict[str, Any]] = []
        for index, member in enumerate(slide_members, start=1):
            slide, slide_errors, refs = _pptx_slide_record(zf, member, index, info_map)
            slide["sourceId"] = source_id
            slide["relativePath"] = relative_path
            slide["documentKind"] = "pptx"
            slide["pageOrSlideIndex"] = index
            for shape in slide.get("shapes", []):
                shape["sourceId"] = source_id
                shape["relativePath"] = relative_path
                shape["documentKind"] = "pptx"
                shape["orderedIndex"] = shape.get("shapeIndex")
                shape["locator"] = {
                    "kind": "slide",
                    "slide": index,
                    "shapeIndex": shape.get("shapeIndex"),
                }
            for evidence in slide.get("answerProvenance", []):
                evidence["sourceId"] = source_id
                evidence["relativePath"] = relative_path
                evidence["documentKind"] = "pptx"
            slides.append(slide)
            errors.extend(slide_errors)
            media_refs.extend({"slide": index, **ref} for ref in refs)
            slide_rels = slide.get("relationships", [])
            all_slide_relationships.extend({"part": member, **item} for item in slide_rels)
        media_assets, media_errors = _archive_media(zf, "ppt/media/", source_id, relative_path)
        errors.extend(media_errors)
        derived_assets, conversion_errors = _convert_embedded_assets(zf, media_assets, relative_path=relative_path)
        media_assets.extend(derived_assets)
        errors.extend(conversion_errors)
        asset_by_member = {asset["memberPath"]: asset for asset in media_assets if asset.get("memberPath")}
        for reference in media_refs:
            asset = asset_by_member.get(reference["memberPath"])
            if asset is not None:
                reference["assetId"] = asset["assetId"]
        for slide in slides:
            for reference in slide.get("mediaRefs", []):
                asset = asset_by_member.get(reference["memberPath"])
                if asset is not None:
                    reference["assetId"] = asset["assetId"]
            for shape in slide.get("shapes", []):
                for reference in shape.get("mediaRefs", []):
                    asset = asset_by_member.get(reference["memberPath"])
                    if asset is not None:
                        reference["assetId"] = asset["assetId"]
            for relationship in slide.get("relationships", []):
                asset = asset_by_member.get(relationship.get("resolvedMemberPath"))
                if asset is not None:
                    relationship["assetId"] = asset["assetId"]
        for relationship in presentation_rels:
            resolved = _resolve_member("ppt/presentation.xml", relationship.get("target", ""))
            asset = asset_by_member.get(resolved)
            if asset is not None:
                relationship["assetId"] = asset["assetId"]
        relationships = [{"part": "ppt/presentation.xml", **item} for item in presentation_rels] + all_slide_relationships
        content = {
            "format": "pptx",
            "documentKind": "pptx",
            "slides": slides,
            "orderedSlides": slides,
            "relationships": relationships,
            "mediaRefs": media_refs,
            "answerProvenance": [
                evidence
                for slide in slides
                for evidence in slide.get("answerProvenance", [])
            ],
            "mediaMembers": [
                {
                    "assetId": asset["assetId"],
                    "sourceAssetId": asset.get("sourceAssetId"),
                    "memberPath": asset["memberPath"],
                    "sourceMemberPath": asset.get("sourceMemberPath"),
                    "kind": asset["kind"],
                    "byteSize": asset["byteSize"],
                    "sha256": asset["sha256"],
                    "originalSha256": asset.get("originalSha256"),
                    "storageKey": asset["storageKey"],
                    "originalStorageKey": asset.get("originalStorageKey"),
                    "conversion": asset.get("conversion"),
                    "status": asset["status"],
                }
                for asset in media_assets
            ],
        }
        status = _status_for_content(content, errors, missing, empty=not slides)
        return status, content, _error_list(*errors), missing, media_assets, media_refs


def _png_content(path: Path) -> tuple[str, dict[str, Any] | None, list[str]]:
    try:
        with path.open("rb") as stream:
            if stream.read(8) != PNG_SIGNATURE:
                return "error", {"format": "png", "ihdr": None}, ["invalid_png_signature"]
            header = stream.read(8)
            if len(header) != 8:
                return "error", {"format": "png", "ihdr": None}, ["missing_ihdr"]
            length, chunk_type = struct.unpack(">I4s", header)
            if chunk_type != b"IHDR" or length != 13:
                return "error", {"format": "png", "ihdr": None}, ["missing_ihdr"]
            data = stream.read(13)
            if len(data) != 13:
                return "error", {"format": "png", "ihdr": None}, ["truncated_ihdr"]
            width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack(">IIBBBBB", data)
            if width == 0 or height == 0:
                return "error", {"format": "png", "ihdr": None}, ["invalid_png_dimensions"]
            ihdr = {
                "width": width,
                "height": height,
                "bitDepth": bit_depth,
                "colorType": color_type,
                "compression": compression,
                "filter": filter_method,
                "interlace": interlace,
            }
            return "ok", {"format": "png", "ihdr": ihdr}, []
    except OSError:
        return "error", {"format": "png", "ihdr": None}, ["source_read_error"]


def _run_optional(command: str, args: list[str]) -> tuple[str | None, str | None, bool]:
    executable = shutil.which(command)
    if executable is None:
        return None, None, False
    try:
        result = subprocess.run(
            [executable, *args],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
    except (OSError, ValueError):
        return None, None, True
    stdout = result.stdout.decode("utf-8", errors="replace")
    returncode = result.returncode
    if returncode != 0:
        return stdout, None, True
    return stdout, "ok", True


def _camel_key(value: str) -> str:
    words = re.findall(r"[A-Za-z0-9]+", value)
    if not words:
        return "metadata"
    return words[0].lower() + "".join(word[:1].upper() + word[1:].lower() for word in words[1:])


def _pdf_info(path: Path) -> tuple[dict[str, Any] | None, str | None, bool]:
    output, result, present = _run_optional("pdfinfo", [str(path)])
    if not present:
        return None, "pdfinfo", False
    if result != "ok" or output is None:
        return None, "pdfinfo_failed", True
    metadata: dict[str, Any] = {}
    for line in output.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        lowered = key.lower()
        if any(word in lowered for word in TIMESTAMP_WORDS):
            continue
        value = _nfc(value.strip())
        if not value:
            continue
        target = _camel_key(key)
        if target == "pages":
            try:
                metadata[target] = int(value)
                continue
            except ValueError:
                pass
        metadata[target] = value
    return metadata, None, True


def _parse_pdf(path: Path) -> tuple[str, dict[str, Any], list[str], list[str]]:
    errors: list[str] = []
    missing: list[str] = []
    info, info_error, info_present = _pdf_info(path)
    if info_error == "pdfinfo":
        missing.append("pdfinfo")
    elif info_error:
        errors.append(info_error)
    output, result, text_present = _run_optional("pdftotext", ["-layout", str(path), "-"])
    if not text_present:
        missing.append("pdftotext")
        text: str | None = None
    elif result != "ok" or output is None:
        errors.append("pdftotext_failed")
        text = None
    else:
        text = _nfc(output)
    content = {"format": "pdf", "pdfInfo": info, "text": text}
    status = _status_for_content(content, errors, missing, empty=text == "" and not missing and not errors)
    return status, content, _error_list(*errors), sorted(set(missing))


def _strip_probe(value: Any) -> Any:
    if isinstance(value, dict):
        result: dict[str, Any] = {}
        for key in sorted(value):
            lowered = key.lower()
            if lowered in {"filename", "tags", "creation_time", "encoded_date", "date", "time"}:
                continue
            if any(word in lowered for word in TIMESTAMP_WORDS):
                continue
            result[key] = _strip_probe(value[key])
        return result
    if isinstance(value, list):
        return [_strip_probe(item) for item in value]
    if isinstance(value, str):
        return _nfc(value)
    return value


def _parse_media_probe(path: Path, kind: str) -> tuple[str, dict[str, Any], list[str], list[str]]:
    output, result, present = _run_optional(
        "ffprobe",
        ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)],
    )
    if not present:
        return "missing_dependency", {"format": kind, "probe": None}, [], ["ffprobe"]
    if result != "ok" or output is None:
        return "error", {"format": kind, "probe": None}, ["ffprobe_failed"], []
    try:
        probe = _strip_probe(json.loads(output))
    except (ValueError, TypeError):
        return "error", {"format": kind, "probe": None}, ["ffprobe_invalid_json"], []
    return "ok", {"format": kind, "probe": probe}, [], []


def _external_media_asset(
    source_id: str,
    relative_path: str,
    kind: str,
    byte_size: int | None,
    digest: str | None,
    status: str,
) -> dict[str, Any]:
    extension = Path(relative_path).suffix.lower().lstrip(".")
    storage_key = "media/" + digest + ("." + extension if extension else "") if digest else None
    return {
        "assetId": _asset_id(source_id, None, relative_path),
        "sourceId": source_id,
        "relativePath": relative_path,
        "memberPath": None,
        "kind": kind,
        "byteSize": byte_size,
        "sha256": digest,
        "storageKey": storage_key,
        "status": status,
    }


def _inventory(root: Path, out: Path) -> list[tuple[Path, str]]:
    files: list[tuple[Path, str]] = []
    try:
        root_resolved = root.resolve()
    except OSError:
        return files
    try:
        output_resolved = out.resolve()
    except OSError:
        output_resolved = out.absolute()
    for current, directories, names in os.walk(root_resolved, topdown=True, followlinks=False):
        current_path = Path(current)
        kept_directories: list[str] = []
        for name in sorted((name for name in directories if name != ".DS_Store"), key=lambda item: _nfc(item)):
            path = current_path / name
            try:
                if path.is_symlink():
                    continue
                resolved = path.resolve()
                resolved.relative_to(root_resolved)
            except (OSError, ValueError):
                continue
            kept_directories.append(name)
        directories[:] = kept_directories
        for name in sorted((name for name in names if name != ".DS_Store"), key=lambda item: _nfc(item)):
            path = current_path / name
            try:
                if path.is_symlink():
                    continue
                resolved = path.resolve()
                resolved.relative_to(root_resolved)
                if resolved == output_resolved or output_resolved in resolved.parents:
                    continue
            except (OSError, ValueError):
                continue
            relative = _normalize_relative(root_resolved, resolved)
            files.append((resolved, relative))
    return sorted(files, key=lambda item: item[1])



def _extract_one(path: Path, relative_path: str, occurrence: int) -> tuple[dict[str, Any], dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
    source_id = _source_id(relative_path, occurrence)
    kind = _classify(path)
    island_id = _island_id(relative_path)
    byte_size, digest, hash_error = _hash_file(path)
    errors: list[str] = [hash_error] if hash_error else []
    missing: list[str] = []
    content: Any = None
    media_assets: list[dict[str, Any]] = []
    media_refs: list[dict[str, Any]] = []
    if hash_error:
        status = "error"
    elif kind == "unsupported":
        status = "unsupported"
    elif kind == "docx":
        status, content, parse_errors, missing, media_assets, media_refs = _parse_docx(path, source_id, relative_path)
        errors.extend(parse_errors)
    elif kind == "pptx":
        status, content, parse_errors, missing, media_assets, media_refs = _parse_pptx(path, source_id, relative_path)
        errors.extend(parse_errors)
    elif kind == "png":
        status, content, parse_errors = _png_content(path)
        errors.extend(parse_errors)
    elif kind == "pdf":
        status, content, parse_errors, missing = _parse_pdf(path)
        errors.extend(parse_errors)
    else:
        status, content, parse_errors, missing = _parse_media_probe(path, kind)
        errors.extend(parse_errors)
    errors = _error_list(*errors, *(f"missing_dependency:{tool}" for tool in missing))
    source_record = {
        "sourceId": source_id,
        "relativePath": relative_path,
        "kind": kind,
        "islandId": island_id,
        "byteSize": byte_size,
        "sha256": digest,
        "status": status,
        "extractionStatus": status,
        "errors": errors,
        "missingDependencies": sorted(set(missing)),
    }
    content_record = {
        **source_record,
        "content": content,
        "provenance": {
            "sourceId": source_id,
            "relativePath": relative_path,
            "kind": kind,
            "islandId": island_id,
            "sha256": digest,
        },
    }
    if kind in {"png", "video", "audio"}:
        media_assets.append(_external_media_asset(source_id, relative_path, kind, byte_size, digest, status))
    return source_record, content_record, media_assets, media_refs


def _build_outputs(root: Path, out: Path) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    inventory = _inventory(root, out)
    occurrences: dict[str, int] = {}
    source_records: list[dict[str, Any]] = []
    content_records: list[dict[str, Any]] = []
    media_assets: list[dict[str, Any]] = []
    media_refs: list[dict[str, Any]] = []
    for path, relative_path in inventory:
        occurrences[relative_path] = occurrences.get(relative_path, 0) + 1
        source_record, content_record, assets, refs = _extract_one(path, relative_path, occurrences[relative_path])
        source_records.append(source_record)
        content_records.append(content_record)
        media_assets.extend(assets)
        media_refs.extend(
            {
                "sourceId": source_record["sourceId"],
                "relativePath": relative_path,
                **reference,
            }
            for reference in refs
        )
    source_records.sort(key=lambda record: record["relativePath"])
    content_records.sort(key=lambda record: record["relativePath"])
    media_assets.sort(key=lambda asset: (asset["relativePath"], asset.get("memberPath") or ""))
    media_refs.sort(key=lambda ref: (ref["relativePath"], ref.get("memberPath") or "", ref.get("relationshipId") or ""))
    by_kind = {kind: sum(record["kind"] == kind for record in source_records) for kind in KIND_ORDER}
    unsupported_count = sum(record["kind"] == "unsupported" for record in source_records)
    if unsupported_count:
        by_kind["unsupported"] = unsupported_count
    by_island: dict[str, int] = {}
    for record in source_records:
        island = record["islandId"] or "unmapped"
        by_island[island] = by_island.get(island, 0) + 1
    by_island = {key: by_island[key] for key in sorted(by_island)}
    counts = {"total": len(source_records), "byKind": by_kind, "byIsland": by_island}
    source_manifest = {"schemaVersion": 1, "counts": counts, "files": source_records}
    extracted_content = {"schemaVersion": 1, "counts": counts, "sources": content_records}
    media_manifest = {
        "schemaVersion": 1,
        "assets": media_assets,
        "references": media_refs,
    }
    return source_manifest, extracted_content, media_manifest


def _write_json(path: Path, value: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as stream:
        json.dump(value, stream, ensure_ascii=False, allow_nan=False, sort_keys=True, indent=2)
        stream.write("\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path, help="source corpus root")
    parser.add_argument("--out", required=True, type=Path, help="generated output directory")
    arguments = parser.parse_args(argv)
    root = arguments.root.expanduser().resolve()
    out = arguments.out.expanduser()
    if not root.is_dir():
        parser.error("--root must name a directory")
    out.mkdir(parents=True, exist_ok=True)
    source_manifest, extracted_content, media_manifest = _build_outputs(root, out)
    _write_json(out / "source-manifest.json", source_manifest)
    _write_json(out / "extracted-content.json", extracted_content)
    _write_json(out / "media-manifest.json", media_manifest)
    return 0


if __name__ == "__main__":
    sys.exit(main())
