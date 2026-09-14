# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v1.8 - Unified Actions + Portable Workspace

### UI quality fixes
- Unified button height, padding, radius and typography across Visualiser, Workflow Builder and Purple Team Validation
- Primary, secondary and destructive actions now align consistently
- Toolbar selects use the same height as buttons
- Responsive button stacks are consistent on smaller screens
- Visualiser Reset now aligns with the export action row

### Saved Workspace
- Delete individual recently viewed commands
- Clear all recent history
- Export the entire Studio workspace as JSON
- Import a Studio workspace backup
- Clear all locally stored Studio workspace data
- Backup includes favourites, recent commands, workflow data and Purple Team validation data

### Existing v1.7 features retained
- 129-command curated catalogue
- Advanced Command Library filters and shareable filtered URLs
- Saved favourites and recent history
- Workflow Builder with drag-and-drop, decisions, commands, Notes links, templates, JSON import/export and PNG/SVG export
- Purple Team Validation Workspace with expected vs observed telemetry, detection/response status and exercise-summary export
- Visualiser Pro with 10 themes
- ATT&CK, PrivEsc and Attack Path explorers
- Detection & Telemetry

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
