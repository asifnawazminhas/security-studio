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
  }
];
