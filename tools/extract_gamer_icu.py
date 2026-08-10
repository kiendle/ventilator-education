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


def _text_with_breaks(element: ET.Element, text_local: str, *, tab_local: str = "tab", break_local: str = "br") -> str:
    pieces: list[str] = []
    for child in element.iter():
        local = _local_name(child.tag)
        if local == text_local and child.text:
            pieces.append(child.text)
        elif local == tab_local:
            pieces.append("\t")
        elif local in {break_local, "cr", "lineBreak"}:
            pieces.append("\n")
    return _nfc("".join(pieces))


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


def _docx_table(table: ET.Element) -> dict[str, Any]:
    rows: list[list[str]] = []
    for row in list(table):
        if _local_name(row.tag) != "tr":
            continue
        cells: list[str] = []
        for cell in list(row):
            if _local_name(cell.tag) == "tc":
                cells.append(_text_with_breaks(cell, "t"))
        rows.append(cells)
    return {"kind": "table", "rows": rows}


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
        body = next((node for node in root.iter() if _is_xml(node, "body", WORD_NS_HINT)), None)
        blocks: list[dict[str, Any]] = []
        if body is None:
            errors.append("missing_body")
        else:
            for child in list(body):
                if _is_xml(child, "p", WORD_NS_HINT):
                    blocks.append({"kind": "paragraph", "text": _text_with_breaks(child, "t")})
                elif _is_xml(child, "tbl", WORD_NS_HINT):
                    blocks.append(_docx_table(child))
        relationships, rel_errors = _parse_relationships(zf, "word/_rels/document.xml.rels")
        if rel_errors and "word/_rels/document.xml.rels" in info_map:
            errors.extend(rel_errors)
        for relationship in relationships:
            target = relationship.get("target", "")
            if relationship.get("targetMode", "").lower() == "external":
                continue
            resolved = _resolve_member("word/document.xml", target)
            if resolved and "/media/" in "/" + resolved:
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
        media_assets, media_errors = _archive_media(zf, "word/media/", source_id, relative_path)
        errors.extend(media_errors)
        content = {
            "format": "docx",
            "blocks": blocks,
            "relationships": relationships,
            "mediaRefs": media_refs,
            "mediaMembers": [
                {
                    "memberPath": asset["memberPath"],
                    "kind": asset["kind"],
                    "byteSize": asset["byteSize"],
                    "sha256": asset["sha256"],
                    "status": asset["status"],
                }
                for asset in media_assets
            ],
        }
        status = _status_for_content(content, errors, missing, empty=not blocks)
        return status, content, _error_list(*errors), missing, media_assets, media_refs


def _drawing_text(paragraph: ET.Element) -> str:
    return _text_with_breaks(paragraph, "t", tab_local="tab", break_local="br")


def _drawing_paragraphs(element: ET.Element) -> list[str]:
    return [_drawing_text(child) for child in element.iter() if _is_xml(child, "p", DRAWING_NS_HINT)]


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
            "memberPath": slide_member,
            "paragraphs": [],
            "tables": [],
            "text": "",
            "notes": None,
            "mediaRefs": [],
        }, [xml_error], media_refs
    assert root is not None
    paragraphs = _drawing_paragraphs(root)
    tables = [_drawing_table(table) for table in root.iter() if _is_xml(table, "tbl", DRAWING_NS_HINT)]
    rel_member = posixpath.join(posixpath.dirname(slide_member), "_rels", Path(slide_member).name + ".rels")
    relationships, rel_errors = _parse_relationships(zf, _clean_member_name(rel_member))
    if rel_errors and _clean_member_name(rel_member) in info_map:
        errors.extend(rel_errors)
    notes: dict[str, Any] | None = None
    for relationship in relationships:
        target = relationship.get("target", "")
        resolved = _resolve_member(slide_member, target)
        rel_type = relationship.get("type", "").lower()
        if "noteslide" in rel_type:
            if resolved is None:
                errors.append("invalid_notes_member")
                continue
            notes_root, notes_error = _read_zip_xml(zf, resolved)
            if notes_error:
                errors.append(notes_error)
            elif notes_root is not None:
                notes_paragraphs = _drawing_paragraphs(notes_root)
                notes = {"memberPath": resolved, "paragraphs": notes_paragraphs, "text": "\n".join(notes_paragraphs)}
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
    slide = {
        "slide": slide_index,
        "memberPath": slide_member,
        "paragraphs": paragraphs,
        "tables": tables,
        "text": "\n".join(paragraphs),
        "notes": notes,
        "mediaRefs": media_refs,
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
            slides.append(slide)
            errors.extend(slide_errors)
            media_refs.extend({"slide": index, **ref} for ref in refs)
            rel_member = _clean_member_name(posixpath.join(posixpath.dirname(member), "_rels", Path(member).name + ".rels"))
            slide_rels, _ = _parse_relationships(zf, rel_member)
            all_slide_relationships.extend({"part": member, **item} for item in slide_rels)
        media_assets, media_errors = _archive_media(zf, "ppt/media/", source_id, relative_path)
        errors.extend(media_errors)
        relationships = [{"part": "ppt/presentation.xml", **item} for item in presentation_rels] + all_slide_relationships
        content = {
            "format": "pptx",
            "slides": slides,
            "relationships": relationships,
            "mediaRefs": media_refs,
            "mediaMembers": [
                {
                    "memberPath": asset["memberPath"],
                    "kind": asset["kind"],
                    "byteSize": asset["byteSize"],
                    "sha256": asset["sha256"],
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
