# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v1.7 - Mature Catalogue + Workflow Studio + Purple Validation

### Command catalogue
- Expanded to 129 curated reference commands
- Windows
- PowerShell
- Linux
- Active Directory
- Web
- Network
- Nmap
- curl
- Wireshark/tshark
- Git/ripgrep
- Explanations, risk, telemetry, tags, Notes links and ATT&CK mapping where appropriate

### Command Library UX
- Search
- Platform filters with counts
- Tool filters with counts
- Category filter
- Tag filter
- Favourites
- Recently viewed
- Sort by title, platform, tool or category
- Copy directly from cards
- Direct Notes links
- Shareable filtered URLs
- Copy filtered link
- Reset filters

### Saved Workspace
- Delete individual recently viewed items
- Clear entire recent history
- Favourite management
- Notes links
- Open commands directly

### Workflow Builder
- Drag-and-drop reordering
- Step and decision nodes
- Attach Studio commands
- Attach Notes URLs
- Decision branch labels
- Reusable workflow templates
- Import JSON
- Export JSON
- Export PNG
- Export SVG
- Local browser persistence

### Purple Team Validation Workspace
- ATT&CK technique selection
- Validation command selection
- Expected telemetry
- Actual telemetry observed
- Telemetry source
- Detection result
- Response result
- Learning outcome
- Overall validation status
- JSON export
- Markdown exercise-summary export
- Local browser persistence

### Existing features retained
- Visualiser Pro with 10 themes
- Command Studio
- ATT&CK Explorer
- PrivEsc Explorer
- Attack Path Explorer
- Detection & Telemetry
- Saved Workspace

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
