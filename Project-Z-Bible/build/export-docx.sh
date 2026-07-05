#!/usr/bin/env bash
# Builds the manuscript and exports it to exports/Project-Z-Bible.docx via Pandoc.
#
# Uses templates/reference.docx for Word styles (headings, table borders, etc) if
# present, generating a default one on first run so the export always succeeds.
# Open templates/reference.docx in Word/LibreOffice afterward and tweak its styles
# to match the Lavender & Charcoal theme (templates/theme.yaml) if you want the
# DOCX export to look closer to the PDF/HTML theme.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
EXPORTS_DIR="$ROOT_DIR/exports"
OUT_FILE="$EXPORTS_DIR/Project-Z-Bible.docx"
REFERENCE_DOCX="$ROOT_DIR/templates/reference.docx"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc is required. Install from https://pandoc.org/installing.html" >&2
  exit 1
fi

# Note: unlike export-pdf.sh, this uses the full manuscript (cover included as
# regular body content) rather than the cover+body split. Pandoc's
# --include-before-body treats its argument as a raw OOXML fragment for DOCX
# output, not Markdown -- pointing it at chapters/00-cover.md's Markdown source
# silently drops the cover instead of rendering it. Word's generated TOC field
# ends up before the cover page as a result (unlike the PDF, where the cover
# correctly comes first) -- reorder them manually in Word if that matters to you.
MANUSCRIPT="$ROOT_DIR/build/Project-Z-Bible.full.md"
mkdir -p "$EXPORTS_DIR"

if [[ ! -f "$REFERENCE_DOCX" ]]; then
  echo "No templates/reference.docx found -- generating pandoc's default one..."
  pandoc -o "$REFERENCE_DOCX" --print-default-data-file reference.docx
  echo "Created $REFERENCE_DOCX -- edit its styles in Word/LibreOffice to customize DOCX look."
fi

echo "Exporting DOCX with pandoc..."

# Run from the project root so the Mermaid filter's relative image paths
# (assets/images/diagrams/...) resolve correctly. --resource-path also includes
# chapters/, since image paths inside chapter files (e.g. "../assets/...") are
# written relative to chapters/ for standalone viewing, not relative to the
# project root the concatenated manuscript is built from.
cd "$ROOT_DIR"
pandoc "$MANUSCRIPT" \
  --metadata-file="$ROOT_DIR/templates/pandoc-metadata-basic.yaml" \
  --resource-path="$ROOT_DIR/chapters:$ROOT_DIR" \
  --lua-filter="$SCRIPT_DIR/mermaid-filter.lua" \
  --reference-doc="$REFERENCE_DOCX" \
  --toc \
  --toc-depth=2 \
  -o "$OUT_FILE"

echo "DOCX written to: ${OUT_FILE#"$ROOT_DIR"/}"
