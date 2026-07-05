#!/usr/bin/env bash
# Builds the manuscript and exports it to exports/Project-Z-Bible.pdf via Pandoc.
#
# Prefers XeLaTeX (supports the custom fonts in templates/pandoc-metadata.yaml).
# Falls back to LuaLaTeX, then plain pdflatex with the font-free
# templates/pandoc-metadata-basic.yaml, so the export still succeeds without a
# full TeX font setup.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
EXPORTS_DIR="$ROOT_DIR/exports"
OUT_FILE="$EXPORTS_DIR/Project-Z-Bible.pdf"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc is required. Install from https://pandoc.org/installing.html" >&2
  exit 1
fi

"$SCRIPT_DIR/build-book.sh"

COVER_FILE="$ROOT_DIR/chapters/00-cover.md"
BODY_FILE="$ROOT_DIR/build/Project-Z-Bible.body.md"
mkdir -p "$EXPORTS_DIR"

engine=""
metadata="$ROOT_DIR/templates/pandoc-metadata.yaml"
for candidate in xelatex lualatex; do
  if command -v "$candidate" >/dev/null 2>&1; then
    engine="$candidate"
    break
  fi
done

if [[ -z "$engine" ]] && command -v pdflatex >/dev/null 2>&1; then
  engine="pdflatex"
  metadata="$ROOT_DIR/templates/pandoc-metadata-basic.yaml"
  echo "note: xelatex/lualatex not found -- falling back to pdflatex without custom fonts." >&2
fi

if [[ -z "$engine" ]]; then
  echo "error: no LaTeX engine found (need one of: xelatex, lualatex, pdflatex)." >&2
  echo "Install a TeX distribution, e.g.:" >&2
  echo "  Debian/Ubuntu: sudo apt-get install texlive-xetex texlive-fonts-recommended" >&2
  echo "  macOS: brew install --cask mactex-no-gui" >&2
  exit 1
fi

# The themed metadata (templates/pandoc-metadata.yaml) requests Georgia / Helvetica
# Neue / JetBrains Mono via fontspec, which XeLaTeX/LuaLaTeX resolve through the
# system's installed fonts -- not bundled with TeX Live. On a machine that doesn't
# have them (common on Linux servers/CI), fontspec fails the whole build. Detect
# that up front and fall back to the font-free metadata instead of erroring out.
if [[ "$metadata" == "$ROOT_DIR/templates/pandoc-metadata.yaml" ]]; then
  fonts_ok=1
  if command -v fc-list >/dev/null 2>&1; then
    for font in "Georgia" "Helvetica Neue" "JetBrains Mono"; do
      if ! fc-list | grep -qi "$font"; then
        fonts_ok=0
        break
      fi
    done
  else
    fonts_ok=0
  fi

  if [[ "$fonts_ok" -eq 0 ]]; then
    metadata="$ROOT_DIR/templates/pandoc-metadata-basic.yaml"
    echo "note: themed fonts (Georgia/Helvetica Neue/JetBrains Mono) not found on this system --" >&2
    echo "      falling back to templates/pandoc-metadata-basic.yaml (LaTeX default fonts)." >&2
    echo "      Install those fonts and re-run to get the full themed look." >&2
  fi
fi

# Run from the project root so the Mermaid filter's relative image paths
# (assets/images/diagrams/...) resolve correctly. --resource-path also includes
# chapters/, since image paths inside chapter files (e.g. "../assets/...") are
# written relative to chapters/ for standalone viewing, not relative to the
# project root the concatenated manuscript is built from.
cd "$ROOT_DIR"

# Pandoc's --include-before-body inserts its argument *raw* into the LaTeX
# source (it doesn't run Markdown through the Markdown reader first) -- so we
# can't point it straight at chapters/00-cover.md, or its "#" heading markers
# etc. get passed through literally and break LaTeX. Pre-render the cover to a
# real .tex fragment first, then include that.
if [[ -f "$COVER_FILE" && -f "$BODY_FILE" ]]; then
  COVER_SOURCE="$ROOT_DIR/build/cover-fragment-source.md"
  cp "$COVER_FILE" "$COVER_SOURCE"

  # pandoc's plain `-t latex` writer emits `\includesvg{...}` for SVG images,
  # which needs the `svg` LaTeX package + --shell-escape (calling out to
  # Inkscape) -- not available/desirable here. Pre-rasterize any SVG the cover
  # references to PDF with rsvg-convert instead, and point the fragment at
  # that, so plain `\includegraphics` works. If rsvg-convert isn't installed,
  # drop the image from the fragment rather than fail the whole PDF build.
  mkdir -p "$ROOT_DIR/build/rendered-svg"
  while IFS= read -r svg_rel; do
    [[ -z "$svg_rel" ]] && continue
    svg_abs="$ROOT_DIR/chapters/$svg_rel"
    if [[ -f "$svg_abs" ]] && command -v rsvg-convert >/dev/null 2>&1; then
      base="$(basename "$svg_rel" .svg)"
      pdf_out="$ROOT_DIR/build/rendered-svg/$base.pdf"
      rsvg-convert -f pdf -o "$pdf_out" "$svg_abs"
      sed -i "s#$svg_rel#build/rendered-svg/$base.pdf#g" "$COVER_SOURCE"
    else
      sed -i -E "\#\!\[[^]]*\]\($svg_rel\)#d" "$COVER_SOURCE"
      echo "note: rsvg-convert not found -- cover image omitted from PDF (install librsvg2-bin/librsvg for full cover art)." >&2
    fi
  done < <(grep -oE '!\[[^]]*\]\([^)]+\.svg\)' "$COVER_FILE" | sed -E 's/^!\[[^]]*\]\((.*)\)$/\1/')

  COVER_FRAGMENT="$ROOT_DIR/build/cover-fragment.tex"
  pandoc "$COVER_SOURCE" \
    --resource-path="$ROOT_DIR:$ROOT_DIR/chapters:$ROOT_DIR" \
    -f markdown -t latex \
    -o "$COVER_FRAGMENT"
  MANUSCRIPT="$BODY_FILE"
  COVER_ARGS=(--include-before-body="$COVER_FRAGMENT")
else
  MANUSCRIPT="$ROOT_DIR/build/Project-Z-Bible.full.md"
  COVER_ARGS=()
fi

echo "Exporting PDF with pandoc (--pdf-engine=$engine)..."
pandoc "$MANUSCRIPT" \
  --metadata-file="$metadata" \
  --resource-path="$ROOT_DIR/chapters:$ROOT_DIR" \
  --lua-filter="$SCRIPT_DIR/mermaid-filter.lua" \
  --pdf-engine="$engine" \
  "${COVER_ARGS[@]}" \
  --toc \
  --toc-depth=2 \
  -o "$OUT_FILE"

echo "PDF written to: ${OUT_FILE#"$ROOT_DIR"/}"
