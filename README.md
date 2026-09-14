# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v1.4

This release combines the requested quality pass with the next functional improvements.

### Quality fixes
- Improved ATT&CK Explorer card contrast
- Fixed Attack Path Explorer clipping with a padded horizontal path track
- Strengthened active navigation styling
- Refined Command Studio copy-button alignment
- Improved responsive spacing

### New v1.4 functionality
- Workflow Builder now supports:
  - editable step type
  - move up / move down
  - add / delete
  - automatic browser persistence
  - JSON export
  - reset
- Purple Team Mapping is now editable
- Purple Team Mapping persists locally
- Purple Team Mapping supports JSON export
- Existing Command Library, Command Studio, Visualiser, Explorers and Detection views retained

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
