#!/usr/bin/env bash
# Renders every diagrams/*.mmd Mermaid source to a PNG in assets/images/diagrams/,
# using Mermaid CLI (mmdc). This step is optional: export-pdf.sh and export-docx.sh
# both work without it (Mermaid code blocks are simply shown as source text), but
# running this first gives you rendered diagrams in the PDF/DOCX output.
#
# Renders to PNG rather than SVG deliberately: Mermaid's default flowchart
# renderer draws node text as HTML inside an SVG <foreignObject>, which
# rsvg-convert (used by pandoc to place images into the PDF/DOCX) can't read --
# it silently drops that text, leaving empty boxes. A PNG is a screenshot of
# what the headless browser actually rendered, so the text (with correct
# spacing/wrapping) is baked into the pixels and always shows up correctly
# regardless of what downstream tool places the image.
#
# Install mermaid-cli if needed:
#   npm install -g @mermaid-js/mermaid-cli
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIAGRAMS_DIR="$ROOT_DIR/diagrams"
OUT_DIR="$ROOT_DIR/assets/images/diagrams"

if ! command -v mmdc >/dev/null 2>&1; then
  echo "error: mmdc (Mermaid CLI) not found." >&2
  echo "Install it with: npm install -g @mermaid-js/mermaid-cli" >&2
  echo "PDF/DOCX exports will still work without this -- diagrams will render as source text instead of images." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

# Puppeteer/Chromium (used by mmdc) needs --no-sandbox in many containerized/CI
# environments. Harmless elsewhere.
PUPPETEER_CONFIG="$SCRIPT_DIR/puppeteer-config.json"
cat > "$PUPPETEER_CONFIG" <<'EOF'
{ "args": ["--no-sandbox", "--disable-setuid-sandbox"] }
EOF

# Lavender & Charcoal theme, applied at render time (see templates/theme.yaml).
MERMAID_CONFIG="$SCRIPT_DIR/mermaid-config.json"
cat > "$MERMAID_CONFIG" <<'EOF'
{
  "theme": "base",
  "themeVariables": {
    "background": "#1E1F24",
    "primaryColor": "#2B2D33",
    "primaryTextColor": "#EDEAF5",
    "primaryBorderColor": "#B9A6E0",
    "lineColor": "#B9A6E0",
    "secondaryColor": "#6C4F9C",
    "tertiaryColor": "#2B2D33"
  }
}
EOF

count=0
for mmd in "$DIAGRAMS_DIR"/*.mmd; do
  [[ -e "$mmd" ]] || continue
  base="$(basename "$mmd" .mmd)"
  out="$OUT_DIR/$base.png"
  echo "Rendering $base.mmd -> ${out#"$ROOT_DIR"/}"
  mmdc -i "$mmd" -o "$out" \
    -b transparent \
    -c "$MERMAID_CONFIG" \
    -p "$PUPPETEER_CONFIG" \
    -s 3
  count=$((count + 1))
done

echo
echo "Rendered $count diagram(s) to ${OUT_DIR#"$ROOT_DIR"/}/"
