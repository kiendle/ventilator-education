#!/usr/bin/env python3
"""Materialize playable curriculum media for local dev and Storybook.

Reads the generated media manifest and symlinks (never copies) each source
asset when possible. Converted browser-compatible PNG assets are regenerated
from their original embedded WDP/EMF bytes with the pinned converter before
being copied to the gitignored ``public/curriculum-media/`` directory.
Original unsupported source bytes remain represented by their manifest hash and
provenance but are never emitted as learner-facing URLs.

Usage:
    python3 tools/materialize_curriculum_media.py \
        --root "$HOME/Downloads/Game-extracted/Game"

Smoke target: Lake Mucosa activity lm-01, source
``1. Lake Mucosa/Oxygenation & MAP_Video.mp4``.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = REPO_ROOT / "src/data/curriculum/generated/media-manifest.json"
SOURCE_MANIFEST = REPO_ROOT / "src/data/curriculum/generated/source-manifest.json"
OUT_DIR = REPO_ROOT / "public/curriculum-media"
CONVERTER_SCRIPT = REPO_ROOT / "tools/convert_curriculum_media.mjs"
VIDEO_SUFFIXES = {".mp4", ".mov"}
MEDIA_SUFFIXES = VIDEO_SUFFIXES | {".mp3", ".wav", ".ogg", ".aac", ".flac", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tif", ".tiff", ".pdf"}


def storage_basename(storage_key: str) -> str:
    """URL/output filename: storageKey without the leading `media/` prefix."""
    name = storage_key.removeprefix("media/").rsplit("/", 1)[-1]
    if not name or "/" in name:
        raise ValueError(f"Unsafe storageKey: {storage_key!r}")
    return name


def link_or_copy(src: Path, dest: Path, copy: bool) -> str:
    if dest.is_symlink() or dest.exists():
        if dest.is_symlink() and dest.resolve() == src.resolve():
            return "present"
        dest.unlink()
    if copy:

        shutil.copyfile(src, dest)
        return "copied"
    dest.symlink_to(src)
    return "linked"


def extract_zip_member(root: Path, relative_path: str, member_path: str, dest: Path) -> str:
    with zipfile.ZipFile(root / relative_path) as archive:
        with archive.open(member_path) as src, open(dest, "wb") as out:
            while chunk := src.read(1024 * 1024):
                out.write(chunk)
    return "extracted"

def convert_asset(root: Path, asset: dict, dest: Path) -> str:
    conversion = asset.get("conversion")
    source_member = asset.get("sourceMemberPath")
    relative_path = asset.get("relativePath") or ""
    if not isinstance(conversion, dict) or not isinstance(source_member, str) or not relative_path:
        raise ValueError("derived media asset is missing conversion provenance")
    source_format = conversion.get("sourceFormat")
    if not isinstance(source_format, str):
        raise ValueError("derived media asset is missing source format")
    with tempfile.TemporaryDirectory(prefix="gamer-icu-media-") as directory:
        directory_path = Path(directory)
        input_path = directory_path / Path(source_member).name
        output_path = directory_path / (Path(source_member).stem + ".png")
        extract_zip_member(root, relative_path, source_member, input_path)
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
            detail = result.stderr.strip() or result.stdout.strip() or "converter failed"
            raise RuntimeError(detail)
        if dest.is_symlink() or dest.exists():
            dest.unlink()
        shutil.copyfile(output_path, dest)
    return "converted"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        required=True,
        help="Path to the extracted source corpus (contains e.g. '1. Lake Mucosa/').",
    )
    parser.add_argument(
        "--copy",
        action="store_true",
        help="Copy instead of symlink (only use if the filesystem cannot symlink).",
    )
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        print(f"error: source root not found: {root}", file=sys.stderr)
        return 1

    manifest = json.loads(MANIFEST.read_text())
    source_manifest = json.loads(SOURCE_MANIFEST.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    linked = missing = 0
    materialized_names: set[str] = set()
    for asset in manifest["assets"]:
        storage_key = asset.get("storageKey") or ""
        relative_path = asset.get("relativePath") or ""
        member_path = asset.get("memberPath")
        if not storage_key or not relative_path:
            continue
        suffix = Path(storage_key).suffix.lower()
        if suffix not in MEDIA_SUFFIXES:
            continue

        dest = OUT_DIR / storage_basename(storage_key)
        if isinstance(asset.get("conversion"), dict):
            try:
                action = convert_asset(root, asset, dest)
            except (FileNotFoundError, KeyError, OSError, RuntimeError, ValueError, zipfile.BadZipFile) as exc:
                source_member = asset.get("sourceMemberPath") or "derived"
                print(f"miss  {relative_path}#{source_member}: {exc}")
                missing += 1
                continue
        elif member_path:
            try:
                action = extract_zip_member(root, relative_path, member_path, dest)
            except (FileNotFoundError, KeyError, zipfile.BadZipFile) as exc:
                print(f"miss  {relative_path}#{member_path}: {exc}")
                missing += 1
                continue
        else:
            src = root / relative_path
            if not src.is_file():
                print(f"miss  {relative_path} (not present under source root)")
                missing += 1
                continue
            action = link_or_copy(src, dest, args.copy)
        if action != "present":
            print(f"{action:<9} {relative_path}{'#' + member_path if member_path else ''} -> {dest.name}")
        linked += 1
        materialized_names.add(dest.name)

    for source in source_manifest["files"]:
        if source.get("kind") != "pdf" or not source.get("sha256"):
            continue
        relative_path = source["relativePath"]
        dest = OUT_DIR / f"{source['sha256']}.pdf"
        if dest.name in materialized_names:
            continue
        src = root / relative_path
        if not src.is_file():
            print(f"miss  {relative_path} (not present under source root)")
            missing += 1
            continue
        action = link_or_copy(src, dest, args.copy)
        if action != "present":
            print(f"{action:<9} {relative_path} -> {dest.name}")
        linked += 1

    print(f"\n{linked} media asset(s) materialized into {OUT_DIR}, {missing} missing at source root.")
    return 0 if missing == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
