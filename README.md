# Asif's Security Studio

## v2.7 - Detailed Catalogue Expansion

v2.7 focuses on the remaining content-depth gap: more granular commands per topic while keeping the surrounding Security Studio context.

### Catalogue
- Previous catalogue: 168 commands
- v2.7 catalogue: 297 commands
- Added: 129 detailed reference commands

### Expanded Windows coverage
- OS and hardware details
- disks and volumes
- adapters, DNS, routes and neighbour cache
- TCP and UDP endpoints
- running services and process review
- scheduled tasks and patch inventory
- Defender status
- local users and groups
- AppLocker collections and EXE rules
- PowerShell execution policy and language mode
- Authenticode inspection

### Expanded Linux coverage
- distribution and kernel
- CPU, memory and storage
- mounts and filesystems
- interfaces, routes and neighbours
- TCP/UDP socket review
- DNS resolver configuration
- systemd service inventory
- process tree and memory review
- NSS user/group inventory
- login sessions
- time configuration
- Debian/RPM package inventory
- journal warnings

### Expanded Active Directory coverage
- domain and forest metadata
- domain controllers
- enabled users
- groups and computers
- organizational units
- trusts
- password policies
- sites and subnets
- nltest DC discovery
- Group Policy summary
- Kerberos ticket-cache summary

### Expanded network / DNS / TLS coverage
- Nmap top-port, connect, UDP and service-version checks
- Nmap HTTP title and TLS certificate inspection
- DNS AAAA, NS, TXT, CNAME and SRV queries
- DNS delegation tracing
- OpenSSL certificate and SAN inspection
- route, neighbour, listening-port and traceroute references

### Expanded web / curl coverage
- response headers
- status codes
- redirect chains
- detailed timings
- OPTIONS
- Origin/CORS observations
- HTTP/1.1 and HTTP/2
- local DNS override
- security.txt
- robots.txt
- sitemap.xml
- TLS summary
- Content-Type and Set-Cookie inspection

### Expanded packet-analysis coverage
- protocol hierarchy
- IP conversations and endpoints
- DNS queries
- HTTP hosts
- TLS SNI
- tcpdump interfaces and PCAP filters

### Expanded repository/runtime coverage
- Git branch/history/config review
- ripgrep searches for routes, auth terms and configuration files
- deeper Python, Node.js, PHP, Java, .NET, Go, Bash and PowerShell runtime references

### Quality model retained
Every catalogue entry remains structured with:
- platform
- tool
- category
- command
- description
- risk
- tags
- parameters
- ATT&CK mapping where appropriate
- explanation
- telemetry
- Security Notes link

### Product retained
v2.7 includes all v2.6 QA/hardening features:
- Error Boundary
- diagnostics/recovery
- deterministic source audit
- link audit
- Vitest unit tests
- Playwright desktop/mobile tests
- accessibility checks
- dark/light mode
- Appearance Studio
- Carbon-style command visualisation
- Knowledge Graph
- Context Profiles
- Assessment Sequences
- Quick Notes
- Copy History
- Engagement Timer
- Custom Commands
- no file uploads
