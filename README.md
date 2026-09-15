# Asif's Security Studio

## v2.9 - PrivEsc Explorer Pro + Header Polish

### PrivEsc Explorer Pro
The old four-step PrivEsc view has been replaced with a structured authorised-assessment workspace.

#### Windows
- Identity & Privileges
- Operating System
- Application Control
- Services & Processes
- Scheduled Tasks
- Filesystem & Permissions
- Installed Software
- Network Context
- Environment
- Registry & Policy
- Code Signing

#### Linux
- Identity & Groups
- Kernel & Distribution
- sudo
- SUID / SGID / Capabilities
- Scheduled Execution
- Services & Processes
- Filesystem & Permissions
- Environment & PATH
- Packages & Software
- Network Context
- Containers
- Logs & Recent Activity

### Assessment workflow
Each check provides:
- purpose
- safe validation command references
- local status:
  - Reviewed
  - Needs review
  - Potential issue
  - Not tested
- section progress
- total assessment coverage
- Markdown review export
- direct Command Studio navigation

The explorer intentionally does not automate exploitation or execute commands.

### Header polish
- Security Notes is now a contained action button
- Notes cannot be pushed outside the visible header
- lower-priority header items collapse first at narrower widths
- theme/focus/help controls remain responsive
- Notes continues opening in a new tab

### Catalogue
- Previous: 297 commands
- v2.9: 322 commands
- Added read-only privilege-boundary enumeration references for Windows and Linux

### Existing v2.8 features retained
- premium Catalogue Overview
- topic navigation
- maturity scoring
- pinned filters
- cross-platform equivalents
- 297+ detailed catalogue
- Runtime Library
- Carbon-style Visualiser
- Knowledge Graph
- ATT&CK Explorer
- Context Profiles
- Quick Notes
- Copy History
- Engagement Timer
- Assessment Sequences
- Coverage Intelligence
- Appearance Studio
- Diagnostics & Recovery
- automated QA
- no file uploads
