# Asif's Security Studio

Interactive companion application for Asif's Security Notes.

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
```

The static production site is written to `dist/`.

## Recommended deployment

Create a separate GitHub repository named `security-studio` and deploy it independently from the MkDocs `security-notes` repository. Point `studio.asifnawazminhas.com` at the deployment.

The application is deliberately client-side in v1. No database, account system, or API is required.

## Current modules

- Dashboard
- Command Library
- Command Studio
- Command Visualiser
- PrivEsc Explorer scaffold
- ATT&CK Explorer scaffold
- Attack Path Explorer scaffold
- Workflow Builder scaffold
- Detection & Telemetry scaffold
- Purple Team Mapping scaffold

## Structure

```text
security-studio/
├── data/
│   └── commands/
├── public/
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```
