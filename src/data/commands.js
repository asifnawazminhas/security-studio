export const commandSchemaVersion = '2.0';
export const commands = [
  {
    "id": "applocker-effective",
    "title": "Inspect Effective AppLocker Policy",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Application Control",
    "command": "Get-AppLockerPolicy -Effective -Xml",
    "description": "Retrieve the effective AppLocker policy applied to the current Windows system.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "AppLocker",
      "Policy",
      "XML"
    ],
    "attack": [
      "T1518.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-AppLockerPolicy",
        "Retrieves AppLocker policy information."
      ],
      [
        "-Effective",
        "Returns the policy effective for the local system."
      ],
      [
        "-Xml",
        "Returns the result as XML."
      ]
    ],
    "telemetry": [
      "Process creation",
      "PowerShell telemetry",
      "EDR process telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "language-mode",
    "title": "Check PowerShell Language Mode",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "PowerShell",
    "command": "$ExecutionContext.SessionState.LanguageMode",
    "description": "Display the language mode of the current PowerShell session.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "PowerShell",
      "CLM",
      "Application Control"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "$ExecutionContext",
        "Exposes the current PowerShell execution context."
      ],
      [
        "SessionState.LanguageMode",
        "Returns the current language mode."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Process context"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "tcp-listeners",
    "title": "List Listening TCP Ports",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Network",
    "command": "Get-NetTCPConnection -State Listen",
    "description": "List local TCP endpoints currently in the listening state.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "TCP",
      "Network",
      "Listening Ports"
    ],
    "attack": [
      "T1049"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetTCPConnection",
        "Retrieves current TCP connections and listeners."
      ],
      [
        "-State Listen",
        "Filters results to listening endpoints."
      ]
    ],
    "telemetry": [
      "Process creation",
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-identity",
    "title": "Display Current Windows Identity",
    "platform": "Windows",
    "tool": "whoami",
    "category": "Identity",
    "command": "whoami",
    "description": "Display the identity associated with the current process.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Identity",
      "Windows",
      "Context"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "whoami",
        "Displays the current user identity."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-groups",
    "title": "Display Current Group Memberships",
    "platform": "Windows",
    "tool": "whoami",
    "category": "Identity",
    "command": "whoami /groups",
    "description": "Display security groups associated with the current access token.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Identity",
      "Groups",
      "Token"
    ],
    "attack": [
      "T1069.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "/groups",
        "Displays group membership and attributes for the current identity."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-privileges",
    "title": "Display Current Token Privileges",
    "platform": "Windows",
    "tool": "whoami",
    "category": "Identity",
    "command": "whoami /priv",
    "description": "Display privileges associated with the current access token.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Privileges",
      "Token",
      "Windows"
    ],
    "attack": [
      "T1069"
    ],
    "parameters": [],
    "explanation": [
      [
        "/priv",
        "Displays privileges held by the current token."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-systeminfo",
    "title": "Display Windows System Information",
    "platform": "Windows",
    "tool": "systeminfo",
    "category": "System",
    "command": "systeminfo",
    "description": "Display operating-system, hotfix and hardware summary information.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "System",
      "OS",
      "Inventory"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "systeminfo",
        "Displays detailed operating-system and host information."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-processes",
    "title": "List Windows Processes",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Processes",
    "command": "Get-Process | Sort-Object ProcessName",
    "description": "List running processes ordered by process name.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Processes",
      "PowerShell",
      "Inventory"
    ],
    "attack": [
      "T1057"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-Process",
        "Returns running processes."
      ],
      [
        "Sort-Object ProcessName",
        "Orders the output by process name."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-services",
    "title": "List Windows Services",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Services",
    "command": "Get-Service | Sort-Object Status,Name",
    "description": "List Windows services and order them by status and name.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Services",
      "PowerShell",
      "Inventory"
    ],
    "attack": [
      "T1007"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-Service",
        "Returns installed services."
      ],
      [
        "Sort-Object",
        "Orders the output."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-routes",
    "title": "Display Windows Route Table",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Network",
    "command": "Get-NetRoute | Sort-Object DestinationPrefix",
    "description": "Display local routing information.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Network",
      "Routes",
      "PowerShell"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetRoute",
        "Returns IP route information."
      ],
      [
        "Sort-Object DestinationPrefix",
        "Orders routes by destination."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-dns-cache",
    "title": "Display Windows DNS Cache",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "DNS",
    "command": "Get-DnsClientCache",
    "description": "Display entries currently held in the Windows DNS client cache.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "DNS",
      "Cache",
      "Network"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-DnsClientCache",
        "Returns DNS client cache entries."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-firewall-profiles",
    "title": "Inspect Windows Firewall Profiles",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Firewall",
    "command": "Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction",
    "description": "Display the state and default actions of Windows Firewall profiles.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Firewall",
      "Policy",
      "Windows"
    ],
    "attack": [
      "T1518.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetFirewallProfile",
        "Returns Windows Firewall profile configuration."
      ],
      [
        "Select-Object",
        "Limits output to useful assessment fields."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-defender-status",
    "title": "Inspect Microsoft Defender Status",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Endpoint Security",
    "command": "Get-MpComputerStatus",
    "description": "Display Microsoft Defender status information when the cmdlet is available.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Defender",
      "Endpoint",
      "Security"
    ],
    "attack": [
      "T1518.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-MpComputerStatus",
        "Returns Microsoft Defender status information."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "EDR telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-env",
    "title": "List Environment Variables",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-ChildItem Env: | Sort-Object Name",
    "description": "List environment variables visible to the current process.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Environment",
      "PowerShell",
      "System"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-ChildItem Env:",
        "Enumerates environment variables."
      ],
      [
        "Sort-Object Name",
        "Orders entries by variable name."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "linux-system",
    "title": "Display Linux System Information",
    "platform": "Linux",
    "tool": "uname",
    "category": "System",
    "command": "uname -a",
    "description": "Display kernel and system information for the current Linux host.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Kernel",
      "System"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "uname",
        "Prints system information."
      ],
      [
        "-a",
        "Displays all available system information."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-identity",
    "title": "Display Current Linux Identity",
    "platform": "Linux",
    "tool": "id",
    "category": "Identity",
    "command": "id",
    "description": "Display the current user ID, primary group and supplementary groups.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Identity",
      "Groups"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "id",
        "Prints user and group identity information."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-ip",
    "title": "List Linux IP Addresses",
    "platform": "Linux",
    "tool": "ip",
    "category": "Network",
    "command": "ip addr show",
    "description": "Display network interfaces and assigned IP addresses.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Network",
      "Interfaces"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "ip",
        "Linux network configuration utility."
      ],
      [
        "addr show",
        "Displays address information for interfaces."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-routes",
    "title": "Display Linux Routes",
    "platform": "Linux",
    "tool": "ip",
    "category": "Network",
    "command": "ip route show",
    "description": "Display the current Linux routing table.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Network",
      "Routes"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "ip route show",
        "Displays routing table entries."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-listeners",
    "title": "List Linux Listening Sockets",
    "platform": "Linux",
    "tool": "ss",
    "category": "Network",
    "command": "ss -lntup",
    "description": "Display listening TCP/UDP sockets and associated process information where permitted.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Sockets",
      "Network"
    ],
    "attack": [
      "T1049"
    ],
    "parameters": [],
    "explanation": [
      [
        "ss",
        "Displays socket statistics."
      ],
      [
        "-lntup",
        "Shows listening TCP/UDP sockets with numeric addresses and process context."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-processes",
    "title": "List Linux Processes",
    "platform": "Linux",
    "tool": "ps",
    "category": "Processes",
    "command": "ps aux",
    "description": "Display running processes using a widely supported process listing format.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Processes",
      "Inventory"
    ],
    "attack": [
      "T1057"
    ],
    "parameters": [],
    "explanation": [
      [
        "ps",
        "Reports process status."
      ],
      [
        "aux",
        "Shows processes for all users with detailed fields."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-services",
    "title": "List systemd Services",
    "platform": "Linux",
    "tool": "systemctl",
    "category": "Services",
    "command": "systemctl --type=service --state=running",
    "description": "List running systemd service units.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Services",
      "systemd"
    ],
    "attack": [
      "T1007"
    ],
    "parameters": [],
    "explanation": [
      [
        "systemctl",
        "Queries systemd."
      ],
      [
        "--type=service",
        "Restricts results to services."
      ],
      [
        "--state=running",
        "Shows running units."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-disk",
    "title": "Display Filesystem Usage",
    "platform": "Linux",
    "tool": "df",
    "category": "System",
    "command": "df -h",
    "description": "Display mounted filesystem capacity in human-readable units.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Filesystem",
      "Disk"
    ],
    "attack": [
      "T1083"
    ],
    "parameters": [],
    "explanation": [
      [
        "df",
        "Reports filesystem disk space usage."
      ],
      [
        "-h",
        "Uses human-readable units."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-mounts",
    "title": "Display Mounted Filesystems",
    "platform": "Linux",
    "tool": "findmnt",
    "category": "Filesystem",
    "command": "findmnt",
    "description": "Display the filesystem mount hierarchy.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Filesystem",
      "Mounts"
    ],
    "attack": [
      "T1083"
    ],
    "parameters": [],
    "explanation": [
      [
        "findmnt",
        "Displays mounted filesystems in a tree."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-env",
    "title": "List Linux Environment Variables",
    "platform": "Linux",
    "tool": "env",
    "category": "System",
    "command": "env | sort",
    "description": "List environment variables visible to the current process.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Environment",
      "System"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "env",
        "Prints environment variables."
      ],
      [
        "sort",
        "Orders the output."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "dns-dig",
    "title": "Resolve a DNS Name",
    "platform": "Network",
    "tool": "dig",
    "category": "DNS",
    "command": "dig <DOMAIN>",
    "description": "Query DNS for an authorised domain name.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "DNS",
      "Network",
      "Resolution"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "dig",
        "DNS lookup utility."
      ],
      [
        "<DOMAIN>",
        "Domain name to query."
      ]
    ],
    "telemetry": [
      "DNS resolver logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "dns-nslookup",
    "title": "Resolve DNS with nslookup",
    "platform": "Network",
    "tool": "nslookup",
    "category": "DNS",
    "command": "nslookup <DOMAIN>",
    "description": "Resolve an authorised hostname using nslookup.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "DNS",
      "Network",
      "Resolution"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "nslookup",
        "Queries configured DNS resolvers."
      ],
      [
        "<DOMAIN>",
        "Hostname or domain to resolve."
      ]
    ],
    "telemetry": [
      "DNS resolver logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "nmap-service",
    "title": "Service Version Discovery",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap -sV -p <PORTS> <TARGET>",
    "description": "Perform service version detection against an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Services",
      "Ports"
    ],
    "attack": [
      "T1046"
    ],
    "parameters": [
      {
        "name": "PORTS",
        "label": "Ports",
        "placeholder": "80,443"
      },
      {
        "name": "TARGET",
        "label": "Target",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "nmap",
        "Network exploration and security auditing tool."
      ],
      [
        "-sV",
        "Enables service/version detection."
      ],
      [
        "-p <PORTS>",
        "Limits scanning to selected ports."
      ],
      [
        "<TARGET>",
        "Authorised target host."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "nmap-ping",
    "title": "Nmap Host Discovery",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap -sn <TARGET>",
    "description": "Perform host discovery without a port scan against an authorised range or target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Discovery",
      "Hosts"
    ],
    "attack": [
      "T1018"
    ],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target or CIDR",
        "placeholder": "10.10.10.0/24"
      }
    ],
    "explanation": [
      [
        "-sn",
        "Performs host discovery without a port scan."
      ],
      [
        "<TARGET>",
        "Authorised target or network range."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "tcpdump-interface",
    "title": "Capture Packets on an Interface",
    "platform": "Network",
    "tool": "tcpdump",
    "category": "Packet Analysis",
    "command": "tcpdump -i <INTERFACE> -nn",
    "description": "Capture packets on a selected interface without name resolution.",
    "risk": "Packet capture",
    "changesSystem": false,
    "tags": [
      "tcpdump",
      "Packets",
      "Network"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "INTERFACE",
        "label": "Interface",
        "placeholder": "eth0"
      }
    ],
    "explanation": [
      [
        "tcpdump",
        "Command-line packet analyser."
      ],
      [
        "-i <INTERFACE>",
        "Selects the capture interface."
      ],
      [
        "-nn",
        "Disables hostname and service-name resolution."
      ]
    ],
    "telemetry": [
      "Local packet capture"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "tshark-interface",
    "title": "Capture with tshark",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -i <INTERFACE>",
    "description": "Start a packet capture on a selected interface using tshark.",
    "risk": "Packet capture",
    "changesSystem": false,
    "tags": [
      "Wireshark",
      "tshark",
      "Packets"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "INTERFACE",
        "label": "Interface",
        "placeholder": "eth0"
      }
    ],
    "explanation": [
      [
        "tshark",
        "Terminal-based Wireshark interface."
      ],
      [
        "-i <INTERFACE>",
        "Selects the capture interface."
      ]
    ],
    "telemetry": [
      "Local packet capture"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "curl-head",
    "title": "Inspect HTTP Response Headers",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -I https://<TARGET>",
    "description": "Retrieve response headers from an authorised web endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "HTTP",
      "Headers",
      "Web"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "curl",
        "Transfers data using URL syntax."
      ],
      [
        "-I",
        "Requests response headers only."
      ],
      [
        "<TARGET>",
        "Authorised target hostname."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-verbose",
    "title": "Inspect an HTTPS Request Verbosely",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -v https://<TARGET>",
    "description": "Show request, response and TLS connection details for an authorised endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "HTTP",
      "TLS",
      "curl"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-v",
        "Enables verbose protocol and connection output."
      ],
      [
        "<TARGET>",
        "Authorised target hostname."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-options",
    "title": "Check HTTP OPTIONS",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -i -X OPTIONS https://<TARGET>",
    "description": "Request OPTIONS from an authorised endpoint to inspect advertised HTTP methods.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "HTTP",
      "Methods",
      "curl"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-i",
        "Includes response headers."
      ],
      [
        "-X OPTIONS",
        "Uses the OPTIONS request method."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/web/"
  },
  {
    "id": "httpx-basic",
    "title": "Probe Authorised Web Hosts",
    "platform": "Web",
    "tool": "httpx",
    "category": "Discovery",
    "command": "httpx -u https://<TARGET> -title -status-code -tech-detect",
    "description": "Collect basic HTTP metadata from an authorised web host.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "httpx",
      "HTTP",
      "Technology"
    ],
    "attack": [
      "T1595.002"
    ],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-u",
        "Specifies a URL."
      ],
      [
        "-title",
        "Shows the page title."
      ],
      [
        "-status-code",
        "Shows the HTTP status."
      ],
      [
        "-tech-detect",
        "Performs technology detection."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/reconnaissance/"
  },
  {
    "id": "ad-domain",
    "title": "Show Current AD Domain",
    "platform": "Active Directory",
    "tool": "PowerShell",
    "category": "Directory",
    "command": "[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().Name",
    "description": "Return the name of the current Active Directory domain.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "AD",
      "Domain",
      "Directory"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "GetCurrentDomain()",
        "Returns the domain object for the current security context."
      ],
      [
        ".Name",
        "Returns its domain name."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Directory-service context"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-logonserver",
    "title": "Show Current Logon Server",
    "platform": "Active Directory",
    "tool": "cmd",
    "category": "Directory",
    "command": "echo %LOGONSERVER%",
    "description": "Display the logon server recorded in the current Windows environment.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "AD",
      "Logon Server",
      "Environment"
    ],
    "attack": [
      "T1018"
    ],
    "parameters": [],
    "explanation": [
      [
        "%LOGONSERVER%",
        "Environment variable containing the authenticating domain controller name."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-user",
    "title": "Display Current Domain User",
    "platform": "Active Directory",
    "tool": "whoami",
    "category": "Identity",
    "command": "whoami /user",
    "description": "Display the SID and identity of the current Windows user.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "AD",
      "Identity",
      "SID"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "/user",
        "Displays the current user and SID."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "git-status",
    "title": "Show Git Working Tree Status",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git status",
    "description": "Display the current branch and working-tree state.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Repository",
      "Workflow"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "git status",
        "Shows tracked, modified, staged and untracked files."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-log",
    "title": "Show Compact Git History",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git log --oneline --decorate -10",
    "description": "Display the ten most recent commits in compact form.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "History",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "--oneline",
        "Uses compact commit formatting."
      ],
      [
        "--decorate",
        "Shows branch and tag references."
      ],
      [
        "-10",
        "Limits output to ten commits."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "windows-computer-info",
    "title": "Display Windows Computer Summary",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber,CsName",
    "description": "Display a concise operating-system and computer summary.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Inventory",
      "PowerShell"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-ComputerInfo",
        "Returns operating-system and computer properties."
      ],
      [
        "Select-Object",
        "Limits the output to useful summary fields."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-hotfixes",
    "title": "List Installed Windows Hotfixes",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Patching",
    "command": "Get-HotFix | Sort-Object InstalledOn -Descending",
    "description": "List installed Windows hotfixes ordered by installation date.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Hotfixes",
      "Patching"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-HotFix",
        "Returns installed Windows updates and hotfixes."
      ],
      [
        "Sort-Object InstalledOn -Descending",
        "Shows the newest entries first."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-os-cim",
    "title": "Inspect Windows OS via CIM",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture",
    "description": "Inspect operating-system details using CIM.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "CIM",
      "Inventory"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-CimInstance Win32_OperatingSystem",
        "Queries the operating-system CIM class."
      ],
      [
        "Select-Object",
        "Selects concise OS properties."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "WMI/CIM telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-system-cim",
    "title": "Inspect Windows Computer System",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,Domain,PartOfDomain",
    "description": "Inspect manufacturer, model and domain membership.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "CIM",
      "Domain"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-CimInstance Win32_ComputerSystem",
        "Queries computer-system information."
      ],
      [
        "Select-Object",
        "Selects concise system properties."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "WMI/CIM telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-local-users",
    "title": "List Local Windows Users",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Identity",
    "command": "Get-LocalUser | Select-Object Name,Enabled,LastLogon",
    "description": "List local user accounts and selected status fields.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Users",
      "Identity"
    ],
    "attack": [
      "T1087.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-LocalUser",
        "Returns local user accounts."
      ],
      [
        "Select-Object",
        "Limits output to useful fields."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-local-groups",
    "title": "List Local Windows Groups",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Identity",
    "command": "Get-LocalGroup | Sort-Object Name",
    "description": "List local groups on the current Windows system.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Groups",
      "Identity"
    ],
    "attack": [
      "T1069.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-LocalGroup",
        "Returns local groups."
      ],
      [
        "Sort-Object Name",
        "Orders groups alphabetically."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-scheduled-tasks",
    "title": "List Windows Scheduled Tasks",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Scheduled Tasks",
    "command": "Get-ScheduledTask | Select-Object TaskPath,TaskName,State",
    "description": "List scheduled tasks with path, name and state.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Scheduled Tasks",
      "Inventory"
    ],
    "attack": [
      "T1053.005"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-ScheduledTask",
        "Returns registered scheduled tasks."
      ],
      [
        "Select-Object",
        "Limits output to useful task fields."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Task Scheduler telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-ip-config",
    "title": "Inspect Windows IP Configuration",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Network",
    "command": "Get-NetIPConfiguration",
    "description": "Display interface, IP, gateway and DNS configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Network",
      "IP"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetIPConfiguration",
        "Returns IP configuration for local interfaces."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-adapters",
    "title": "List Windows Network Adapters",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Network",
    "command": "Get-NetAdapter | Sort-Object Status,Name",
    "description": "List Windows network adapters and their current state.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Network",
      "Adapters"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetAdapter",
        "Returns local network adapters."
      ],
      [
        "Sort-Object Status,Name",
        "Orders results by state and name."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-firewall-rules",
    "title": "List Enabled Windows Firewall Rules",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Firewall",
    "command": "Get-NetFirewallRule -Enabled True | Select-Object DisplayName,Direction,Action,Profile",
    "description": "Review enabled Windows Firewall rules and core policy fields.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Firewall",
      "Rules"
    ],
    "attack": [
      "T1518.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetFirewallRule -Enabled True",
        "Returns enabled firewall rules."
      ],
      [
        "Select-Object",
        "Limits output to assessment fields."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "linux-hostnamectl",
    "title": "Display Linux Host Information",
    "platform": "Linux",
    "tool": "hostnamectl",
    "category": "System",
    "command": "hostnamectl",
    "description": "Display hostname, operating-system and kernel metadata where systemd is available.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "System",
      "Hostname"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "hostnamectl",
        "Displays host and operating-system metadata."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-os-release",
    "title": "Read Linux OS Release Information",
    "platform": "Linux",
    "tool": "cat",
    "category": "System",
    "command": "cat /etc/os-release",
    "description": "Display distribution identification information from /etc/os-release.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "OS",
      "Distribution"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "cat /etc/os-release",
        "Reads standard Linux distribution metadata."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-users",
    "title": "List Linux Account Database Entries",
    "platform": "Linux",
    "tool": "getent",
    "category": "Identity",
    "command": "getent passwd",
    "description": "Read passwd database entries through the configured NSS sources.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Users",
      "NSS"
    ],
    "attack": [
      "T1087.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "getent passwd",
        "Queries passwd entries through Name Service Switch."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-groups",
    "title": "List Linux Group Database Entries",
    "platform": "Linux",
    "tool": "getent",
    "category": "Identity",
    "command": "getent group",
    "description": "Read group database entries through the configured NSS sources.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Groups",
      "NSS"
    ],
    "attack": [
      "T1069.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "getent group",
        "Queries group entries through Name Service Switch."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-block-devices",
    "title": "List Linux Block Devices",
    "platform": "Linux",
    "tool": "lsblk",
    "category": "Storage",
    "command": "lsblk -f",
    "description": "Display block devices, filesystems and mount points.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Storage",
      "Filesystem"
    ],
    "attack": [
      "T1083"
    ],
    "parameters": [],
    "explanation": [
      [
        "lsblk",
        "Lists block devices."
      ],
      [
        "-f",
        "Shows filesystem information."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-neighbours",
    "title": "Display Linux Neighbour Table",
    "platform": "Linux",
    "tool": "ip",
    "category": "Network",
    "command": "ip neigh show",
    "description": "Display neighbour-cache entries known to the host.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Network",
      "ARP"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "ip neigh show",
        "Displays neighbour-table entries."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "web-http-status",
    "title": "Check HTTP Status Code",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -sS -o /dev/null -w \"%{http_code}\\n\" https://<TARGET>",
    "description": "Return the HTTP status code from an authorised web endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Web",
      "HTTP",
      "Status"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-sS",
        "Uses silent mode while retaining errors."
      ],
      [
        "-o /dev/null",
        "Discards the response body."
      ],
      [
        "-w",
        "Prints selected transfer metadata."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "web-robots",
    "title": "Retrieve robots.txt",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -sS https://<TARGET>/robots.txt",
    "description": "Retrieve robots.txt from an authorised web application.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Web",
      "robots.txt",
      "Discovery"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "curl -sS",
        "Retrieves the resource while keeping output concise."
      ],
      [
        "/robots.txt",
        "Standard crawler instruction location."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/reconnaissance/"
  },
  {
    "id": "network-ping",
    "title": "Ping an Authorised Target",
    "platform": "Network",
    "tool": "ping",
    "category": "Connectivity",
    "command": "ping -c 4 <TARGET>",
    "description": "Send four ICMP echo requests to an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Network",
      "ICMP",
      "Connectivity"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "ping",
        "Tests basic IP reachability."
      ],
      [
        "-c 4",
        "Sends four requests."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "network-traceroute",
    "title": "Trace Network Path",
    "platform": "Network",
    "tool": "traceroute",
    "category": "Connectivity",
    "command": "traceroute <TARGET>",
    "description": "Trace the network path toward an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Network",
      "Routing",
      "Traceroute"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "traceroute",
        "Displays hop-by-hop path information toward a destination."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "network-tls-inspect",
    "title": "Inspect TLS Certificate with OpenSSL",
    "platform": "Network",
    "tool": "openssl",
    "category": "TLS",
    "command": "openssl s_client -connect <TARGET>:443 -servername <TARGET> </dev/null",
    "description": "Inspect the TLS handshake and certificate chain for an authorised HTTPS endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "TLS",
      "Certificate",
      "OpenSSL"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "s_client",
        "Creates a diagnostic TLS client connection."
      ],
      [
        "-connect",
        "Specifies host and port."
      ],
      [
        "-servername",
        "Supplies the TLS SNI hostname."
      ]
    ],
    "telemetry": [
      "Network telemetry",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "ad-logon-domain",
    "title": "Display Windows Logon Domain",
    "platform": "Active Directory",
    "tool": "cmd",
    "category": "Directory",
    "command": "echo %USERDNSDOMAIN%",
    "description": "Display the DNS domain associated with the current Windows logon context.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Domain",
      "Environment"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "%USERDNSDOMAIN%",
        "Environment variable containing the user's DNS domain when available."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "tools-ripgrep",
    "title": "Search Files with ripgrep",
    "platform": "Tools",
    "tool": "ripgrep",
    "category": "Search",
    "command": "rg -n \"<TERM>\" <PATH>",
    "description": "Search text recursively and include matching line numbers.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "ripgrep",
      "Search",
      "Files"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TERM",
        "label": "Search term",
        "placeholder": "TODO"
      },
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "."
      }
    ],
    "explanation": [
      [
        "rg",
        "Fast recursive text search."
      ],
      [
        "-n",
        "Shows matching line numbers."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-current-branch",
    "title": "Show Current Git Branch",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git branch --show-current",
    "description": "Display the currently checked-out Git branch.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Branch",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "git branch --show-current",
        "Prints the current branch name."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-diff-stat",
    "title": "Show Git Change Summary",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git diff --stat",
    "description": "Display a concise summary of unstaged changes.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Diff",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "git diff --stat",
        "Shows changed files and line-count statistics."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "ps-version",
    "title": "Display PowerShell Version",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "PowerShell",
    "command": "$PSVersionTable",
    "description": "Display PowerShell edition, version and runtime information.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "PowerShell",
      "Version",
      "Runtime"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "$PSVersionTable",
        "Built-in table containing PowerShell version and runtime metadata."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/powershell/"
  },
  {
    "id": "ps-execution-policy",
    "title": "Inspect PowerShell Execution Policies",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "PowerShell",
    "command": "Get-ExecutionPolicy -List",
    "description": "Display execution-policy scopes without changing configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "PowerShell",
      "Execution Policy",
      "Configuration"
    ],
    "attack": [
      "T1518.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-ExecutionPolicy",
        "Reads PowerShell execution policy."
      ],
      [
        "-List",
        "Displays all policy scopes."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/powershell/"
  },
  {
    "id": "ps-modules",
    "title": "List Available PowerShell Modules",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "PowerShell",
    "command": "Get-Module -ListAvailable | Select-Object Name,Version,Path",
    "description": "List installed PowerShell modules and their paths.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "PowerShell",
      "Modules",
      "Inventory"
    ],
    "attack": [
      "T1518"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-Module -ListAvailable",
        "Returns modules available on the module path."
      ],
      [
        "Select-Object",
        "Selects concise module metadata."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/powershell/"
  },
  {
    "id": "windows-drives",
    "title": "List Windows Filesystem Drives",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Filesystem",
    "command": "Get-PSDrive -PSProvider FileSystem",
    "description": "List filesystem drives exposed to PowerShell.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Filesystem",
      "Drives"
    ],
    "attack": [
      "T1083"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-PSDrive",
        "Returns PowerShell drives."
      ],
      [
        "-PSProvider FileSystem",
        "Limits output to filesystem-backed drives."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-shares",
    "title": "List Local SMB Shares",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "SMB",
    "command": "Get-SmbShare | Select-Object Name,Path,Description",
    "description": "List locally configured SMB shares.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "SMB",
      "Shares"
    ],
    "attack": [
      "T1135"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-SmbShare",
        "Returns local SMB shares."
      ],
      [
        "Select-Object",
        "Selects name, path and description."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-smb-connections",
    "title": "Inspect SMB Connections",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "SMB",
    "command": "Get-SmbConnection",
    "description": "Display current SMB client connections.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "SMB",
      "Connections"
    ],
    "attack": [
      "T1049"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-SmbConnection",
        "Returns active SMB client connections."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "SMB telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-arp",
    "title": "Display Windows Neighbour Cache",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Network",
    "command": "Get-NetNeighbor | Sort-Object InterfaceIndex,IPAddress",
    "description": "Display IPv4/IPv6 neighbour-cache entries.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Network",
      "ARP",
      "NDP"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-NetNeighbor",
        "Returns neighbour-cache entries."
      ],
      [
        "Sort-Object",
        "Orders output by interface and address."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-dns-servers",
    "title": "Display Windows DNS Servers",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "DNS",
    "command": "Get-DnsClientServerAddress | Select-Object InterfaceAlias,AddressFamily,ServerAddresses",
    "description": "Display DNS resolvers configured per interface.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "DNS",
      "Network"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-DnsClientServerAddress",
        "Returns DNS server configuration for local interfaces."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-eventlog-list",
    "title": "List Windows Event Logs",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Event Logs",
    "command": "Get-WinEvent -ListLog * | Select-Object LogName,RecordCount,IsEnabled",
    "description": "List event logs with record counts and enabled state.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Event Logs",
      "Telemetry"
    ],
    "attack": [
      "T1654"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-WinEvent -ListLog *",
        "Returns metadata for registered Windows event logs."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-process-paths",
    "title": "List Processes with Paths",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Processes",
    "command": "Get-Process | Select-Object Name,Id,Path",
    "description": "Display running process names, IDs and executable paths where accessible.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Processes",
      "Paths"
    ],
    "attack": [
      "T1057"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-Process",
        "Returns running processes."
      ],
      [
        "Select-Object",
        "Selects name, ID and path."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-service-details",
    "title": "List Service Executable Paths",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Services",
    "command": "Get-CimInstance Win32_Service | Select-Object Name,State,StartMode,PathName",
    "description": "Display Windows service state, start mode and executable path.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Services",
      "CIM"
    ],
    "attack": [
      "T1007"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-CimInstance Win32_Service",
        "Queries Windows service metadata via CIM."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "WMI/CIM telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-timezone",
    "title": "Display Windows Time Zone",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-TimeZone",
    "description": "Display the current Windows time-zone configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Time",
      "System"
    ],
    "attack": [
      "T1124"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-TimeZone",
        "Returns local time-zone information."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-culture",
    "title": "Display Windows Culture",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "System",
    "command": "Get-Culture",
    "description": "Display locale and culture information for the current user.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Locale",
      "System"
    ],
    "attack": [
      "T1614.001"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-Culture",
        "Returns the current culture settings."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-proxy",
    "title": "Inspect WinHTTP Proxy",
    "platform": "Windows",
    "tool": "netsh",
    "category": "Network",
    "command": "netsh winhttp show proxy",
    "description": "Display the WinHTTP proxy configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Proxy",
      "Network"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "netsh winhttp show proxy",
        "Displays WinHTTP proxy settings."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-cert-store",
    "title": "List Current User Certificates",
    "platform": "Windows",
    "tool": "PowerShell",
    "category": "Certificates",
    "command": "Get-ChildItem Cert:\\CurrentUser\\My | Select-Object Subject,Issuer,NotAfter,Thumbprint",
    "description": "List personal certificates in the current-user certificate store.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Certificates",
      "PKI"
    ],
    "attack": [
      "T1552.004"
    ],
    "parameters": [],
    "explanation": [
      [
        "Get-ChildItem Cert:\\CurrentUser\\My",
        "Enumerates certificates in the current user's personal store."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "ad-domain-controller",
    "title": "Find Current Domain Controller",
    "platform": "Active Directory",
    "tool": "PowerShell",
    "category": "Directory",
    "command": "[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().FindDomainController().Name",
    "description": "Return a domain controller selected for the current domain context.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Domain Controller",
      "Directory"
    ],
    "attack": [
      "T1018"
    ],
    "parameters": [],
    "explanation": [
      [
        "FindDomainController()",
        "Selects a domain controller for the current domain."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Directory-service context"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-domain-info",
    "title": "Display AD Domain Metadata",
    "platform": "Active Directory",
    "tool": "PowerShell",
    "category": "Directory",
    "command": "[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain() | Select-Object Name,ForestMode,DomainMode",
    "description": "Display basic current-domain metadata.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Domain",
      "Forest"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "GetCurrentDomain()",
        "Returns the current Active Directory domain object."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Directory-service context"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-forest-info",
    "title": "Display AD Forest Metadata",
    "platform": "Active Directory",
    "tool": "PowerShell",
    "category": "Directory",
    "command": "[System.DirectoryServices.ActiveDirectory.Forest]::GetCurrentForest() | Select-Object Name,ForestMode,RootDomain",
    "description": "Display current forest name, functional mode and root domain.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Forest",
      "Directory"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "GetCurrentForest()",
        "Returns the current Active Directory forest object."
      ]
    ],
    "telemetry": [
      "PowerShell telemetry",
      "Directory-service context"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-nltest-domain",
    "title": "Display Domain with nltest",
    "platform": "Active Directory",
    "tool": "nltest",
    "category": "Directory",
    "command": "nltest /dsgetdc:<DOMAIN>",
    "description": "Query domain-controller locator information for an authorised domain.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Domain Controller",
      "nltest"
    ],
    "attack": [
      "T1018"
    ],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.local"
      }
    ],
    "explanation": [
      [
        "/dsgetdc",
        "Requests domain-controller locator information."
      ],
      [
        "<DOMAIN>",
        "Authorised Active Directory domain."
      ]
    ],
    "telemetry": [
      "Process creation",
      "Directory-service context"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-whoami-upn",
    "title": "Display Current UPN",
    "platform": "Active Directory",
    "tool": "whoami",
    "category": "Identity",
    "command": "whoami /upn",
    "description": "Display the current user's user principal name when available.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "UPN",
      "Identity"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "/upn",
        "Displays the current user's UPN."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-klist",
    "title": "Inspect Kerberos Ticket Cache",
    "platform": "Active Directory",
    "tool": "klist",
    "category": "Kerberos",
    "command": "klist",
    "description": "Display Kerberos tickets in the current logon session.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "Kerberos",
      "Tickets"
    ],
    "attack": [
      "T1558"
    ],
    "parameters": [],
    "explanation": [
      [
        "klist",
        "Displays Kerberos ticket-cache information for the current session."
      ]
    ],
    "telemetry": [
      "Process creation",
      "Authentication telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "ad-dns-srv",
    "title": "Resolve LDAP SRV Records",
    "platform": "Active Directory",
    "tool": "nslookup",
    "category": "DNS",
    "command": "nslookup -type=SRV _ldap._tcp.dc._msdcs.<DOMAIN>",
    "description": "Resolve domain-controller LDAP SRV records for an authorised domain.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Active Directory",
      "DNS",
      "SRV"
    ],
    "attack": [
      "T1018"
    ],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.local"
      }
    ],
    "explanation": [
      [
        "-type=SRV",
        "Requests SRV records."
      ],
      [
        "_ldap._tcp.dc._msdcs",
        "Standard AD domain-controller locator namespace."
      ]
    ],
    "telemetry": [
      "DNS resolver logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/active-directory/"
  },
  {
    "id": "linux-kernel",
    "title": "Display Linux Kernel Version",
    "platform": "Linux",
    "tool": "uname",
    "category": "System",
    "command": "uname -r",
    "description": "Display the running Linux kernel release.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Kernel",
      "System"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "uname -r",
        "Prints the running kernel release."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-cpu",
    "title": "Display CPU Information",
    "platform": "Linux",
    "tool": "lscpu",
    "category": "System",
    "command": "lscpu",
    "description": "Display CPU architecture and topology information.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "CPU",
      "Inventory"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "lscpu",
        "Displays CPU architecture information."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-memory",
    "title": "Display Linux Memory Usage",
    "platform": "Linux",
    "tool": "free",
    "category": "System",
    "command": "free -h",
    "description": "Display system memory utilisation in human-readable units.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Memory",
      "System"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "free",
        "Reports memory usage."
      ],
      [
        "-h",
        "Uses human-readable units."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-uptime",
    "title": "Display Linux Uptime",
    "platform": "Linux",
    "tool": "uptime",
    "category": "System",
    "command": "uptime",
    "description": "Display system uptime and load averages.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Uptime",
      "System"
    ],
    "attack": [
      "T1124"
    ],
    "parameters": [],
    "explanation": [
      [
        "uptime",
        "Displays uptime and load-average information."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-open-files",
    "title": "List Open Files for Current User",
    "platform": "Linux",
    "tool": "lsof",
    "category": "Processes",
    "command": "lsof -u \"$(id -un)\"",
    "description": "List open files associated with processes owned by the current user.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "lsof",
      "Processes"
    ],
    "attack": [
      "T1057"
    ],
    "parameters": [],
    "explanation": [
      [
        "lsof",
        "Lists open files."
      ],
      [
        "-u",
        "Filters by user."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-cron",
    "title": "List System Cron Directories",
    "platform": "Linux",
    "tool": "ls",
    "category": "Scheduled Tasks",
    "command": "ls -la /etc/cron.d /etc/cron.daily /etc/cron.hourly 2>/dev/null",
    "description": "List standard system cron directories where readable.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Cron",
      "Scheduled Tasks"
    ],
    "attack": [
      "T1053.003"
    ],
    "parameters": [],
    "explanation": [
      [
        "ls -la",
        "Lists files with ownership and permission metadata."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-journal-services",
    "title": "Show Recent Service Journal Entries",
    "platform": "Linux",
    "tool": "journalctl",
    "category": "Logs",
    "command": "journalctl -p warning -n 50 --no-pager",
    "description": "Show recent warning-or-higher journal entries.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "journalctl",
      "Logs"
    ],
    "attack": [
      "T1654"
    ],
    "parameters": [],
    "explanation": [
      [
        "-p warning",
        "Filters by priority."
      ],
      [
        "-n 50",
        "Limits output to fifty entries."
      ],
      [
        "--no-pager",
        "Writes directly to stdout."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-dns-config",
    "title": "Display Linux Resolver Configuration",
    "platform": "Linux",
    "tool": "cat",
    "category": "DNS",
    "command": "cat /etc/resolv.conf",
    "description": "Display resolver configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "DNS",
      "Resolver"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "/etc/resolv.conf",
        "Common resolver configuration file."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-list-users",
    "title": "List Logged-in Linux Users",
    "platform": "Linux",
    "tool": "who",
    "category": "Identity",
    "command": "who",
    "description": "Display users currently logged in to the host.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Users",
      "Sessions"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "who",
        "Shows users currently logged in."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-last-logins",
    "title": "Show Recent Linux Logins",
    "platform": "Linux",
    "tool": "last",
    "category": "Identity",
    "command": "last -n 20",
    "description": "Display recent login records from wtmp.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Logins",
      "Audit"
    ],
    "attack": [
      "T1033"
    ],
    "parameters": [],
    "explanation": [
      [
        "last",
        "Shows login history."
      ],
      [
        "-n 20",
        "Limits output to twenty entries."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "nmap-top-ports",
    "title": "Scan Top TCP Ports",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap --top-ports <COUNT> <TARGET>",
    "description": "Scan the most common TCP ports on an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Ports",
      "Discovery"
    ],
    "attack": [
      "T1046"
    ],
    "parameters": [
      {
        "name": "COUNT",
        "label": "Top ports",
        "placeholder": "100"
      },
      {
        "name": "TARGET",
        "label": "Target",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "--top-ports",
        "Scans the requested number of common ports."
      ],
      [
        "<TARGET>",
        "Authorised target."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "nmap-selected-ports",
    "title": "Scan Selected TCP Ports",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap -p <PORTS> <TARGET>",
    "description": "Scan selected TCP ports on an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Ports",
      "Discovery"
    ],
    "attack": [
      "T1046"
    ],
    "parameters": [
      {
        "name": "PORTS",
        "label": "Ports",
        "placeholder": "22,80,443"
      },
      {
        "name": "TARGET",
        "label": "Target",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "-p",
        "Specifies target ports."
      ],
      [
        "<TARGET>",
        "Authorised target."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "nmap-os-detect",
    "title": "Nmap OS Detection",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap -O <TARGET>",
    "description": "Perform operating-system fingerprinting against an authorised target.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "OS Detection",
      "Fingerprinting"
    ],
    "attack": [
      "T1046"
    ],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "-O",
        "Enables Nmap operating-system detection."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "nmap-output",
    "title": "Save Nmap Normal Output",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Reporting",
    "command": "nmap -sV -oN <FILE> <TARGET>",
    "description": "Perform service detection and save normal-format output.",
    "risk": "Active network probe",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Output",
      "Reporting"
    ],
    "attack": [
      "T1046"
    ],
    "parameters": [
      {
        "name": "FILE",
        "label": "Output file",
        "placeholder": "scan.txt"
      },
      {
        "name": "TARGET",
        "label": "Target",
        "placeholder": "10.10.10.10"
      }
    ],
    "explanation": [
      [
        "-sV",
        "Enables service detection."
      ],
      [
        "-oN",
        "Writes normal-format output."
      ]
    ],
    "telemetry": [
      "Firewall logs",
      "IDS/IPS",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  },
  {
    "id": "network-dig-a",
    "title": "Query DNS A Record",
    "platform": "Network",
    "tool": "dig",
    "category": "DNS",
    "command": "dig +short A <DOMAIN>",
    "description": "Return A records for an authorised domain.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "DNS",
      "A Record",
      "dig"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "+short",
        "Returns concise answer output."
      ],
      [
        "A",
        "Queries IPv4 address records."
      ]
    ],
    "telemetry": [
      "DNS resolver logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "network-dig-mx",
    "title": "Query DNS MX Records",
    "platform": "Network",
    "tool": "dig",
    "category": "DNS",
    "command": "dig +short MX <DOMAIN>",
    "description": "Return mail-exchanger records for an authorised domain.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "DNS",
      "MX",
      "dig"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "MX",
        "Queries mail-exchanger records."
      ]
    ],
    "telemetry": [
      "DNS resolver logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "network-dig-txt",
    "title": "Query DNS TXT Records",
    "platform": "Network",
    "tool": "dig",
    "category": "DNS",
    "command": "dig +short TXT <DOMAIN>",
    "description": "Return TXT records for an authorised domain.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "DNS",
      "TXT",
      "dig"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "DOMAIN",
        "label": "Domain",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "TXT",
        "Queries text records."
      ]
    ],
    "telemetry": [
      "DNS resolver logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "network-curl-ip",
    "title": "Display Public IP via HTTPS",
    "platform": "Network",
    "tool": "curl",
    "category": "Connectivity",
    "command": "curl -sS https://api.ipify.org",
    "description": "Retrieve the public egress IP from a public IP-echo service.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Network",
      "Public IP",
      "curl"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "curl -sS",
        "Performs a concise HTTPS request."
      ]
    ],
    "telemetry": [
      "Proxy logs",
      "Network telemetry"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-get",
    "title": "Perform HTTP GET",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -i https://<TARGET>/<PATH>",
    "description": "Perform an HTTP GET request to an authorised endpoint and include headers.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "curl",
      "HTTP",
      "GET"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      },
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "api/health"
      }
    ],
    "explanation": [
      [
        "-i",
        "Includes response headers."
      ],
      [
        "https://<TARGET>/<PATH>",
        "Authorised endpoint."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-json",
    "title": "Request JSON Content",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -sS -H \"Accept: application/json\" https://<TARGET>/<PATH>",
    "description": "Request JSON content from an authorised endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "curl",
      "JSON",
      "HTTP"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      },
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "api/status"
      }
    ],
    "explanation": [
      [
        "-H",
        "Adds an HTTP request header."
      ],
      [
        "Accept: application/json",
        "Requests JSON representation where supported."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-timing",
    "title": "Measure HTTP Timing",
    "platform": "Web",
    "tool": "curl",
    "category": "Performance",
    "command": "curl -sS -o /dev/null -w \"dns=%{time_namelookup} connect=%{time_connect} total=%{time_total}\\n\" https://<TARGET>",
    "description": "Measure DNS, connection and total request timing for an authorised endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "curl",
      "Timing",
      "HTTP"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-w",
        "Prints transfer timing variables."
      ],
      [
        "-o /dev/null",
        "Discards the response body."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "curl-follow",
    "title": "Follow HTTP Redirects",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -i -L https://<TARGET>",
    "description": "Follow redirects from an authorised endpoint while displaying response headers.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "curl",
      "Redirects",
      "HTTP"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-L",
        "Follows HTTP redirects."
      ],
      [
        "-i",
        "Includes response headers."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "web-security-headers",
    "title": "Inspect Common Security Headers",
    "platform": "Web",
    "tool": "curl",
    "category": "Headers",
    "command": "curl -sSI https://<TARGET> | grep -Ei 'content-security-policy|strict-transport-security|x-content-type-options|referrer-policy|permissions-policy'",
    "description": "Inspect common HTTP security headers returned by an authorised endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Web",
      "Headers",
      "Security Headers"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-sSI",
        "Requests response headers quietly."
      ],
      [
        "grep -Ei",
        "Filters common security-header names case-insensitively."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/web/"
  },
  {
    "id": "web-cors-origin",
    "title": "Inspect CORS Response Header",
    "platform": "Web",
    "tool": "curl",
    "category": "CORS",
    "command": "curl -sSI -H \"Origin: https://example.org\" https://<TARGET> | grep -i access-control",
    "description": "Inspect CORS-related response headers using a benign test Origin value.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "Web",
      "CORS",
      "Headers"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "Origin",
        "Supplies a benign cross-origin request origin."
      ],
      [
        "grep -i access-control",
        "Filters CORS response headers."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/web/cors/"
  },
  {
    "id": "tshark-interfaces",
    "title": "List Capture Interfaces",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -D",
    "description": "List packet-capture interfaces available to tshark.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tshark",
      "Wireshark",
      "Interfaces"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "-D",
        "Lists available capture interfaces."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "tshark-read-file",
    "title": "Read a PCAP File",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -r <PCAP>",
    "description": "Read packets from a capture file.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tshark",
      "PCAP",
      "Wireshark"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PCAP",
        "label": "PCAP file",
        "placeholder": "capture.pcapng"
      }
    ],
    "explanation": [
      [
        "-r",
        "Reads packets from a capture file."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "tshark-http",
    "title": "Filter HTTP Packets",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -r <PCAP> -Y http",
    "description": "Display HTTP packets from a capture file.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tshark",
      "HTTP",
      "Display Filter"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PCAP",
        "label": "PCAP file",
        "placeholder": "capture.pcapng"
      }
    ],
    "explanation": [
      [
        "-Y http",
        "Applies the Wireshark HTTP display filter."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "tshark-dns",
    "title": "Filter DNS Packets",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -r <PCAP> -Y dns",
    "description": "Display DNS packets from a capture file.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tshark",
      "DNS",
      "Display Filter"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PCAP",
        "label": "PCAP file",
        "placeholder": "capture.pcapng"
      }
    ],
    "explanation": [
      [
        "-Y dns",
        "Applies the Wireshark DNS display filter."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "tshark-fields",
    "title": "Extract HTTP Request Fields",
    "platform": "Network",
    "tool": "tshark",
    "category": "Packet Analysis",
    "command": "tshark -r <PCAP> -Y http.request -T fields -e ip.src -e http.host -e http.request.uri",
    "description": "Extract selected HTTP request fields from a capture file.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tshark",
      "HTTP",
      "Fields"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PCAP",
        "label": "PCAP file",
        "placeholder": "capture.pcapng"
      }
    ],
    "explanation": [
      [
        "-T fields",
        "Outputs selected protocol fields."
      ],
      [
        "-e",
        "Specifies fields to print."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/wireshark-tshark/"
  },
  {
    "id": "tcpdump-read",
    "title": "Read PCAP with tcpdump",
    "platform": "Network",
    "tool": "tcpdump",
    "category": "Packet Analysis",
    "command": "tcpdump -nn -r <PCAP>",
    "description": "Read a packet capture without hostname or service-name resolution.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "tcpdump",
      "PCAP",
      "Packets"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PCAP",
        "label": "PCAP file",
        "placeholder": "capture.pcap"
      }
    ],
    "explanation": [
      [
        "-r",
        "Reads from a capture file."
      ],
      [
        "-nn",
        "Disables name and service resolution."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/networking/"
  },
  {
    "id": "git-remotes",
    "title": "List Git Remotes",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git remote -v",
    "description": "Display configured Git remotes and URLs.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Remote",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "git remote -v",
        "Lists remote names and fetch/push URLs."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-status-short",
    "title": "Show Compact Git Status",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git status --short --branch",
    "description": "Display branch and working-tree status in compact form.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Status",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "--short",
        "Uses compact status output."
      ],
      [
        "--branch",
        "Includes branch information."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-show",
    "title": "Show Latest Git Commit",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git show --stat --oneline HEAD",
    "description": "Display the latest commit summary and changed-file statistics.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "History",
      "Repository"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "git show",
        "Displays a commit."
      ],
      [
        "--stat",
        "Shows changed-file statistics."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "git-diff-name",
    "title": "List Changed Files",
    "platform": "Tools",
    "tool": "Git",
    "category": "Version Control",
    "command": "git diff --name-only",
    "description": "List files changed in the working tree relative to the index.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Git",
      "Diff",
      "Files"
    ],
    "attack": [],
    "parameters": [],
    "explanation": [
      [
        "--name-only",
        "Prints only changed file paths."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "rg-files",
    "title": "List Files with ripgrep",
    "platform": "Tools",
    "tool": "ripgrep",
    "category": "Search",
    "command": "rg --files <PATH>",
    "description": "List files ripgrep would search beneath a path.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "ripgrep",
      "Files",
      "Search"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "."
      }
    ],
    "explanation": [
      [
        "--files",
        "Lists searchable files."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "rg-ignore-case",
    "title": "Case-insensitive Text Search",
    "platform": "Tools",
    "tool": "ripgrep",
    "category": "Search",
    "command": "rg -n -i \"<TERM>\" <PATH>",
    "description": "Search recursively without case sensitivity and include line numbers.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "ripgrep",
      "Search",
      "Case-insensitive"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TERM",
        "label": "Search term",
        "placeholder": "password"
      },
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "."
      }
    ],
    "explanation": [
      [
        "-i",
        "Makes matching case-insensitive."
      ],
      [
        "-n",
        "Displays line numbers."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "rg-filetype",
    "title": "Search a File Type with ripgrep",
    "platform": "Tools",
    "tool": "ripgrep",
    "category": "Search",
    "command": "rg -n -t <TYPE> \"<TERM>\" <PATH>",
    "description": "Search a selected ripgrep file type recursively.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "ripgrep",
      "Search",
      "File Type"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TYPE",
        "label": "File type",
        "placeholder": "py"
      },
      {
        "name": "TERM",
        "label": "Search term",
        "placeholder": "TODO"
      },
      {
        "name": "PATH",
        "label": "Path",
        "placeholder": "."
      }
    ],
    "explanation": [
      [
        "-t",
        "Restricts search to a named ripgrep file type."
      ],
      [
        "-n",
        "Displays line numbers."
      ]
    ],
    "telemetry": [
      "Local process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/git-ripgrep/"
  },
  {
    "id": "windows-hostname",
    "title": "Display Windows Hostname",
    "platform": "Windows",
    "tool": "hostname",
    "category": "System",
    "command": "hostname",
    "description": "Display the local Windows computer name.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Hostname"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "hostname",
        "Prints the local host name."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "windows-ipconfig",
    "title": "Display Windows IP Configuration",
    "platform": "Windows",
    "tool": "ipconfig",
    "category": "Network",
    "command": "ipconfig /all",
    "description": "Display detailed Windows interface, DNS and DHCP configuration.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Windows",
      "Network",
      "IP"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [],
    "explanation": [
      [
        "/all",
        "Displays detailed configuration for all adapters."
      ]
    ],
    "telemetry": [
      "Process creation"
    ],
    "notes": "https://notes.asifnawazminhas.com/windows/"
  },
  {
    "id": "linux-hostname",
    "title": "Display Linux Hostname",
    "platform": "Linux",
    "tool": "hostname",
    "category": "System",
    "command": "hostname",
    "description": "Display the current Linux hostname.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Hostname"
    ],
    "attack": [
      "T1082"
    ],
    "parameters": [],
    "explanation": [
      [
        "hostname",
        "Prints the current hostname."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "linux-route-get",
    "title": "Resolve Linux Route to Destination",
    "platform": "Linux",
    "tool": "ip",
    "category": "Network",
    "command": "ip route get <TARGET>",
    "description": "Show the route Linux would use for an authorised destination.",
    "risk": "Read only",
    "changesSystem": false,
    "tags": [
      "Linux",
      "Network",
      "Routes"
    ],
    "attack": [
      "T1016"
    ],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Destination",
        "placeholder": "8.8.8.8"
      }
    ],
    "explanation": [
      [
        "ip route get",
        "Resolves the route to a destination without sending traffic."
      ]
    ],
    "telemetry": [
      "Process execution"
    ],
    "notes": "https://notes.asifnawazminhas.com/linux/"
  },
  {
    "id": "curl-head-follow",
    "title": "Inspect Redirected Headers",
    "platform": "Web",
    "tool": "curl",
    "category": "HTTP",
    "command": "curl -sSIL https://<TARGET>",
    "description": "Follow redirects and display response headers from an authorised endpoint.",
    "risk": "Network query",
    "changesSystem": false,
    "tags": [
      "curl",
      "HTTP",
      "Redirects"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target host",
        "placeholder": "example.com"
      }
    ],
    "explanation": [
      [
        "-I",
        "Headers only."
      ],
      [
        "-L",
        "Follow redirects."
      ]
    ],
    "telemetry": [
      "Web server access logs",
      "Proxy logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/curl/"
  },
  {
    "id": "nmap-list-scan",
    "title": "Nmap List Scan",
    "platform": "Network",
    "tool": "Nmap",
    "category": "Discovery",
    "command": "nmap -sL <TARGET>",
    "description": "List addresses in an authorised target range without sending probes to target hosts.",
    "risk": "Low-impact network query",
    "changesSystem": false,
    "tags": [
      "Nmap",
      "Inventory",
      "Range"
    ],
    "attack": [],
    "parameters": [
      {
        "name": "TARGET",
        "label": "Target/CIDR",
        "placeholder": "10.10.10.0/24"
      }
    ],
    "explanation": [
      [
        "-sL",
        "Lists targets without scanning them."
      ]
    ],
    "telemetry": [
      "DNS resolver logs"
    ],
    "notes": "https://notes.asifnawazminhas.com/cheatsheets/nmap/"
  }
];
