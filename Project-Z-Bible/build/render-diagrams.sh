#!/usr/bin/env bash
# Renders every diagrams/*.mmd Mermaid source to an SVG in assets/images/diagrams/,
# using Mermaid CLI (mmdc). This step is optional: export-pdf.sh and export-docx.sh
# both work without it (Mermaid code blocks are simply shown as source text), but
# running this first gives you rendered diagrams in the PDF/DOCX output.
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
  out="$OUT_DIR/$base.svg"
  echo "Rendering $base.mmd -> ${out#"$ROOT_DIR"/}"
  mmdc -i "$mmd" -o "$out" \
    -b transparent \
    -c "$MERMAID_CONFIG" \
    -p "$PUPPETEER_CONFIG"
  count=$((count + 1))
done

echo
echo "Rendered $count diagram(s) to ${OUT_DIR#"$ROOT_DIR"/}/"
