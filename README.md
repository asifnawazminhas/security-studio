# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v1.6 - Visualiser Pro + Purple Team Validation Workspace

### Visualiser Pro
- 10 terminal themes
- Editable command text
- Editable prompt
- Editable window title
- Configurable watermark text
- Configurable font size
- Configurable card padding
- PNG and SVG export
- Reset control
- Improved export button positioning

Themes:
- Security Notes Dark
- Midnight
- Clean Light
- Matrix Green
- Purple Ops
- Dracula
- Nord
- Solarized Dark
- Amber Terminal
- High Contrast

### Purple Team Validation Workspace
- Exercise name
- ATT&CK technique selector
- Validation command selector
- Command preview with Notes link
- Telemetry status
- Detection status
- Response status
- Existing six-stage mapping retained
- Browser persistence
- JSON export
- Markdown export
- Validation summary

### Fixes
- Version badge updated to v1.6
- Visualiser action alignment improved
- Responsive Visualiser controls improved
- Purple Team toolbar actions retained in consistent grouped layout
- Existing Workflow Builder, Saved Workspace, Explorers, Command Studio, Command Library and Detection views retained

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

GitHub Actions publishes `dist/` to GitHub Pages.
