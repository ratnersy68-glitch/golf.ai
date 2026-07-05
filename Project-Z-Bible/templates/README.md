# templates/

Theme, style, and reusable content templates for Project-Z Bible.

## Theme & style files

| File | Purpose |
|---|---|
| `theme.yaml` | Single source of truth for the Lavender & Charcoal palette and fonts |
| `style.css` | CSS applying the theme to HTML export (and print/PDF via a browser-based path) |
| `pandoc-metadata.yaml` | Pandoc/LaTeX front-matter for PDF & DOCX exports — colors, fonts, margins, TOC depth (requires XeLaTeX/LuaLaTeX for custom fonts) |
| `pandoc-metadata-basic.yaml` | Fallback metadata (no custom fonts) used automatically by `build/export-pdf.sh` when no XeLaTeX/LuaLaTeX engine is found |

If you change a color or font, update `theme.yaml` first, then mirror the change into
`style.css` and both `pandoc-metadata*.yaml` files.

## Palette

| Swatch | Name | Hex |
|---|---|---|
| 🟪 | Lavender | `#B9A6E0` |
| 🟪 | Deep Lavender | `#6C4F9C` |
| ⬛ | Charcoal | `#1E1F24` |
| ⬛ | Soft Charcoal | `#2B2D33` |
| ⬜ | Fog | `#EDEAF5` |
| 🟨 | Warning Amber | `#E0B96A` |
| 🟥 | Critical Red | `#C9605B` |

## Content templates

| File | Use |
|---|---|
| `maintenance-log-entry-template.md` | Copy a blank row into `chapters/17-maintenance-log.md` |
| `modification-log-entry-template.md` | Copy a blank row into `chapters/18-modification-log.md` |
| `expense-entry-template.md` | Copy a blank row into `chapters/19-expense-tracker.md` |
| `cover-page-template.md` | Reusable cover-page skeleton, for reference / future rebrands |

## DOCX reference template

`build/export-docx.sh` needs a `reference.docx` to carry Word styles (headings, table
borders, etc). If `templates/reference.docx` doesn't exist, the script generates one
automatically on first run via `pandoc -o templates/reference.docx --print-default-data-file
reference.docx` and leaves it in place — open it in Word/LibreOffice afterward and adjust
the heading/table styles to taste (colors matching the palette above) if you want the DOCX
export to look closer to the CSS/PDF theme. This file is binary and intentionally not
pre-generated in version control.
