# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v2.1 - Context + Smart Search + No Uploads

### Target Context
- Named local engagement context
- Target / hostname
- Domain
- Username
- Interface
- Port
- Path
- Context values automatically resolve matching command placeholders
- Stored only in browser localStorage
- No backend transmission

### Search
- Weighted search
- Title matches strongest
- Tool, platform and category weighting
- Tags and ATT&CK IDs searchable
- Description and command body included with lower weight
- `/` opens search in addition to Ctrl+K

### ATT&CK Explorer
- Compact right-side technique detail
- Removed redundant repeated technique-name heading
- More room for mapped commands and telemetry

### No-upload policy
- Workspace import removed
- Workflow JSON import removed
- No file-upload inputs remain in the application
- Exports are still available:
  - JSON
  - Markdown
  - HTML
  - PNG
  - SVG

### Existing platform retained
- Mature command catalogue
- Command Library
- Command Studio
- Visualiser Pro
- Command Packs
- Saved Workspace
- Workflow Builder
- Purple Team Validation Workspace
- Report Builder
- Notes Link Builder
- ATT&CK Explorer
- PrivEsc Explorer
- Attack Path Explorer
- Detection & Telemetry
- PWA/offline support
- Catalogue validation before production builds

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
