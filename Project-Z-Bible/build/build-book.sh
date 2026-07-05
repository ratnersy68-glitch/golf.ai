#!/usr/bin/env bash
# Concatenates the chapters listed in book.md (in order) into a single manuscript
# at build/Project-Z-Bible.full.md, with a page break inserted between chapters.
#
# If the first chapter is the cover page (chapters/00-cover.md), also writes
# build/Project-Z-Bible.body.md -- the same manuscript minus that cover chapter --
# so export-pdf.sh/export-docx.sh can inject the cover via pandoc's
# --include-before-body instead of as regular body text. That matters because
# pandoc's auto-generated --toc is placed *before* the body but *after* any
# include-before-body content -- so this ordering is what makes the exported
# PDF/DOCX read Cover -> Table of Contents -> Chapter 1 -> ... instead of
# Table of Contents -> Cover -> Chapter 1 -> ...
#
# Usage:
#   build/build-book.sh            build the manuscript
#   build/build-book.sh --check    report which optional/required tools are available
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BOOK_MANIFEST="$ROOT_DIR/book.md"
OUT_FILE="$ROOT_DIR/build/Project-Z-Bible.full.md"
BODY_FILE="$ROOT_DIR/build/Project-Z-Bible.body.md"
COVER_FILE="$ROOT_DIR/chapters/00-cover.md"

check_tool() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    printf '  [x] %-12s %s\n' "$name" "$("$name" --version 2>/dev/null | head -n1)"
  else
    printf '  [ ] %-12s not found\n' "$name"
  fi
}

if [[ "${1:-}" == "--check" ]]; then
  echo "Project-Z Bible — tool check"
  echo
  echo "Required for any export:"
  check_tool pandoc
  echo
  echo "PDF engines (need at least one for build/export-pdf.sh; xelatex/lualatex preferred for themed fonts):"
  check_tool xelatex
  check_tool lualatex
  check_tool pdflatex
  echo
  echo "Optional — pre-renders Mermaid diagrams to images for PDF/DOCX (build/render-diagrams.sh):"
  check_tool mmdc
  echo
  exit 0
fi

if [[ ! -f "$BOOK_MANIFEST" ]]; then
  echo "error: $BOOK_MANIFEST not found" >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/build"
: > "$OUT_FILE"
: > "$BODY_FILE"

# Pull the ordered "- chapters/....md" lines out of book.md.
mapfile -t CHAPTERS < <(grep -E '^- chapters/.*\.md$' "$BOOK_MANIFEST" | sed -E 's/^- //')

if [[ ${#CHAPTERS[@]} -eq 0 ]]; then
  echo "error: no chapter entries found in $BOOK_MANIFEST (expected lines like '- chapters/00-cover.md')" >&2
  exit 1
fi

echo "Building manuscript from ${#CHAPTERS[@]} chapters listed in book.md..."

first=1
first_body=1
for chapter in "${CHAPTERS[@]}"; do
  chapter_path="$ROOT_DIR/$chapter"
  if [[ ! -f "$chapter_path" ]]; then
    echo "error: chapter listed in book.md not found: $chapter" >&2
    exit 1
  fi

  if [[ $first -eq 0 ]]; then
    printf '\n\n\\newpage\n\n' >> "$OUT_FILE"
  fi
  cat "$chapter_path" >> "$OUT_FILE"
  first=0

  if [[ "$chapter_path" != "$COVER_FILE" ]]; then
    if [[ $first_body -eq 0 ]]; then
      printf '\n\n\\newpage\n\n' >> "$BODY_FILE"
    fi
    cat "$chapter_path" >> "$BODY_FILE"
    first_body=0
  fi

  echo "  + $chapter"
done

echo
echo "Manuscript written to: ${OUT_FILE#"$ROOT_DIR"/}"
if [[ -f "$COVER_FILE" ]]; then
  echo "Body (no cover) written to: ${BODY_FILE#"$ROOT_DIR"/} (for --include-before-body exports)"
fi
