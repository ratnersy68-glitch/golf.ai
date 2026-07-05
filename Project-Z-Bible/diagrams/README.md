# diagrams/

Standalone Mermaid (`.mmd`) source files. Each one is also embedded directly as a fenced
` ```mermaid ` code block inside its corresponding chapter — the copies here exist so you
can edit a diagram in one place (e.g. the [Mermaid Live Editor](https://mermaid.live)) and
regenerate an image from it without hunting through prose.

Every embedded mermaid block carries a leading `%% diagram-id: <name>` comment matching its
`.mmd` filename here — `build/mermaid-filter.lua` reads that id to swap in the pre-rendered
image at export time (see "Regenerating images" below). Adding, removing, or reordering
diagrams never desyncs anything, because the mapping is by id, not by position.

| Diagram id / file | Used in |
|---|---|
| `reading-paths.mmd` | `chapters/01-toc.md` |
| `build-arc.mmd` | `chapters/02-project-vision.md` |
| `car-systems-overview.mmd` | `chapters/03-beginner-car-guide.md` |
| `car-anatomy.mmd` | `chapters/03-beginner-car-guide.md` |
| `dyno-sheet-anatomy.mmd` | `chapters/03-beginner-car-guide.md` |
| `buyer-decision-flow.mmd` | `chapters/04-350z-buyers-guide.md` |
| `maintenance-timeline.mmd` | `chapters/06-maintenance-guide.md` |
| `cooling-system.mmd` | `chapters/06-maintenance-guide.md` |
| `phase1-scope.mmd` | `chapters/07-phase1-build-plan.md` |
| `phase1-dependency-chain.mmd` | `chapters/07-phase1-build-plan.md` |
| `transmission-decision.mmd` | `chapters/08-phase2-500hp-plan.md` |
| `dyno-tuning-session.mmd` | `chapters/08-phase2-500hp-plan.md` |
| `budgeting-basics-flow.mmd` | `chapters/09-budget-tracker.md` |
| `budget-pie.mmd` | `chapters/09-budget-tracker.md` |
| `over-budget-decision.mmd` | `chapters/09-budget-tracker.md` |
| `tire-sidewall.mmd` | `chapters/11-wheel-tire-guide.md` |
| `suspension-parts-overview.mmd` | `chapters/12-suspension-guide.md` |
| `suspension-geometry.mmd` | `chapters/12-suspension-guide.md` |
| `brake-hydraulic-flow.mmd` | `chapters/13-brake-guide.md` |
| `brake-heat-management.mmd` | `chapters/13-brake-guide.md` |
| `turbo-basics.mmd` | `chapters/15-turbo-planning-guide.md` |
| `turbo-system-flow.mmd` | `chapters/15-turbo-planning-guide.md` |
| `turbo-install-steps.mmd` | `chapters/15-turbo-planning-guide.md` |
| `driving-decision.mmd` | `chapters/16-driving-rules.md` |

## Regenerating images

```bash
cd Project-Z-Bible
build/render-diagrams.sh
# → assets/images/diagrams/*.png (one per .mmd file above)
```

Rendered as PNG rather than SVG deliberately — see the comment at the top of
`build/render-diagrams.sh` for why (short version: Mermaid's SVG output embeds label text as
HTML, which the SVG-to-PDF path pandoc uses can't read, leaving blank boxes; a PNG is a
screenshot of the real rendered pixels, so text always shows up correctly).

Requires [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli):

```bash
npm install -g @mermaid-js/mermaid-cli
```

If a chapter's embedded ` ```mermaid ` code block and its `.mmd` file here ever drift apart,
the `.mmd` file is the one to trust for regenerating images — update the chapter's fenced
block to match if you edit here, or vice versa. If you add a brand-new diagram, give it a
`%% diagram-id: your-new-id` comment in the chapter's fenced block and save a matching
`diagrams/your-new-id.mmd` here — no other file needs to change.
