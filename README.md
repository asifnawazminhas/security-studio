# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## v1.5 - Connected Workspace

This release combines the requested button/UI fixes with the next major product step.

### UI fixes
- Reworked Purple Team Mapping toolbar
- Replaced the small Clear button with a consistent "Clear mapping" action
- Reworked Workflow Builder toolbar
- Larger, labelled Up / Down / Delete workflow actions
- Improved destructive-action styling and responsive behaviour

### Connected workspace
- New Saved Workspace section
- Favourite commands stored locally in the browser
- Recently viewed commands stored locally
- Dashboard counts for catalogue, favourites and recent commands
- Save command action in Command Studio
- Favourites filter in Command Library
- Sort Command Library by title, platform or tool
- Copy directly from Command Library cards
- Direct Notes links from Command Library cards
- Notes + Studio workflow made more visible throughout the UI

### Command expansion
- Expanded catalogue from 39 to 64 commands
- Additional Windows inventory and policy commands
- Additional Linux identity/system/network commands
- Additional web and network inspection commands
- Additional Git/ripgrep references

### Existing features retained
- Command Studio
- Command Visualiser PNG/SVG export
- PrivEsc Explorer
- ATT&CK Explorer
- Attack Path Explorer
- Workflow Builder local persistence and JSON export
- Purple Team Mapping local persistence and JSON export
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

GitHub Actions publishes `dist/` to GitHub Pages.
