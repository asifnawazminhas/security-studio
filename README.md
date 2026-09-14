# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v2.0 - Final Stable Release

This release closes the current Security Studio roadmap and turns the project into a stable, portable, installable application.

### Production hardening
- Command catalogue validation runs before every production build
- Duplicate command IDs fail the build
- Required command fields are validated
- Placeholder/parameter inconsistencies are reported
- Versioned workspace/export schema
- Existing v1 workspace backups remain supported when no schema version is present

### PWA / offline support
- Web app manifest
- Installable app metadata
- Service worker
- Cached app shell
- Offline fallback page
- Online/offline status indicator
- Branded 192px and 512px icons

### Accessibility and branding
- Skip link
- Visible keyboard focus treatment
- Final metadata and Open Graph information
- Final branding pass
- Consistent card and panel presentation

### Complete platform retained
- Mature command catalogue
- Command Library filters, favourites and shareable URLs
- Command Studio
- Visualiser Pro with multiple themes
- Command Packs and custom packs
- Saved Workspace with full backup/restore
- Workflow Builder with templates, drag-and-drop, decisions and export
- PrivEsc Explorer
- ATT&CK Explorer
- Attack Path Explorer
- Detection & Telemetry
- Purple Team Validation Workspace
- Report Builder
- Notes Link Builder

## Local development

```bash
npm install
npm run dev
```

## Validate catalogue

```bash
npm run validate
```

## Production build

```bash
npm run build
```

The production build validates the command catalogue before Vite builds the application.
