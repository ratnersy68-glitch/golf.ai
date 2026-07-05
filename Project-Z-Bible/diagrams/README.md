# diagrams/

Standalone Mermaid (`.mmd`) source files. Each one is also embedded directly as a fenced
` ```mermaid ` code block inside its corresponding chapter — the copies here exist so you
can edit a diagram in one place (e.g. the [Mermaid Live Editor](https://mermaid.live)) and
regenerate an image from it without hunting through prose.

| File | Used in |
|---|---|
| `build-arc.mmd` | `chapters/02-project-vision.md` |
| `dyno-sheet-anatomy.mmd` | `chapters/03-beginner-car-guide.md` |
| `cooling-system.mmd` | `chapters/06-maintenance-guide.md` |
| `phase1-scope.mmd` | `chapters/07-phase1-build-plan.md` |
| `transmission-decision.mmd` | `chapters/08-phase2-500hp-plan.md` |
| `budget-pie.mmd` | `chapters/09-budget-tracker.md` |
| `suspension-geometry.mmd` | `chapters/12-suspension-guide.md` |
| `brake-heat-management.mmd` | `chapters/13-brake-guide.md` |
| `turbo-system-flow.mmd` | `chapters/15-turbo-planning-guide.md` |
| `driving-decision.mmd` | `chapters/16-driving-rules.md` |

## Regenerating images

```bash
cd Project-Z-Bible
build/render-diagrams.sh
# → assets/images/diagrams/*.svg (one per .mmd file above)
```

Requires [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli):

```bash
npm install -g @mermaid-js/mermaid-cli
```

If a chapter's embedded ` ```mermaid ` code block and its `.mmd` file here ever drift apart,
the `.mmd` file is the one to trust for regenerating images — update the chapter's fenced
block to match if you edit here, or vice versa.
