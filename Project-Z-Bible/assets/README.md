# assets/

Images and logo used by the book. All placeholders are SVG (text-based, themeable, and
diffable in git) — swap them for real photos/renders as the build progresses, keeping the
same filenames so chapter links don't break.

| File | Used in | Replace with |
|---|---|---|
| `images/cover-placeholder.svg` | `chapters/00-cover.md` | A real cover photo/render of the car, or keep the blueprint art |
| `images/photo-placeholder.svg` | Generic — drop into any chapter | Actual build photos (engine bay, wheel fitment, before/after, etc.) |
| `logo/project-z-logo-placeholder.svg` | Optional branding (README, cover, wraps — see [Body Kit & Wrap Guide](../chapters/14-bodykit-wrap-guide.md)) | A finished logo/badge design |
| `images/diagrams/` | Output folder for `build/render-diagrams.sh` | Auto-populated — do not hand-edit, re-run the script instead |

All placeholder art uses the Lavender & Charcoal palette defined in
`../templates/theme.yaml` — match it if you replace these with custom artwork.
