import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {toPng,toSvg} from 'html-to-image';
import {
  Activity,ArrowLeft,BookOpen,CheckCircle2,ChevronDown,ChevronRight,Copy,Download,
  Clock3,ExternalLink,Filter,GitCompareArrows,Image,Layers3,LayoutDashboard,Library,Menu,
  BarChart3,Braces,Check,Code2,Columns3,FileJson,FileText,Focus,GitBranch,GripVertical,HelpCircle,History,Link2,ListChecks,Maximize2,Minimize2,Moon,Network,NotebookPen,Package,Palette,Pause,Play,Plus,RadioTower,RotateCcw,Save,Search,ShieldCheck,Star,Sun,Tag,TerminalSquare,TimerReset,Trash2,Upload,Workflow,X
} from 'lucide-react';
import {commands} from './data/commands';
import {
  STORAGE_VERSION,
  clearStudioData,
  migrateStorage,
  readJSON,
  safeExternalUrl,
  safeFilename
} from './lib/storage';
import './styles.css';

const sections=[
 {title:'',items:[['Dashboard','dashboard',LayoutDashboard]]},
 {title:'COMMANDS',items:[['Command Library','library',Library],['Command Studio','command-studio',TerminalSquare],['Command Visualiser','visualiser',Image],['Command Compare','compare',Columns3],['Command Packs','packs',Package],['Runtime Library','runtimes',Code2],['Custom Commands','custom-commands',Braces]]},
 {title:'EXPLORERS',items:[['PrivEsc Explorer','privesc',ShieldCheck],['ATT&CK Explorer','attack',Network],['Attack Path Explorer','attack-path',GitCompareArrows],['Knowledge Graph','graph',GitBranch]]},
 {title:'WORKSPACE',items:[['Saved Workspace','workspace',Star],['Context Profiles','contexts',Braces],['Quick Notes','quick-notes',NotebookPen],['Copy History','copy-history',History],['Engagement Timer','timer',TimerReset],['Report Builder','reports',FileText],['Notes Link Builder','notes-links',Link2]]},
 {title:'BUILDERS',items:[['Workflow Builder','workflow',Workflow],['Assessment Sequences','assessments',ListChecks]]},
 {title:'DEFENCE',items:[['Coverage Intelligence','coverage',BarChart3],['Detection & Telemetry','detection',RadioTower],['Purple Team Mapping','purple',Layers3]]},
 {title:'SETTINGS',items:[['Appearance','appearance',Palette],['Diagnostics','diagnostics',ShieldCheck]]}
];


const storageMigration=migrateStorage();


const studioToast=(message)=>window.dispatchEvent(new CustomEvent('studio-toast',{detail:message}));

const studioCopy=(value,title='Command')=>{
 const text=String(value??'');
 navigator.clipboard?.writeText(text);
 try{
  const current=JSON.parse(localStorage.getItem('security-studio-copy-history')||'[]');
  const entry={id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,title,text,copiedAt:new Date().toISOString()};
  const next=[entry,...current.filter(x=>x.text!==text)].slice(0,20);
  localStorage.setItem('security-studio-copy-history',JSON.stringify(next));
  window.dispatchEvent(new Event('studio-copy-history'));
 }catch{}
 studioToast(`${title} copied`);
};

const catalogHealth=()=>{
 const ids=commands.map(c=>c.id);
 const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 const missingNotes=commands.filter(c=>!c.notes).length;
 const mapped=commands.filter(c=>c.attack?.length).length;
 const withTelemetry=commands.filter(c=>c.telemetry?.length).length;
 const withExplanation=commands.filter(c=>c.explanation?.length).length;
 return {duplicateIds,missingNotes,mapped,withTelemetry,withExplanation};
};

const attackCatalog=[
 ['T1082','System Information Discovery','Discovery'],
 ['T1016','System Network Configuration Discovery','Discovery'],
 ['T1046','Network Service Discovery','Discovery'],
 ['T1033','System Owner/User Discovery','Discovery'],
 ['T1057','Process Discovery','Discovery'],
 ['T1007','System Service Discovery','Discovery'],
 ['T1018','Remote System Discovery','Discovery'],
 ['T1049','System Network Connections Discovery','Discovery'],
 ['T1518.001','Security Software Discovery','Discovery'],
 ['T1069.001','Permission Groups Discovery: Local Groups','Discovery'],
 ['T1595.002','Active Scanning: Vulnerability Scanning','Reconnaissance']
];

const commandSearchScore=(c,q)=>{
 const s=q.trim().toLowerCase();
 if(!s)return 1;
 const parts=s.split(/\s+/).filter(Boolean);
 const text={
  title:c.title.toLowerCase(),tool:c.tool.toLowerCase(),platform:c.platform.toLowerCase(),
  category:c.category.toLowerCase(),tags:c.tags.join(' ').toLowerCase(),
  command:c.command.toLowerCase(),attack:c.attack.join(' ').toLowerCase(),
  description:c.description.toLowerCase()
 };
 return parts.reduce((score,p)=>{
  if(text.title.includes(p))score+=14;
  if(text.tool.includes(p))score+=9;
  if(text.platform.includes(p))score+=7;
  if(text.category.includes(p))score+=7;
  if(text.tags.includes(p))score+=6;
  if(text.attack.includes(p))score+=6;
  if(text.description.includes(p))score+=3;
  if(text.command.includes(p))score+=2;
  return score;
 },0);
};

const relatedCommandsFor=(c,limit=6)=>commands
 .filter(x=>x.id!==c.id)
 .map(x=>{
  let score=0;
  if(x.tool===c.tool)score+=4;
  if(x.platform===c.platform)score+=3;
  if(x.category===c.category)score+=3;
  score+=x.tags.filter(t=>c.tags.includes(t)).length*2;
  score+=x.attack.filter(t=>c.attack.includes(t)).length*4;
  score+=x.telemetry.filter(t=>c.telemetry.includes(t)).length;
  return {x,score};
 })
 .filter(r=>r.score>0)
 .sort((a,b)=>b.score-a.score||a.x.title.localeCompare(b.x.title))
 .slice(0,limit)
 .map(r=>r.x);

const commandQuality=(c)=>{
 const checks=[
  !!c.description?.trim(),
  Array.isArray(c.explanation)&&c.explanation.length>0,
  Array.isArray(c.tags)&&c.tags.length>=2,
  Array.isArray(c.telemetry)&&c.telemetry.length>0,
  !!c.notes?.trim(),
  Array.isArray(c.parameters),
  Array.isArray(c.attack)
 ];
 return Math.round(checks.filter(Boolean).length/checks.length*100);
};

const languageOptions=['Auto','Shell','PowerShell','Python','Java','JavaScript','TypeScript','PHP','C#','Go','JSON','YAML','SQL','HTML/XML','CSS','HTTP','Plain Text'];

const inferLanguage=(c)=>{
 const tool=(c.tool||'').toLowerCase();
 const cat=(c.category||'').toLowerCase();
 if(tool.includes('powershell'))return 'PowerShell';
 if(tool==='python'||tool.includes('python'))return 'Python';
 if(tool==='java'||tool==='javac'||tool==='jar')return 'Java';
 if(tool==='php'||tool==='composer')return 'PHP';
 if(tool==='node.js'||tool==='javascript'||tool==='npm'||c.tags?.includes('JavaScript'))return 'JavaScript';
 if(tool==='go')return 'Go';
 if(tool==='.net'||tool==='c#'||tool==='csc'||tool==='dotnet')return 'C#';
 if(tool==='curl'||tool==='httpx'||cat==='http')return 'Shell';
 if(tool==='bash'||['nmap','tshark','tcpdump','git','ripgrep','dig','nslookup','ip','ss','systemctl','uname','id','findmnt','df'].includes(tool))return 'Shell';
 if(cat.includes('json'))return 'JSON';
 return 'Shell';
};

const syntaxKeywordSets={
 'PowerShell':new Set(['function','param','if','else','elseif','foreach','for','while','switch','return','try','catch','finally','throw','class','filter','begin','process','end','in']),
 'Shell':new Set(['if','then','else','elif','fi','for','while','do','done','case','esac','function','in','export','local','readonly']),
 'Python':new Set(['def','class','if','elif','else','for','while','in','is','not','and','or','return','yield','import','from','as','try','except','finally','with','lambda','True','False','None','async','await']),
 'Java':new Set(['public','private','protected','class','interface','enum','static','final','void','int','long','double','float','boolean','char','byte','short','new','return','if','else','for','while','switch','case','try','catch','finally','throws','extends','implements','package','import','null','true','false']),
 'JavaScript':new Set(['const','let','var','function','class','new','return','if','else','for','while','switch','case','try','catch','finally','throw','import','export','from','async','await','true','false','null','undefined','this']),
 'TypeScript':new Set(['const','let','var','function','class','interface','type','enum','public','private','protected','readonly','new','return','if','else','for','while','import','export','from','async','await','true','false','null','undefined']),
 'PHP':new Set(['function','class','public','private','protected','static','final','return','if','else','elseif','foreach','for','while','switch','case','try','catch','finally','throw','namespace','use','new','true','false','null']),
 'C#':new Set(['public','private','protected','internal','class','struct','interface','enum','static','readonly','const','void','string','int','long','double','float','bool','new','return','if','else','for','foreach','while','switch','case','try','catch','finally','throw','namespace','using','async','await','true','false','null']),
 'Go':new Set(['package','import','func','var','const','type','struct','interface','map','chan','go','defer','return','if','else','for','range','switch','case','select','break','continue','true','false','nil']),
 'SQL':new Set(['select','from','where','join','inner','left','right','full','on','group','by','order','having','insert','into','update','delete','create','alter','drop','table','values','set','as','and','or','not','null','is','in','like','limit','offset']),
 'JSON':new Set(['true','false','null']),
 'YAML':new Set(['true','false','null','yes','no']),
 'HTML/XML':new Set([]),
 'CSS':new Set(['display','position','color','background','margin','padding','border','grid','flex','font','width','height']),
 'HTTP':new Set(['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','HTTP','Host','Accept','Authorization','Content-Type','User-Agent'])
};

const tokenClass=(token,language)=>{
 if(/^\s+$/.test(token))return '';
 if(/^<[^>]+>$/.test(token))return 'syn-placeholder';
 if(/^--?[A-Za-z0-9][\w-]*$/.test(token))return 'syn-option';
 if(/^\$[A-Za-z_][\w:]*/.test(token)||/^%[A-Za-z_][\w]*%$/.test(token))return 'syn-variable';
 if(/^(['"`]).*\1$/s.test(token))return 'syn-string';
 if(/^\d+(?:\.\d+)?$/.test(token))return 'syn-number';
 if(/^#/.test(token)||/^\/\//.test(token))return 'syn-comment';
 const kw=syntaxKeywordSets[language];
 if(kw&&kw.has(token))return 'syn-keyword';
 if(['|','||','&&','>','>>','<','<<','=','==','!=','=>','::',';','{','}','(',')','[',']'].includes(token))return 'syn-operator';
 if(language==='HTML/XML'&&/^<\/?[A-Za-z]/.test(token))return 'syn-keyword';
 return '';
};

const tokenizeSyntax=(code,language)=>{
 const regex=/(\s+|<[^>]+>|--?[A-Za-z0-9][\w-]*|\$[A-Za-z_][\w:.-]*|%[A-Za-z_][\w]*%|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|#[^\n]*|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|[A-Za-z_][\w.-]*|\|\||&&|>>|<<|::|=>|==|!=|[|><=;{}()\[\],.:+*\/])/g;
 const out=[];let last=0;let m;
 while((m=regex.exec(code))){
  if(m.index>last)out.push({text:code.slice(last,m.index),cls:''});
  out.push({text:m[0],cls:tokenClass(m[0],language)});last=regex.lastIndex;
 }
 if(last<code.length)out.push({text:code.slice(last),cls:''});
 return out;
};

function SyntaxCode({code,language,lineNumbers=false}){
 const lines=String(code).split('\n');
 return <code className={`syntaxCode syntax-${language.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}`}>
  {lines.map((line,i)=><span className="syntaxLine" key={`${i}-${line}`}>
   {lineNumbers&&<span className="syntaxNumber">{i+1}</span>}
   <span className="syntaxText">{tokenizeSyntax(line,language).map((t,j)=><span className={t.cls} key={j}>{t.text}</span>)}</span>
  </span>)}
 </code>
}

const routeFor=(page,c)=>page==='command-studio'&&c?`#/command/${c.id}`:`#/${page}`;
const parseRoute=()=>{
 const raw=location.hash.replace(/^#\/?/,'');
 if(raw.startsWith('command/')){
   const id=raw.slice(8);
   return {page:'command-studio',command:commands.find(c=>c.id===id)||commands[0]};
 }
 return {page:raw||'dashboard',command:null};
};

function App(){
 const [theme,setTheme]=useState(()=>{
  const saved=localStorage.getItem('security-studio-theme');
  if(saved==='light'||saved==='dark')return saved;
  return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
 });
 const [appearance,setAppearance]=useState(()=>{
  try{return JSON.parse(localStorage.getItem('security-studio-appearance')||'{}')}catch{return {}}
 });
 const [focusMode,setFocusMode]=useState(()=>localStorage.getItem('security-studio-focus-mode')==='true');
 useEffect(()=>{
  document.documentElement.dataset.theme=theme;
  localStorage.setItem('security-studio-theme',theme);
 },[theme]);
 useEffect(()=>{
  const a={accent:'cyan',background:'solid',density:'comfortable',sidebar:202,reduceMotion:false,...appearance};
  document.documentElement.dataset.accent=a.accent;
  document.documentElement.dataset.background=a.background;
  document.documentElement.dataset.density=a.density;
  document.documentElement.dataset.reduceMotion=a.reduceMotion?'true':'false';
  document.documentElement.style.setProperty('--sidebar-width',`${a.sidebar}px`);
  localStorage.setItem('security-studio-appearance',JSON.stringify(a));
 },[appearance]);
 useEffect(()=>localStorage.setItem('security-studio-focus-mode',String(focusMode)),[focusMode]);
 const [online,setOnline]=useState(navigator.onLine);
 useEffect(()=>{
  const on=()=>setOnline(true);
  const off=()=>setOnline(false);
  addEventListener('online',on);
  addEventListener('offline',off);
  return()=>{removeEventListener('online',on);removeEventListener('offline',off)};
 },[]);
 const initial=parseRoute();
 const [page,setPage]=useState(initial.page);
 const initialParams=new URLSearchParams(location.search);
 const [query,setQuery]=useState(initialParams.get('q')||'');
 const [platform,setPlatform]=useState(initialParams.get('platform')||'All');
 const [tool,setTool]=useState(initialParams.get('tool')||'All');
 const [selected,setSelected]=useState(initial.command||commands[0]);
 const [mobile,setMobile]=useState(false);
 const [tab,setTab]=useState('Explain');
 const [palette,setPalette]=useState(false);
 const [help,setHelp]=useState(false);
 const [context,setContext]=useState(()=>{
  try{return JSON.parse(localStorage.getItem('security-studio-context')||'{}')}catch{return {}}
 });
 const [contextProfile,setContextProfile]=useState(localStorage.getItem('security-studio-context-profile')||'Default');
 useEffect(()=>localStorage.setItem('security-studio-context',JSON.stringify(context)),[context]);
 useEffect(()=>localStorage.setItem('security-studio-context-profile',contextProfile),[contextProfile]);
 const [favorites,setFavorites]=useState(()=>{
   try{return JSON.parse(localStorage.getItem('security-studio-favorites')||'[]')}catch{return []}
 });
 const [recent,setRecent]=useState(()=>{
   try{return JSON.parse(localStorage.getItem('security-studio-recent')||'[]')}catch{return []}
 });
 useEffect(()=>localStorage.setItem('security-studio-favorites',JSON.stringify(favorites)),[favorites]);
 useEffect(()=>localStorage.setItem('security-studio-recent',JSON.stringify(recent)),[recent]);

 useEffect(()=>{
   const onHash=()=>{const r=parseRoute();setPage(r.page);if(r.command)setSelected(r.command)};
   const onKey=e=>{
     if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(true)}
     if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();setPalette(true)}
     if(e.key==='?'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();setHelp(true)}
     if(e.key==='Escape'){setPalette(false);setHelp(false)}
   };
   addEventListener('hashchange',onHash);addEventListener('keydown',onKey);
   return()=>{removeEventListener('hashchange',onHash);removeEventListener('keydown',onKey)}
 },[]);

 const go=(p,c=null)=>{
   if(c)setSelected(c);
   location.hash=routeFor(p,c||selected);
   setPage(p);setMobile(false);window.scrollTo(0,0);
 };
 const toggleFavorite=id=>setFavorites(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
 const removeRecent=id=>setRecent(current=>current.filter(x=>x!==id));
 const clearRecent=()=>setRecent([]);
 const openCommand=c=>{
   setSelected(c);
   setTab('Explain');
   setRecent(current=>[c.id,...current.filter(x=>x!==c.id)].slice(0,8));
   go('command-studio',c);
 };

 return <div className={`app ${focusMode?'focusMode':''}`}>
  <header>
   <button className="brand" onClick={()=>go('dashboard')}><div className="mark">A</div><div><b>Asif's Security Studio</b><span>Interactive security knowledge workspace</span></div></button>
   <button className="topsearch" onClick={()=>setPalette(true)}><Search size={17}/><span>Search commands, tools, techniques...</span><kbd>Ctrl K</kbd></button>
   <div className="topActions">
    <div className="contextIndicator" title="Active context profile"><Braces size={13}/><span>{contextProfile}</span></div>
    <div className={`connectionState ${online?'online':'offline'}`}><span/> {online?'Online':'Offline'}</div>
    <button className="themeToggle" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title={`Switch to ${theme==='dark'?'light':'dark'} mode`} aria-label={`Switch to ${theme==='dark'?'light':'dark'} mode`}>
     {theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}
     <span>{theme==='dark'?'Light':'Dark'}</span>
    </button>
    <button className="headerIconButton" onClick={()=>setFocusMode(!focusMode)} title={focusMode?'Exit focus mode':'Focus mode'} aria-label={focusMode?'Exit focus mode':'Focus mode'}>{focusMode?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button>
    <button className="headerIconButton" onClick={()=>setHelp(true)} title="Keyboard shortcuts" aria-label="Keyboard shortcuts"><HelpCircle size={16}/></button>
    <a className="notes" href="https://notes.asifnawazminhas.com/" target="_blank" rel="noopener noreferrer">Notes <ExternalLink size={14}/></a>
   </div>
   <button className="hamb" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  </header>
  <aside className={mobile?'open':''}>{sections.map((s,i)=><div className="navgroup" key={i}>{s.title&&<label>{s.title}</label>}{s.items.map(([name,id,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><Icon size={18}/>{name}</button>)}</div>)}<div className="sidefoot"><span className="dot"/> Studio v2.7</div></aside>
  <main>
   {page==='dashboard'?<Dashboard go={go} favorites={favorites} recent={recent}/>:
    page==='library'?<LibraryPage query={query} setQuery={setQuery} platform={platform} setPlatform={setPlatform} tool={tool} setTool={setTool} openCommand={openCommand} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='command-studio'?<CommandStudio c={selected} tab={tab} setTab={setTab} go={go} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='visualiser'?<Visualiser c={selected}/>: 
    page==='compare'?<CommandCompare openCommand={openCommand}/>: 
    page==='packs'?<CommandPacks openCommand={openCommand}/>: 
    page==='runtimes'?<RuntimeLibrary openCommand={openCommand}/>:
    page==='custom-commands'?<CustomCommands/>:
    page==='privesc'?<PrivEscExplorer openCommand={openCommand}/>:
    page==='attack'?<AttackExplorer openCommand={openCommand}/>:
    page==='attack-path'?<AttackPathExplorer openCommand={openCommand}/>: 
    page==='graph'?<KnowledgeGraph openCommand={openCommand}/>:
    page==='workspace'?<WorkspacePage favorites={favorites} recent={recent} toggleFavorite={toggleFavorite} openCommand={openCommand} removeRecent={removeRecent} clearRecent={clearRecent}/>: 
    page==='contexts'?<ContextProfiles context={context} setContext={setContext} active={contextProfile} setActive={setContextProfile}/>: 
    page==='quick-notes'?<QuickNotes activeProfile={contextProfile}/>:
    page==='copy-history'?<CopyHistory/>:
    page==='timer'?<EngagementTimer activeProfile={contextProfile}/>: 
    page==='reports'?<ReportBuilder/>:
    page==='notes-links'?<NotesLinkBuilder/>:
    page==='workflow'?<WorkflowBuilder/>:
    page==='assessments'?<AssessmentSequences openCommand={openCommand}/>:
    page==='coverage'?<CoverageIntelligence openCommand={openCommand}/>:
    page==='detection'?<Detection/>:
    page==='purple'?<Purple/>:
    page==='appearance'?<AppearanceStudio appearance={appearance} setAppearance={setAppearance} theme={theme} setTheme={setTheme}/>:
    page==='diagnostics'?<Diagnostics/>:<NotFound/>}
  </main>
  {palette&&<CommandPalette close={()=>setPalette(false)} openCommand={c=>{setPalette(false);openCommand(c)}} go={p=>{setPalette(false);go(p)}}/>}
  {help&&<ShortcutHelp close={()=>setHelp(false)}/>}<ToastHost/>
 </div>
}

function Dashboard({go,favorites,recent}){
 const quick=[
  ['Command Library','library',Library,'Search structured security commands'],
  ['Command Studio','command-studio',TerminalSquare,'Explain, modify and contextualise commands'],
  ['Command Visualiser','visualiser',Image,'Create syntax-highlighted documentation cards'],
  ['Knowledge Graph','graph',GitBranch,'Connect commands, telemetry, ATT&CK and Notes'],
  ['Quick Notes','quick-notes',NotebookPen,'Keep local engagement notes close'],
  ['Appearance','appearance',Palette,'Personalise theme, density and workspace']
 ];
 const health=catalogHealth();
 return <>
  <div className="hero">
   <div>
    <span className="eyebrow">ASIF'S SECURITY STUDIO</span>
    <h1>Security knowledge,<br/><em>made interactive.</em></h1>
    <p>Explore detailed security commands, understand context, map telemetry and turn security notes into practical workflows and finished reports.</p>
    <div className="heroactions">
     <button onClick={()=>go('library')}>Explore Commands <ChevronRight size={16}/></button>
     <a className="heroSecondary" href="https://notes.asifnawazminhas.com/" target="_blank" rel="noopener noreferrer"><BookOpen size={16}/> Open Security Notes</a>
    </div>
    <div className="heroStats">
     <span><b>{commands.length}</b> commands</span>
     <span><b>{favorites.length}</b> favourites</span>
     <span><b>{recent.length}</b> recent</span>
     <span><b>{health.mapped}</b> ATT&CK mapped</span>
    </div>
   </div>
   <div className="terminal">
    <div className="termbar"><i/><i/><i/><span>security-studio</span></div>
    <code>
     <b>›</b> knowledge --interactive<br/>
     <span>✓ {commands.length} commands indexed</span><br/>
     <span>✓ Command packs ready</span><br/>
     <span>✓ Report Builder ready</span><br/>
     <span>✓ Notes integration ready</span><br/>
     <span>✓ Workspace backup enabled</span><br/>
     <br/><b>$</b> explore <u>security</u><br/><strong>Ready.</strong>
    </code>
   </div>
  </div>

  <section>
   <div className="sectionhead"><div><span className="eyebrow">WORKSPACE</span><h2>Choose where to start</h2></div></div>
   <div className="grid">{quick.map(([n,id,I,d])=>
    <button className="featurecard" onClick={()=>go(id)} key={id}>
     <I/><div><h3>{n}</h3><p>{d}</p></div><ChevronRight className="arrow"/>
    </button>)}
   </div>
  </section>

  <section>
   <div className="catalogHealth">
    <div><Check/><b>{health.withExplanation}</b><span>Commands with explanation</span></div>
    <div><RadioTower/><b>{health.withTelemetry}</b><span>Commands with telemetry</span></div>
    <div><Network/><b>{health.mapped}</b><span>ATT&CK mapped</span></div>
    <div className={health.duplicateIds.length?'healthWarn':'healthGood'}><ShieldCheck/><b>{health.duplicateIds.length}</b><span>Duplicate IDs</span></div>
   </div>
  </section>

  <section>
   <div className="banner"><Activity/><div><b>Built to connect Notes, Studio and reporting</b><span>Learn in Security Notes, open commands in Studio, organise validation work, then export a report.</span></div></div>
  </section>
 </>
}

function CommandPalette({close,openCommand,go}){
 const [q,setQ]=useState('');
 const [active,setActive]=useState(0);
 const input=useRef(null);
 useEffect(()=>input.current?.focus(),[]);
 const results=commands
  .map(c=>({c,score:commandSearchScore(c,q)}))
  .filter(x=>x.score>0)
  .sort((a,b)=>b.score-a.score||a.c.title.localeCompare(b.c.title))
  .slice(0,9)
  .map(x=>x.c);
 useEffect(()=>setActive(0),[q]);
 const key=e=>{
  if(e.key==='ArrowDown'){e.preventDefault();setActive(x=>Math.min(x+1,results.length-1))}
  if(e.key==='ArrowUp'){e.preventDefault();setActive(x=>Math.max(x-1,0))}
  if(e.key==='Enter'&&results[active]){e.preventDefault();openCommand(results[active])}
  if(e.key.toLowerCase()==='c'&&e.altKey&&results[active]){e.preventDefault();studioCopy(results[active].command,results[active].title)}
 };
 return <div className="paletteback" onMouseDown={e=>e.target===e.currentTarget&&close()}>
  <div className="palette">
   <div className="paletteinput"><Search/><input ref={input} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={key} placeholder="Search commands, ATT&CK IDs, tools, tags..."/><kbd>Esc</kbd></div>
   <div className="paletteresults">{results.map((c,i)=><button className={i===active?'active':''} key={c.id} onMouseEnter={()=>setActive(i)} onClick={()=>openCommand(c)}><TerminalSquare/><div><b>{c.title}</b><span>{c.platform} · {c.tool} · {c.category}</span></div><ChevronRight/></button>)}{!results.length&&<div className="empty">No matching commands.</div>}</div>
   <div className="palettefoot"><button onClick={()=>go('library')}>Open Command Library</button><span>↑↓ navigate · Enter open · Alt+C copy</span></div>
  </div>
 </div>
}

function LibraryPage({query,setQuery,platform,setPlatform,tool,setTool,openCommand,favorites,toggleFavorite}){
 const params=new URLSearchParams(location.search);
 const [sort,setSort]=useState(params.get('sort')||'Title');
 const [category,setCategory]=useState(params.get('category')||'All');
 const [tag,setTag]=useState(params.get('tag')||'All');
 const [onlyFavorites,setOnlyFavorites]=useState(params.get('favorites')==='1');

 const platforms=['All',...new Set(commands.map(c=>c.platform))];
 const tools=['All',...new Set(commands.map(c=>c.tool))];
 const categories=['All',...new Set(commands.map(c=>c.category))].sort();
 const tags=['All',...new Set(commands.flatMap(c=>c.tags))].sort();

 useEffect(()=>{
   const p=new URLSearchParams();
   if(query)p.set('q',query);
   if(platform!=='All')p.set('platform',platform);
   if(tool!=='All')p.set('tool',tool);
   if(category!=='All')p.set('category',category);
   if(tag!=='All')p.set('tag',tag);
   if(sort!=='Title')p.set('sort',sort);
   if(onlyFavorites)p.set('favorites','1');
   const qs=p.toString();
   history.replaceState(null,'',`${location.pathname}${qs?`?${qs}`:''}${location.hash||'#/library'}`);
 },[query,platform,tool,category,tag,sort,onlyFavorites]);

 const filtered=useMemo(()=>{
   const rows=commands.filter(c=>
     (platform==='All'||c.platform===platform) &&
     (tool==='All'||c.tool===tool) &&
     (category==='All'||c.category===category) &&
     (tag==='All'||c.tags.includes(tag)) &&
     (!onlyFavorites||favorites.includes(c.id)) &&
     (!query||commandSearchScore(c,query)>0)
   );
   if(query)return [...rows].sort((a,b)=>commandSearchScore(b,query)-commandSearchScore(a,query)||a.title.localeCompare(b.title));
   return [...rows].sort((a,b)=>{
     if(sort==='Platform')return a.platform.localeCompare(b.platform)||a.title.localeCompare(b.title);
     if(sort==='Tool')return a.tool.localeCompare(b.tool)||a.title.localeCompare(b.title);
     if(sort==='Category')return a.category.localeCompare(b.category)||a.title.localeCompare(b.title);
     return a.title.localeCompare(b.title);
   });
 },[query,platform,tool,category,tag,onlyFavorites,favorites,sort]);

 const count=(key,value)=>commands.filter(c=>value==='All'||(key==='tags'?c.tags.includes(value):c[key]===value)).length;
 const copy=(e,c)=>{e.stopPropagation();studioCopy(c.command,c.title);};
 const fav=(e,c)=>{e.stopPropagation();toggleFavorite(c.id)};
 const copyLink=()=>studioCopy(location.href,'Filtered Command Library link');
 const resetFilters=()=>{
   setQuery('');setPlatform('All');setTool('All');setCategory('All');setTag('All');setSort('Title');setOnlyFavorites(false);
 };

 return <>
  <PageTitle kicker="COMMANDS" title="Command Library" text="Search reusable security commands by platform, tool, category and tag."/>
  <div className="librarytools">
   <div className="librarysearch"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search commands, tools, categories..."/></div>
   <div className="filterrow"><Filter size={16}/><b>Platform</b>{platforms.map(p=><button className={platform===p?'selected':''} onClick={()=>setPlatform(p)} key={p}>{p}<small>{count('platform',p)}</small></button>)}</div>
   <div className="filterrow"><Filter size={16}/><b>Tool</b>{tools.slice(0,22).map(p=><button className={tool===p?'selected':''} onClick={()=>setTool(p)} key={p}>{p}<small>{count('tool',p)}</small></button>)}</div>
   <div className="libraryAdvancedFilters">
    <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Tag<select value={tag} onChange={e=>setTag(e.target.value)}>{tags.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Sort<select value={sort} onChange={e=>setSort(e.target.value)}><option>Title</option><option>Platform</option><option>Tool</option><option>Category</option></select></label>
   </div>
   <div className="libraryOptions">
    <div className="optionGroup">
     <button className={onlyFavorites?'optionActive':''} onClick={()=>setOnlyFavorites(!onlyFavorites)}><Star size={14} fill={onlyFavorites?'currentColor':'none'}/> Favourites</button>
     <button onClick={resetFilters}><RotateCcw size={14}/> Reset filters</button>
    </div>
    <button onClick={copyLink}><Copy size={14}/> Copy filtered link</button>
   </div>
  </div>

  <div className="resultline"><b>{filtered.length}</b> commands match current filters</div>
  <div className="commandgrid">{filtered.map(c=><article className="commandcard" key={c.id}>
   <div className="badges"><span>{c.platform}</span><span>{c.tool}</span><small>{c.risk}</small><small className={`qualityBadge ${commandQuality(c)>=85?'good':'review'}`}>{commandQuality(c)}%</small></div>
   <h3>{c.title}</h3><p>{c.description}</p><code>{c.command}</code>
   <div className="tags">{c.tags.map(t=><small key={t}>{t}</small>)}</div>
   <div className="cardActions">
    <button onClick={e=>fav(e,c)} className={favorites.includes(c.id)?'favOn':''}><Star size={14} fill={favorites.includes(c.id)?'currentColor':'none'}/> {favorites.includes(c.id)?'Saved':'Save'}</button>
    <button onClick={e=>copy(e,c)}><Copy size={14}/> Copy</button>
    <a href={c.notes} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}><BookOpen size={14}/> Notes</a>
    <button className="openBtn" onClick={()=>openCommand(c)}>Open in Studio <ChevronRight size={14}/></button>
   </div>
  </article>)}</div>
  {!filtered.length&&<div className="empty">No commands match the current search and filters.</div>}
 </>
}

function CommandStudio({c,tab,setTab,go,favorites,toggleFavorite}){
 const [values,setValues]=useState({});
 const [ctx,setCtx]=useState(()=>{try{return JSON.parse(localStorage.getItem('security-studio-context')||'{}')}catch{return {}}});
 useEffect(()=>setValues(Object.fromEntries(c.parameters.map(p=>[p.name,'']))),[c.id]);
 useEffect(()=>{const h=()=>{try{setCtx(JSON.parse(localStorage.getItem('security-studio-context')||'{}'))}catch{}};addEventListener('storage',h);return()=>removeEventListener('storage',h)},[]);
 const generated=c.parameters.reduce((s,p)=>s.replaceAll(`<${p.name}>`,values[p.name]||ctx[p.name]||`<${p.name}>`),c.command);
 const related=relatedCommandsFor(c);
 const copy=()=>studioCopy(generated,c.title);
 return <><button className="back" onClick={()=>go('library')}><ArrowLeft size={15}/> Command Library</button><div className="studioTitleRow"><PageTitle kicker={`${c.platform} / ${c.category}`} title={c.title} text={c.description}/><button className={`saveCommand ${favorites.includes(c.id)?'saved':''}`} onClick={()=>toggleFavorite(c.id)}><Star size={16} fill={favorites.includes(c.id)?'currentColor':'none'}/>{favorites.includes(c.id)?'Saved':'Save command'}</button></div><div className="studio"><div className="commandbox"><div className="commandmeta"><span className="cmdtool"><TerminalSquare size={18}/>{c.tool}</span><span className="cmdrisk">{c.risk}</span></div><div className="commandline"><code>{generated}</code><button className="copybtn" onClick={copy}><Copy size={15}/> Copy</button></div></div><div className="tabs">{['Explain','Modify','Detect','Visualise','Related'].map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>
 {tab==='Explain'&&<div className="twocol"><Panel title="Command Breakdown"><dl>{c.explanation.map(([a,b])=><React.Fragment key={a}><dt>{a}</dt><dd>{b}</dd></React.Fragment>)}</dl></Panel><Panel title="Context"><dl><dt>Platform</dt><dd>{c.platform}</dd><dt>Tool</dt><dd>{c.tool}</dd><dt>Category</dt><dd>{c.category}</dd><dt>Changes system</dt><dd>{c.changesSystem?'Yes':'No'}</dd><dt>Risk</dt><dd>{c.risk}</dd></dl></Panel></div>}
 {tab==='Modify'&&<Panel title="Command Parameters">{c.parameters.length?<>{c.parameters.map(p=><label className="field" key={p.name}>{p.label}<input placeholder={p.placeholder} value={values[p.name]||''} onChange={e=>setValues({...values,[p.name]:e.target.value})}/></label>)}<div className="generated"><small>GENERATED COMMAND</small><code>{generated}</code><button onClick={copy}><Copy size={15}/> Copy</button></div></>:<p>This command has no editable placeholders.</p>}</Panel>}
 {tab==='Detect'&&<div className="twocol"><Panel title="Defender View"><p>Use the telemetry below as assessment context. A command alone is not automatically suspicious; correlation and intent matter.</p>{c.telemetry.map(x=><div className="check" key={x}><CheckCircle2 size={16}/>{x}</div>)}</Panel><Panel title="ATT&CK Context">{c.attack.length?c.attack.map(x=><div className="attackpill" key={x}>{x}</div>):<p>No ATT&CK mapping assigned to this reference entry.</p>}</Panel></div>}
 {tab==='Visualise'&&<VisualPreview c={{...c,command:generated}}/>}
 {tab==='Related'&&<div className="relatedGrid">
   <Panel title="Command Relationships"><div className="relationshipList">{related.map((x,i)=><button key={x.id} onClick={()=>{location.hash=`#/command/${x.id}`;location.reload()}}><span>{i===0?'Next check':'Related'}</span><div><b>{x.title}</b><small>{x.platform} · {x.tool} · {x.category}</small></div><ChevronRight/></button>)}</div></Panel>
   <Panel title="Security Notes"><p>Continue with the full methodology and supporting documentation.</p><a className="textlink" href={c.notes} target="_blank" rel="noopener noreferrer">Open related Security Notes <ExternalLink size={14}/></a><div className="tags big">{c.tags.map(x=><small key={x}>{x}</small>)}</div><p className="permalink">Permalink<br/><code>{location.href}</code></p></Panel>
  </div>}
 </div></>
}

function PrivEscExplorer({openCommand}){
 const [os,setOs]=useState('Windows');
 const [step,setStep]=useState('identity');
 const [answers,setAnswers]=useState({});
 const flow={
  Windows:[
   ['identity','Identity & token','Review the current user, groups and token privileges.',['windows-identity','windows-groups','windows-privileges']],
   ['controls','Application control','Review AppLocker, PowerShell language mode and endpoint controls.',['applocker-effective','language-mode','windows-defender-status']],
   ['services','Services & processes','Review running services and processes for security context.',['windows-services','windows-processes']],
   ['network','Network context','Review listeners, routes, DNS and firewall profile state.',['tcp-listeners','windows-routes','windows-dns-cache','windows-firewall-profiles']]
  ],
  Linux:[
   ['identity','Identity & groups','Review current identity and group context.',['linux-identity']],
   ['services','Services & processes','Review running services and processes.',['linux-services','linux-processes']],
   ['network','Network context','Review interfaces, routes and listening sockets.',['linux-ip','linux-routes','linux-listeners']],
   ['filesystem','Filesystem context','Review mounted filesystems and disk usage.',['linux-mounts','linux-disk']]
  ]
 };
 const steps=flow[os];
 const current=steps.find(x=>x[0]===step)||steps[0];
 useEffect(()=>setStep(flow[os][0][0]),[os]);
 const currentCommands=current[3].map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 return <><PageTitle kicker="EXPLORERS" title="PrivEsc Explorer" text="Decision-support for reviewing privilege boundaries, context and defensive controls."/><div className="explorerShell"><div className="explorerTop"><div className="segmented"><button className={os==='Windows'?'active':''} onClick={()=>setOs('Windows')}>Windows</button><button className={os==='Linux'?'active':''} onClick={()=>setOs('Linux')}>Linux</button></div><div className="explainer">This explorer organises review steps and links to read-only validation commands. It does not perform exploitation.</div></div><div className="explorerGrid"><div className="stepRail">{steps.map(([id,title],i)=><button className={step===id?'active':''} key={id} onClick={()=>setStep(id)}><span>{i+1}</span><b>{title}</b><ChevronRight/></button>)}</div><div className="stepContent"><span className="eyebrow">{os.toUpperCase()} REVIEW STEP</span><h2>{current[1]}</h2><p>{current[2]}</p><div className="decisionRow"><button className={answers[step]==='reviewed'?'yes':''} onClick={()=>setAnswers({...answers,[step]:'reviewed'})}>Mark reviewed</button><button className={answers[step]==='followup'?'follow':''} onClick={()=>setAnswers({...answers,[step]:'followup'})}>Needs follow-up</button></div><h3>Related commands</h3><div className="miniCommands">{currentCommands.map(c=><button key={c.id} onClick={()=>openCommand(c)}><div><b>{c.title}</b><code>{c.command}</code></div><ChevronRight/></button>)}</div><a className="textlink" target="_blank" rel="noopener noreferrer" href={os==='Windows'?'https://notes.asifnawazminhas.com/windows/':'https://notes.asifnawazminhas.com/linux/'}>Open {os} Security Notes <ExternalLink size={14}/></a></div></div></div></>
}

function AttackExplorer({openCommand}){
 const [tactic,setTactic]=useState('All');
 const [selected,setSelected]=useState(null);
 const tactics=['All',...new Set(attackCatalog.map(x=>x[2]))];
 const rows=attackCatalog.filter(x=>tactic==='All'||x[2]===tactic);

 let detail=<div className="empty">Select a technique to inspect mapped commands and telemetry.</div>;

 if(selected){
   const item=attackCatalog.find(x=>x[0]===selected);
   const mapped=commands.filter(c=>c.attack.includes(selected));
   const telemetry=[...new Set(mapped.flatMap(c=>c.telemetry))];

   detail=<>
     <span className="eyebrow">{item[2]}</span>
     <h2>{item[0]} - {item[1]}</h2>
     <h3>Mapped commands</h3>
     <div className="miniCommands">
       {mapped.length
         ? mapped.map(c=>
             <button key={c.id} onClick={()=>openCommand(c)}>
               <div>
                 <b>{c.title}</b>
                 <code>{c.command}</code>
               </div>
               <ChevronRight/>
             </button>
           )
         : <p>No commands mapped yet.</p>
       }
     </div>
     <h3>Telemetry coverage</h3>
     <div className="tags big">
       {telemetry.map(x=><small key={x}>{x}</small>)}
     </div>
   </>;
 }

 return <>
   <PageTitle
     kicker="EXPLORERS"
     title="ATT&CK Explorer"
     text="Connect ATT&CK techniques to commands, telemetry and supporting notes."
   />
   <div className="filterrow attackFilters">
     <b>Tactic</b>
     {tactics.map(t=>
       <button
         className={tactic===t?'selected':''}
         onClick={()=>setTactic(t)}
         key={t}
       >
         {t}
       </button>
     )}
   </div>
   <div className="attacklayout">
     <div className="attackgrid">
       {rows.map(([id,name,tac])=>{
         const mapped=commands.filter(c=>c.attack.includes(id));
         return (
           <button
             className={`attackcard ${selected===id?'selected':''}`}
             key={id}
             onClick={()=>setSelected(id)}
           >
             <div>
               <span>{tac}</span>
               <b>{id}</b>
             </div>
             <h3>{name}</h3>
             <p>{mapped.length} mapped command{mapped.length===1?'':'s'}</p>
           </button>
         );
       })}
     </div>
     <div className="attackdetail">{detail}</div>
   </div>
 </>;
}

function AttackPathExplorer({openCommand}){
 const [focus,setFocus]=useState('user');
 const nodes=[
  {id:'user',type:'Identity',title:'Current User',sub:'Starting security context',cmd:'windows-identity'},
  {id:'group',type:'Relationship',title:'Group Membership',sub:'Review token group context',cmd:'windows-groups'},
  {id:'host',type:'System',title:'Current Host',sub:'Review services and processes',cmd:'windows-systeminfo'},
  {id:'control',type:'Control',title:'Application Control',sub:'Review AppLocker / CLM context',cmd:'applocker-effective'},
  {id:'telemetry',type:'Defence',title:'Detection Context',sub:'Review expected telemetry',cmd:'windows-processes'}
 ];
 const n=nodes.find(x=>x.id===focus);
 const c=commands.find(x=>x.id===n.cmd);

 return <>
  <PageTitle kicker="EXPLORERS" title="Attack Path Explorer" text="Visualise identities, relationships, systems and defensive control boundaries."/>
  <div className="pathShell">
   <div className="pathCanvas">
    <div className="pathTrack">
     {nodes.map((x,i)=><React.Fragment key={x.id}>
      <button className={`pathNode ${focus===x.id?'active':''}`} onClick={()=>setFocus(x.id)}>
       <small>{x.type}</small>
       <b>{x.title}</b>
       <span>{x.sub}</span>
      </button>
      {i<nodes.length-1&&<div className="pathEdge">
       <span>{['MemberOf','Context','ProtectedBy','ObservedBy'][i]}</span>
       <ChevronRight/>
      </div>}
     </React.Fragment>)}
    </div>
   </div>
   <div className="pathDetail">
    <span className="eyebrow">{n.type.toUpperCase()}</span>
    <h2>{n.title}</h2>
    <p>{n.sub}</p>
    {c&&<>
     <div className="commandSnippet"><code>{c.command}</code></div>
     <button className="primarySmall" onClick={()=>openCommand(c)}>Open related command <ChevronRight size={14}/></button>
    </>}
    <a className="textlink" target="_blank" rel="noopener noreferrer" href="https://notes.asifnawazminhas.com/active-directory/" target="_blank" rel="noopener noreferrer">Open related Security Notes <ExternalLink size={14}/></a>
   </div>
  </div>
 </>;
}

function VisualPreview({c}){
 const ref=useRef(null);
 const [theme,setTheme]=useState('Security Notes Dark');
 const [language,setLanguage]=useState('Auto');
 const [prompt,setPrompt]=useState(c.tool==='PowerShell'?'PS>':'');
 const [watermark,setWatermark]=useState(true);
 const [watermarkText,setWatermarkText]=useState('studio.asifnawazminhas.com');
 const [windowTitle,setWindowTitle]=useState(c.tool);
 const [fontSize,setFontSize]=useState(20);
 const [padding,setPadding]=useState(48);
 const [customCommand,setCustomCommand]=useState(c.command);
 const [layout,setLayout]=useState('Terminal');
 const [showMeta,setShowMeta]=useState(true);
 const [lineNumbers,setLineNumbers]=useState(false);
 const [syntax,setSyntax]=useState(true);

 useEffect(()=>{
   setPrompt(c.tool==='PowerShell'?'PS>':'');
   setWindowTitle(c.tool);
   setCustomCommand(c.command);
   setLanguage('Auto');
 },[c.id]);

 const activeLanguage=language==='Auto'?inferLanguage(c):language;
 const themeClass={
   'Security Notes Dark':'theme-security','Midnight':'theme-midnight','Clean Light':'theme-light',
   'Matrix Green':'theme-matrix','Purple Ops':'theme-purple','Dracula':'theme-dracula',
   'Nord':'theme-nord','Solarized Dark':'theme-solarized','Amber Terminal':'theme-amber',
   'High Contrast':'theme-contrast'
 }[theme]||'theme-security';
 const layoutClass={'Terminal':'layout-terminal','Minimal':'layout-minimal','Card':'layout-card','Poster':'layout-poster'}[layout]||'layout-terminal';

 const download=async(type)=>{
   if(!ref.current)return;
   const fn=type==='png'?toPng:toSvg;
   const data=await fn(ref.current,{pixelRatio:2,cacheBust:true});
   const a=document.createElement('a');a.href=data;a.download=`${safeFilename(c.id)}-${safeFilename(theme.toLowerCase())}.${type}`;a.click();
 };
 const reset=()=>{
   setTheme('Security Notes Dark');setLanguage('Auto');setPrompt(c.tool==='PowerShell'?'PS>':'');
   setWatermark(true);setWatermarkText('studio.asifnawazminhas.com');setWindowTitle(c.tool);
   setFontSize(20);setPadding(48);setCustomCommand(c.command);setLayout('Terminal');
   setShowMeta(true);setLineNumbers(false);setSyntax(true);
 };

 return <div className="visualPro v24">
  <div className="visualSettings carbonControls">
   <div className="visualField wide"><label>Command / code</label><textarea value={customCommand} onChange={e=>setCustomCommand(e.target.value)}/></div>
   <div className="visualField"><label>Language</label><select value={language} onChange={e=>setLanguage(e.target.value)}>{languageOptions.map(x=><option key={x}>{x}</option>)}</select><small className="controlHint">Detected: {inferLanguage(c)}</small></div>
   <div className="visualField"><label>Theme</label><select value={theme} onChange={e=>setTheme(e.target.value)}><option>Security Notes Dark</option><option>Midnight</option><option>Clean Light</option><option>Matrix Green</option><option>Purple Ops</option><option>Dracula</option><option>Nord</option><option>Solarized Dark</option><option>Amber Terminal</option><option>High Contrast</option></select></div>
   <div className="visualField"><label>Layout</label><select value={layout} onChange={e=>setLayout(e.target.value)}><option>Terminal</option><option>Minimal</option><option>Card</option><option>Poster</option></select></div>
   <div className="visualField"><label>Prompt</label><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Optional"/></div>
   <div className="visualField"><label>Window title</label><input value={windowTitle} onChange={e=>setWindowTitle(e.target.value)}/></div>
   <div className="visualField"><label>Font size</label><select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))}><option value="16">16 px</option><option value="18">18 px</option><option value="20">20 px</option><option value="22">22 px</option><option value="24">24 px</option><option value="28">28 px</option></select></div>
   <div className="visualField"><label>Card padding</label><select value={padding} onChange={e=>setPadding(Number(e.target.value))}><option value="32">Compact</option><option value="48">Balanced</option><option value="64">Spacious</option><option value="80">Poster</option></select></div>
   <div className="visualField toggleField"><label>Syntax colours</label><button className={`togglePill ${syntax?'on':''}`} onClick={()=>setSyntax(!syntax)} type="button"><span/>{syntax?'On':'Off'}</button></div>
   <div className="visualField toggleField"><label>Line numbers</label><button className={`togglePill ${lineNumbers?'on':''}`} onClick={()=>setLineNumbers(!lineNumbers)} type="button"><span/>{lineNumbers?'Shown':'Hidden'}</button></div>
   <div className="visualField toggleField"><label>Details</label><button className={`togglePill ${showMeta?'on':''}`} onClick={()=>setShowMeta(!showMeta)} type="button"><span/>{showMeta?'Shown':'Hidden'}</button></div>
   <div className="visualField watermarkField"><label>Watermark</label><div className="inlineControl"><input type="checkbox" checked={watermark} onChange={e=>setWatermark(e.target.checked)}/><input disabled={!watermark} value={watermarkText} onChange={e=>setWatermarkText(e.target.value)}/></div></div>
  </div>

  <div ref={ref} className={`exportcard pro refined carbonCard ${themeClass} ${layoutClass}`} data-language={activeLanguage}>
   {layout!=='Minimal'&&<div className="exportbar"><div className="windowDots"><i/><i/><i/></div><div className="windowIdentity"><span>{windowTitle}</span><small>{activeLanguage}</small></div></div>}
   <div className="exportbody" style={{padding:`${padding}px`}}>
    {showMeta&&<div className="visualMeta"><span>{activeLanguage}</span><span>{c.platform}</span><span>{c.tool}</span><span>{c.category}</span></div>}
    <div className="exportCommand refinedCommand codeCanvas" style={{fontSize:`${fontSize}px`}}>
     {prompt&&<b className="codePrompt">{prompt}</b>}
     {syntax?<SyntaxCode code={customCommand} language={activeLanguage} lineNumbers={lineNumbers}/>:<code>{customCommand}</code>}
    </div>
    <div className="visualFooter">{watermark&&<small>{watermarkText}</small>}{showMeta&&<span>{c.risk}</span>}</div>
   </div>
  </div>

  <div className="visualActionBar"><div className="visualActionGroup"><button className="primarySmall" onClick={()=>download('png')}><Download size={15}/> Export PNG</button><button className="secondarySmall" onClick={()=>download('svg')}><Download size={15}/> Export SVG</button><button className="secondarySmall" onClick={()=>{studioCopy(customCommand,c.title)}}><Copy size={15}/> Copy</button></div><button className="secondarySmall" onClick={reset}><RotateCcw size={15}/> Reset</button></div>
 </div>
}

function Visualiser({c}){
 const [chosen,setChosen]=useState(c||commands[0]);
 return <>
  <PageTitle kicker="COMMANDS" title="Command Visualiser" text="Create Carbon-style syntax-coloured command and code cards for documentation, reports and knowledge sharing."/>
  <div className="visualselect"><label>Library command<select value={chosen.id} onChange={e=>setChosen(commands.find(c=>c.id===e.target.value))}>{commands.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label></div>
  <VisualPreview c={chosen}/>
 </>
}

function CommandCompare({openCommand}){
 const [leftId,setLeftId]=useState(commands[0]?.id||'');
 const [rightId,setRightId]=useState(commands[1]?.id||commands[0]?.id||'');
 const a=commands.find(c=>c.id===leftId)||commands[0];
 const b=commands.find(c=>c.id===rightId)||commands[1]||commands[0];
 const Row=({label,va,vb})=><div className="compareRow"><b>{label}</b><span>{va||'—'}</span><span>{vb||'—'}</span></div>;
 return <>
  <PageTitle kicker="COMMANDS" title="Command Compare" text="Compare command purpose, risk, ATT&CK, telemetry and quality across platforms and tools."/>
  <div className="compareSelects"><label>Command A<select value={leftId} onChange={e=>setLeftId(e.target.value)}>{commands.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label>Command B<select value={rightId} onChange={e=>setRightId(e.target.value)}>{commands.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label></div>
  <div className="compareTable">
   <div className="compareHead"><span/><div><h3>{a.title}</h3><code>{a.command}</code><button onClick={()=>openCommand(a)}>Open in Studio</button></div><div><h3>{b.title}</h3><code>{b.command}</code><button onClick={()=>openCommand(b)}>Open in Studio</button></div></div>
   <Row label="Platform" va={a.platform} vb={b.platform}/><Row label="Tool" va={a.tool} vb={b.tool}/><Row label="Category" va={a.category} vb={b.category}/><Row label="Risk" va={a.risk} vb={b.risk}/><Row label="ATT&CK" va={a.attack.join(', ')} vb={b.attack.join(', ')}/><Row label="Telemetry" va={a.telemetry.join(', ')} vb={b.telemetry.join(', ')}/><Row label="Quality" va={`${commandQuality(a)}%`} vb={`${commandQuality(b)}%`}/>
  </div>
 </>
}

const assessmentTemplates={
 'Windows Baseline':['windows-identity','windows-groups','windows-privileges','windows-computer-info','applocker-effective','windows-language-mode','windows-listening','windows-services'],
 'Linux Baseline':['linux-identity','linux-system','linux-kernel','linux-processes','linux-services','linux-ip','linux-routes','linux-listeners'],
 'Web Quick Review':['curl-head','curl-follow','curl-timing','web-security-headers','web-cors-origin'],
 'Network Review':['network-ping','network-traceroute','dns-dig','nmap-selected-ports','nmap-service','network-tls-inspect']
};

function AssessmentSequences({openCommand}){
 const [template,setTemplate]=useState('Windows Baseline');
 const makeRows=name=>(assessmentTemplates[name]||[]).map((id,i)=>({id:`${name}-${i}`,commandId:id,status:'Not tested',expected:'',notes:''}));
 const [rows,setRows]=useState(()=>{try{return JSON.parse(localStorage.getItem('security-studio-assessment')||'null')||makeRows('Windows Baseline')}catch{return makeRows('Windows Baseline')}});
 useEffect(()=>localStorage.setItem('security-studio-assessment',JSON.stringify(rows)),[rows]);
 const load=()=>setRows(makeRows(template));
 const update=(id,patch)=>setRows(rows.map(r=>r.id===id?{...r,...patch}:r));
 const exportMd=()=>{
  const body=[`# ${template}`,'',...rows.flatMap((r,i)=>{const c=commands.find(x=>x.id===r.commandId);return [`## ${i+1}. ${c?.title||'Command'}`,`- Status: ${r.status}`,`- Command: \`${c?.command||''}\``,`- Expected: ${r.expected||'Not documented'}`,`- Notes: ${r.notes||'Not documented'}`,'']})].join('\n');
  const blob=new Blob([body],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='security-studio-assessment.md';a.click();URL.revokeObjectURL(a.href);
 };
 return <>
  <PageTitle kicker="BUILDERS" title="Assessment Sequences" text="Run reusable ordered review sequences and record expected output, status and notes."/>
  <div className="assessmentToolbar"><select value={template} onChange={e=>setTemplate(e.target.value)}>{Object.keys(assessmentTemplates).map(x=><option key={x}>{x}</option>)}</select><button className="primarySmall" onClick={load}><ListChecks size={15}/> Load sequence</button><button className="secondarySmall" onClick={exportMd}><Download size={15}/> Export Markdown</button></div>
  <div className="assessmentList">{rows.map((r,i)=>{const c=commands.find(x=>x.id===r.commandId);return <div className="assessmentRow" key={r.id}><span className="assessmentNumber">{i+1}</span><div className="assessmentCommand"><b>{c?.title||r.commandId}</b><code>{c?.command||''}</code><button onClick={()=>c&&openCommand(c)}>Open Studio</button></div><select className={`assessmentStatus status-${r.status.toLowerCase().replaceAll(' ','-')}`} value={r.status} onChange={e=>update(r.id,{status:e.target.value})}><option>Not tested</option><option>Pass</option><option>Review</option><option>Fail</option></select><input placeholder="Expected output / condition" value={r.expected} onChange={e=>update(r.id,{expected:e.target.value})}/><input placeholder="Assessment notes" value={r.notes} onChange={e=>update(r.id,{notes:e.target.value})}/></div>})}</div>
 </>
}

function CoverageIntelligence({openCommand}){
 const platforms=[...new Set(commands.map(c=>c.platform))].sort();
 const health={
  strong:commands.filter(c=>commandQuality(c)>=85).length,
  review:commands.filter(c=>commandQuality(c)<85).length,
  mapped:commands.filter(c=>c.attack.length).length,
  telemetry:commands.filter(c=>c.telemetry.length).length,
  notes:commands.filter(c=>c.notes).length
 };
 const platformRows=platforms.map(p=>{const xs=commands.filter(c=>c.platform===p);return {name:p,total:xs.length,mapped:xs.filter(c=>c.attack.length).length,telemetry:xs.filter(c=>c.telemetry.length).length,quality:Math.round(xs.reduce((s,c)=>s+commandQuality(c),0)/Math.max(xs.length,1))}});
 const needsReview=commands.filter(c=>commandQuality(c)<85).sort((a,b)=>commandQuality(a)-commandQuality(b)).slice(0,12);
 return <>
  <PageTitle kicker="DEFENCE" title="Coverage Intelligence" text="See catalogue quality, ATT&CK mapping, telemetry coverage and the areas that need improvement."/>
  <div className="coverageStats"><div><b>{commands.length}</b><span>Total commands</span></div><div><b>{health.strong}</b><span>High quality</span></div><div><b>{health.mapped}</b><span>ATT&CK mapped</span></div><div><b>{health.telemetry}</b><span>Telemetry mapped</span></div><div><b>{health.notes}</b><span>Notes linked</span></div></div>
  <div className="coverageGrid"><Panel title="Platform coverage"><div className="coverageRows">{platformRows.map(r=><div key={r.name}><div className="coverageLabel"><b>{r.name}</b><span>{r.total} commands · {r.quality}% quality</span></div><div className="coverageBars"><span style={{width:`${r.total?Math.round(r.mapped/r.total*100):0}%`}}/><i style={{width:`${r.total?Math.round(r.telemetry/r.total*100):0}%`}}/></div><small>ATT&CK {r.mapped}/{r.total} · Telemetry {r.telemetry}/{r.total}</small></div>)}</div></Panel><Panel title="Needs improvement"><div className="qualityList">{needsReview.map(c=><button key={c.id} onClick={()=>openCommand(c)}><div><b>{c.title}</b><span>{c.platform} · {c.tool}</span></div><strong>{commandQuality(c)}%</strong></button>)}</div></Panel></div>
 </>
}

const runtimeGroups=[
 ['PowerShell','PowerShell'],['Bash','Bash'],['Python','Python'],['Java','Java'],['PHP','PHP'],
 ['Node.js','Node.js'],['JavaScript','JavaScript'],['Go','Go'],['.NET','.NET']
];


function AppearanceStudio({appearance,setAppearance,theme,setTheme}){
 const a={accent:'cyan',background:'solid',density:'comfortable',sidebar:202,reduceMotion:false,...appearance};
 const update=patch=>setAppearance({...a,...patch});
 const reset=()=>{setTheme('dark');setAppearance({accent:'cyan',background:'solid',density:'comfortable',sidebar:202,reduceMotion:false});studioToast('Appearance reset')};
 return <>
  <PageTitle kicker="SETTINGS" title="Appearance Studio" text="Personalise Security Studio locally without changing the underlying security content."/>
  <div className="appearanceLayout">
   <Panel title="Mode"><div className="appearanceChoices two"><button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}><Moon/>Dark<span>Low-light workspace</span></button><button className={theme==='light'?'active':''} onClick={()=>setTheme('light')}><Sun/>Light<span>Bright documentation view</span></button></div></Panel>
   <Panel title="Accent"><div className="accentChoices">{['cyan','purple','green','amber'].map(x=><button className={`${x} ${a.accent===x?'active':''}`} key={x} onClick={()=>update({accent:x})}><i/>{x}</button>)}</div></Panel>
   <Panel title="Background"><div className="appearanceChoices"><button className={a.background==='solid'?'active':''} onClick={()=>update({background:'solid'})}>Solid</button><button className={a.background==='grid'?'active':''} onClick={()=>update({background:'grid'})}>Grid</button><button className={a.background==='dots'?'active':''} onClick={()=>update({background:'dots'})}>Dots</button><button className={a.background==='scanlines'?'active':''} onClick={()=>update({background:'scanlines'})}>Scanlines</button></div></Panel>
   <Panel title="Density"><div className="appearanceChoices"><button className={a.density==='compact'?'active':''} onClick={()=>update({density:'compact'})}>Compact</button><button className={a.density==='comfortable'?'active':''} onClick={()=>update({density:'comfortable'})}>Comfortable</button><button className={a.density==='spacious'?'active':''} onClick={()=>update({density:'spacious'})}>Spacious</button></div></Panel>
   <Panel title="Workspace"><label className="rangeField">Sidebar width <span>{a.sidebar}px</span><input type="range" min="180" max="280" step="4" value={a.sidebar} onChange={e=>update({sidebar:Number(e.target.value)})}/></label><label className="settingToggle"><input type="checkbox" checked={a.reduceMotion} onChange={e=>update({reduceMotion:e.target.checked})}/><span>Reduce motion</span></label></Panel>
  </div>
  <div className="appearanceFooter"><span>Preferences stay in this browser.</span><button className="secondarySmall" onClick={reset}><RotateCcw size={14}/> Reset appearance</button></div>
 </>
}

function CopyHistory(){
 const read=()=>{try{return JSON.parse(localStorage.getItem('security-studio-copy-history')||'[]')}catch{return []}};
 const [items,setItems]=useState(read);
 useEffect(()=>{const h=()=>setItems(read());addEventListener('studio-copy-history',h);return()=>removeEventListener('studio-copy-history',h)},[]);
 const clear=()=>{localStorage.removeItem('security-studio-copy-history');setItems([]);studioToast('Copy history cleared')};
 const remove=id=>{const next=items.filter(x=>x.id!==id);setItems(next);localStorage.setItem('security-studio-copy-history',JSON.stringify(next))};
 return <>
  <PageTitle kicker="WORKSPACE" title="Copy History" text="Review the most recent commands copied from Security Studio. History stays local to this browser."/>
  <div className="historyToolbar"><span>{items.length}/20 entries</span><button className="secondarySmall dangerOutline" disabled={!items.length} onClick={clear}><Trash2 size={14}/> Clear history</button></div>
  <div className="historyList">{items.length?items.map(x=><article key={x.id}><div><span>{new Date(x.copiedAt).toLocaleString()}</span><h3>{x.title}</h3><code>{x.text}</code></div><div><button onClick={()=>studioCopy(x.text,x.title)}><Copy size={14}/> Copy again</button><button className="historyDelete" onClick={()=>remove(x.id)} title="Remove entry"><X size={14}/></button></div></article>):<div className="empty">Copy a command from the Library, Studio, Runtime Library or Visualiser and it will appear here.</div>}</div>
 </>
}

function QuickNotes({activeProfile}){
 const key=`security-studio-quick-notes:${activeProfile}`;
 const [value,setValue]=useState(()=>localStorage.getItem(key)||'');
 const [saved,setSaved]=useState(localStorage.getItem(`${key}:saved`)||'');
 useEffect(()=>{setValue(localStorage.getItem(key)||'');setSaved(localStorage.getItem(`${key}:saved`)||'')},[key]);
 const save=()=>{localStorage.setItem(key,value);const t=new Date().toISOString();localStorage.setItem(`${key}:saved`,t);setSaved(t);studioToast('Quick notes saved')};
 const exportMd=()=>{
  const body=`# ${activeProfile} - Quick Notes\n\n${value}\n`;
  const blob=new Blob([body],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${safeFilename(activeProfile.toLowerCase())}-quick-notes.md`;a.click();URL.revokeObjectURL(a.href);
 };
 return <>
  <PageTitle kicker="WORKSPACE" title="Quick Notes" text={`Local plain-text notes for the ${activeProfile} context profile.`}/>
  <div className="quickNotesShell">
   <div className="quickNotesHead"><div><Braces size={15}/><b>{activeProfile}</b><span>Local context</span></div><div><button className="secondarySmall" onClick={exportMd}><Download size={14}/> Markdown</button><button className="primarySmall" onClick={save}><Save size={14}/> Save notes</button></div></div>
   <textarea value={value} onChange={e=>setValue(e.target.value)} placeholder={"Observations...\nFollow-up checks...\nQuestions for the team...\nEvidence references..."} spellCheck="false"/>
   <div className="quickNotesFoot"><span>{value.length.toLocaleString()} characters</span><span>{saved?`Last saved ${new Date(saved).toLocaleString()}`:'Not saved yet'}</span></div>
  </div>
 </>
}

function EngagementTimer({activeProfile}){
 const storageKey=`security-studio-timer:${activeProfile}`;
 const initial=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
 const saved=initial();
 const [seconds,setSeconds]=useState(Number(saved.seconds)||0);
 const [running,setRunning]=useState(false);
 useEffect(()=>{setSeconds(Number(initial().seconds)||0);setRunning(false)},[storageKey]);
 useEffect(()=>{
  if(!running)return;
  const id=setInterval(()=>setSeconds(s=>s+1),1000);
  return()=>clearInterval(id);
 },[running]);
 useEffect(()=>localStorage.setItem(storageKey,JSON.stringify({seconds})),[seconds,storageKey]);
 const format=s=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
 const reset=()=>{setRunning(false);setSeconds(0);studioToast('Timer reset')};
 return <>
  <PageTitle kicker="WORKSPACE" title="Engagement Timer" text="A local session timer associated with the active context profile. Nothing is sent to a backend."/>
  <div className="timerCard">
   <span className="eyebrow">{activeProfile.toUpperCase()}</span>
   <div className="timerValue">{format(seconds)}</div>
   <div className="timerActions"><button className="primarySmall" onClick={()=>setRunning(true)} disabled={running}><Play size={16}/> Start</button><button className="secondarySmall" onClick={()=>setRunning(false)} disabled={!running}><Pause size={16}/> Pause</button><button className="secondarySmall" onClick={reset}><RotateCcw size={16}/> Reset</button></div>
   <div className="timerPrivacy"><ShieldCheck size={16}/><span>Timer state is stored only in your browser.</span></div>
  </div>
 </>
}

function CustomCommands(){
 const read=()=>{try{return JSON.parse(localStorage.getItem('security-studio-custom-commands')||'[]')}catch{return []}};
 const [items,setItems]=useState(read);
 const blank={title:'',platform:'Tools',tool:'Custom',category:'Reference',command:'',description:'',tags:'',notes:''};
 const [form,setForm]=useState(blank);
 const persist=next=>{setItems(next);localStorage.setItem('security-studio-custom-commands',JSON.stringify(next))};
 const add=()=>{
  if(!form.title.trim()||!form.command.trim()){studioToast('Title and command are required');return}
  const notes=form.notes.trim()?safeExternalUrl(form.notes.trim()):'';
  if(form.notes.trim()&&!notes){studioToast('Notes URL must use HTTP or HTTPS');return}
  const item={...form,notes,id:`custom-${Date.now()}`,tags:form.tags.split(',').map(x=>x.trim()).filter(Boolean),createdAt:new Date().toISOString()};
  persist([item,...items]);setForm(blank);studioToast('Custom command saved locally');
 };
 const remove=id=>persist(items.filter(x=>x.id!==id));
 return <>
  <PageTitle kicker="COMMANDS" title="Custom Commands" text="Create local reference commands for your own workflow. Security Studio stores them as text and never executes them."/>
  <div className="customCommandLayout">
   <div className="panel customCommandForm"><h3>New local command</h3><div className="customFields"><label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="My reference command"/></label><label>Platform<select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}><option>Windows</option><option>Linux</option><option>Web</option><option>Network</option><option>Tools</option></select></label><label>Tool<input value={form.tool} onChange={e=>setForm({...form,tool:e.target.value})} placeholder="PowerShell"/></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Reference"/></label><label className="full">Command<textarea value={form.command} onChange={e=>setForm({...form,command:e.target.value})} placeholder="Command text only"/></label><label className="full">Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label className="full">Tags<input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="tag1, tag2"/></label><label className="full">Notes URL<input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="https://notes.asifnawazminhas.com/..."/></label></div><button className="primarySmall" onClick={add}><Save size={15}/> Save locally</button><div className="localOnly"><ShieldCheck size={16}/><div><b>Reference only</b><span>Custom commands are never executed by the browser and are not uploaded anywhere.</span></div></div></div>
   <div className="customCommandList">{items.length?items.map(x=><article key={x.id}><div className="badges"><span>{x.platform}</span><span>{x.tool}</span><small>{x.category}</small></div><h3>{x.title}</h3>{x.description&&<p>{x.description}</p>}<code>{x.command}</code><div className="tags">{x.tags.map(t=><small key={t}>{t}</small>)}</div><div className="cardActions"><button onClick={()=>studioCopy(x.command,x.title)}><Copy size={14}/> Copy</button>{x.notes&&<a href={x.notes} target="_blank" rel="noopener noreferrer"><BookOpen size={14}/> Notes</a>}<button className="dangerAction" onClick={()=>remove(x.id)}><Trash2 size={14}/> Delete</button></div></article>):<div className="empty">No custom commands yet.</div>}</div>
  </div>
 </>
}


function Diagnostics(){
 const [result,setResult]=useState(null);
 const check=()=>{
  const notesSafe=commands.every(c=>{try{const u=new URL(c.notes);return u.protocol==='https:'&&u.hostname==='notes.asifnawazminhas.com'}catch{return false}});
  const ids=commands.map(c=>c.id);
  const unique=new Set(ids).size===ids.length;
  const storageOk=(()=>{try{localStorage.setItem('security-studio-diagnostic-test','1');localStorage.removeItem('security-studio-diagnostic-test');return true}catch{return false}})();
  const clipboard=!!navigator.clipboard;
  const serviceWorker='serviceWorker' in navigator;
  setResult({notesSafe,unique,storageOk,clipboard,serviceWorker});
 };
 const reset=()=>{
  if(!confirm('Reset all Security Studio local data in this browser? This cannot be undone.'))return;
  clearStudioData();
  location.reload();
 };
 const rows=result?[
  ['Catalogue IDs',result.unique],
  ['Security Notes URLs',result.notesSafe],
  ['Browser localStorage',result.storageOk],
  ['Clipboard API',result.clipboard],
  ['Service Worker support',result.serviceWorker]
 ]:[];
 return <>
  <PageTitle kicker="SETTINGS" title="Diagnostics & Recovery" text="Run local health checks and recover the Studio if browser data becomes corrupted."/>
  <div className="diagnosticGrid">
   <Panel title="Application health">
    <div className="diagnosticMeta"><span>Studio version</span><b>v2.6</b><span>Storage schema</span><b>v{STORAGE_VERSION}</b><span>Last migration</span><b>{storageMigration.migrated?`v${storageMigration.from} → v${storageMigration.to}`:'Current'}</b></div>
    <button className="primarySmall" onClick={check}><ShieldCheck size={15}/> Run health checks</button>
    {result&&<div className="diagnosticResults">{rows.map(([label,ok])=><div key={label}><span>{label}</span><b className={ok?'ok':'warn'}>{ok?'Pass':'Review'}</b></div>)}</div>}
   </Panel>
   <Panel title="Recovery">
    <p>If local browser data becomes malformed or an old workspace causes a problem, reset only Security Studio data. This does not affect other websites.</p>
    <button className="secondarySmall dangerOutline" onClick={reset}><Trash2 size={15}/> Reset local Studio data</button>
   </Panel>
   <Panel title="Privacy posture">
    <div className="privacyChecklist"><span><Check/> No backend account required</span><span><Check/> No file uploads</span><span><Check/> Context stored locally</span><span><Check/> Quick Notes stored locally</span><span><Check/> Custom commands are text-only</span></div>
   </Panel>
  </div>
 </>
}

function RuntimeLibrary({openCommand}){
 const [runtime,setRuntime]=useState('PowerShell');
 const rows=commands.filter(c=>c.tool===runtime || (runtime==='JavaScript'&&c.tags.includes('JavaScript')));
 return <>
  <PageTitle kicker="COMMANDS" title="Runtime Library" text="Common runtime, language and package-management references integrated with Security Studio."/>
  <div className="runtimeTabs">{runtimeGroups.map(([label,key])=><button className={runtime===key?'active':''} key={key} onClick={()=>setRuntime(key)}><Code2 size={15}/>{label}<span>{commands.filter(c=>c.tool===key || (key==='JavaScript'&&c.tags.includes('JavaScript'))).length}</span></button>)}</div>
  <div className="runtimeGrid">{rows.map(c=><article key={c.id} className="runtimeCard"><div className="runtimeCardTop"><span>{c.category}</span><small>{c.risk}</small></div><h3>{c.title}</h3><p>{c.description}</p><code>{c.command}</code><div className="runtimeCardActions"><button onClick={()=>studioCopy(c.command,c.title)}><Copy size={14}/> Copy</button><a href={c.notes} target="_blank" rel="noopener noreferrer"><BookOpen size={14}/> Notes</a><button className="openBtn" onClick={()=>openCommand(c)}>Open <ChevronRight size={14}/></button></div></article>)}</div>
 </>
}

function KnowledgeGraph({openCommand}){
 const [platformFilter,setPlatformFilter]=useState('All');
 const [toolFilter,setToolFilter]=useState('All');
 const filtered=commands.filter(c=>(platformFilter==='All'||c.platform===platformFilter)&&(toolFilter==='All'||c.tool===toolFilter));
 const [commandId,setCommandId]=useState(commands[0]?.id||'');
 const c=(filtered.find(x=>x.id===commandId)||filtered[0]||commands[0]);
 const related=relatedCommandsFor(c,5);
 return <>
  <PageTitle kicker="EXPLORERS" title="Knowledge Graph" text="Explore how a command connects to tools, ATT&CK, telemetry, related commands and Security Notes."/>
  <div className="graphToolbar graphFilters"><label>Platform<select value={platformFilter} onChange={e=>{setPlatformFilter(e.target.value);setCommandId('')}}><option>All</option>{[...new Set(commands.map(c=>c.platform))].sort().map(x=><option key={x}>{x}</option>)}</select></label><label>Tool<select value={toolFilter} onChange={e=>{setToolFilter(e.target.value);setCommandId('')}}><option>All</option>{[...new Set(commands.map(c=>c.tool))].sort().map(x=><option key={x}>{x}</option>)}</select></label><label>Start from command<select value={c.id} onChange={e=>setCommandId(e.target.value)}>{filtered.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label></div>
  <div className="knowledgeGraph">
   <div className="graphCenter"><TerminalSquare/><span>COMMAND</span><b>{c.title}</b><code>{c.command}</code><button onClick={()=>openCommand(c)}>Open in Studio <ChevronRight size={14}/></button></div>
   <div className="graphColumn left">
    <div className="graphNode"><Code2/><span>TOOL</span><b>{c.tool}</b><small>{c.platform}</small></div>
    <div className="graphNode"><Tag/><span>CATEGORY</span><b>{c.category}</b><small>{c.tags.slice(0,3).join(' · ')}</small></div>
   </div>
   <div className="graphColumn right">
    <div className="graphNode"><Network/><span>ATT&CK</span><b>{c.attack.length?c.attack.join(', '):'Not mapped'}</b><small>Technique context</small></div>
    <div className="graphNode"><RadioTower/><span>TELEMETRY</span><b>{c.telemetry.length} sources</b><small>{c.telemetry.slice(0,2).join(' · ')}</small></div>
   </div>
  </div>
  <div className="graphBottom">
   <Panel title="Related commands"><div className="relationshipList">{related.map(x=><button key={x.id} onClick={()=>openCommand(x)}><span>Related</span><div><b>{x.title}</b><small>{x.tool} · {x.category}</small></div><ChevronRight/></button>)}</div></Panel>
   <Panel title="Knowledge source"><p>{c.description}</p><a className="textlink" href={c.notes} target="_blank" rel="noopener noreferrer">Open Security Notes <ExternalLink size={14}/></a></Panel>
  </div>
 </>
}

function ContextProfiles({context,setContext,active,setActive}){
 const defaults={
  'Default':{},
  'Lab':{TARGET:'',DOMAIN:'',USERNAME:'',INTERFACE:'',PORT:'',PATH:''},
  'Internal Assessment':{TARGET:'',DOMAIN:'',USERNAME:'',INTERFACE:'',PORT:'',PATH:''},
  'AD Lab':{TARGET:'',DOMAIN:'',USERNAME:'',INTERFACE:'',PORT:'',PATH:''},
  'Web Test':{TARGET:'',DOMAIN:'',USERNAME:'',INTERFACE:'',PORT:'443',PATH:'/'}
 };
 const [profiles,setProfiles]=useState(()=>{
  try{return JSON.parse(localStorage.getItem('security-studio-context-profiles')||JSON.stringify(defaults))}catch{return defaults}
 });
 useEffect(()=>localStorage.setItem('security-studio-context-profiles',JSON.stringify(profiles)),[profiles]);

 const activate=name=>{
  setActive(name);
  const next=profiles[name]||{};
  setContext(next);
  localStorage.setItem('security-studio-context',JSON.stringify(next));
  studioToast(`${name} context activated`);
 };
 const update=(k,v)=>{
  const next={...context,[k]:v};
  setContext(next);
  setProfiles({...profiles,[active]:next});
 };
 const duplicate=()=>{
  const name=prompt('New context profile name');
  if(!name?.trim())return;
  const clean=name.trim();
  setProfiles({...profiles,[clean]:{...context}});
  setActive(clean);
  studioToast('Context profile created');
 };
 const clear=()=>{
  const next={};
  setContext(next);setProfiles({...profiles,[active]:next});
 };

 return <>
  <PageTitle kicker="WORKSPACE" title="Context Profiles" text="Store reusable target context locally in your browser and reuse it when commands contain placeholders."/>
  <div className="contextProfileLayout">
   <div className="profileRail"><span className="eyebrow">PROFILES</span>{Object.keys(profiles).map(name=><button className={name===active?'active':''} key={name} onClick={()=>activate(name)}><Braces size={15}/><div><b>{name}</b><small>{Object.values(profiles[name]||{}).filter(Boolean).length} values</small></div></button>)}<button className="newProfile" onClick={duplicate}><Plus size={15}/> New profile</button></div>
   <div className="profileEditor panel"><div className="panelTitleActions"><h3>{active}</h3><button className="secondarySmall dangerOutline compact" onClick={clear}><Trash2 size={14}/> Clear values</button></div><div className="profileFields">{['TARGET','DOMAIN','USERNAME','INTERFACE','PORT','PATH'].map(k=><label key={k}>{k}<input value={context[k]||''} onChange={e=>update(k,e.target.value)} placeholder={k==='TARGET'?'10.10.10.10 or host':k.toLowerCase()}/></label>)}</div><div className="localOnly"><ShieldCheck size={16}/><div><b>Local only</b><span>Context values are stored in browser localStorage. Security Studio does not send them to a backend.</span></div></div></div>
  </div>
 </>
}

function ShortcutHelp({close}){
 const rows=[['Ctrl + K','Open command search'],['/','Open command search'],['↑ / ↓','Navigate search results'],['Enter','Open highlighted result'],['Alt + C','Copy highlighted command'],['?','Open this shortcut guide'],['Esc','Close overlays']];
 return <div className="paletteback" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="shortcutModal"><div className="shortcutHead"><div><span className="eyebrow">KEYBOARD</span><h2>Shortcuts</h2></div><button onClick={close}><X/></button></div>{rows.map(([a,b])=><div className="shortcutRow" key={a}><kbd>{a}</kbd><span>{b}</span></div>)}</div></div>
}

const builtInPacks=[
 {
  id:'windows-baseline',name:'Windows Baseline',platform:'Windows',
  description:'Read-only Windows system, identity, network and control baseline.',
  commandIds:['windows-identity','windows-groups','windows-privileges','windows-computer-info','windows-processes','windows-services','windows-ip-config','windows-firewall-profiles','windows-defender-status','applocker-effective']
 },
 {
  id:'linux-baseline',name:'Linux Baseline',platform:'Linux',
  description:'Read-only Linux identity, system, process, network and filesystem baseline.',
  commandIds:['linux-identity','linux-system','linux-kernel','linux-cpu','linux-memory','linux-processes','linux-services','linux-ip','linux-routes','linux-listeners','linux-mounts']
 },
 {
  id:'network-discovery',name:'Network Discovery',platform:'Network',
  description:'Authorised host, port, DNS and TLS inspection references.',
  commandIds:['network-ping','network-traceroute','dns-dig','network-dig-a','network-dig-mx','nmap-ping','nmap-selected-ports','nmap-service','network-tls-inspect']
 },
 {
  id:'web-assessment',name:'Web Assessment',platform:'Web',
  description:'HTTP metadata, redirects, security headers and basic technology context.',
  commandIds:['curl-head','curl-verbose','curl-follow','curl-timing','web-security-headers','web-cors-origin','web-robots','httpx-basic']
 },
 {
  id:'ad-context',name:'Active Directory Context',platform:'Active Directory',
  description:'Current identity, domain, forest, Kerberos and DNS context.',
  commandIds:['ad-user','ad-whoami-upn','ad-domain','ad-domain-info','ad-forest-info','ad-domain-controller','ad-klist','ad-dns-srv']
 },
 {
  id:'packet-analysis',name:'Packet Analysis',platform:'Network',
  description:'Capture-interface discovery and PCAP review with tcpdump and tshark.',
  commandIds:['tshark-interfaces','tshark-read-file','tshark-http','tshark-dns','tshark-fields','tcpdump-interface','tcpdump-read']
 },
 {
  id:'repo-review',name:'Repository Review',platform:'Tools',
  description:'Safe Git and ripgrep references for repository inspection.',
  commandIds:['git-status','git-status-short','git-current-branch','git-remotes','git-log','git-show','git-diff-stat','git-diff-name','rg-files','rg-ignore-case','rg-filetype']
 }
];

function CommandPacks({openCommand}){
 const [selectedPack,setSelectedPack]=useState(builtInPacks[0].id);
 const [customName,setCustomName]=useState('My Command Pack');
 const [customSearch,setCustomSearch]=useState('');
 const [selectedIds,setSelectedIds]=useState([]);
 const [customPacks,setCustomPacks]=useState(()=>{
  try{return JSON.parse(localStorage.getItem('security-studio-custom-packs')||'[]')}catch{return []}
 });
 useEffect(()=>localStorage.setItem('security-studio-custom-packs',JSON.stringify(customPacks)),[customPacks]);

 const allPacks=[...builtInPacks,...customPacks];
 const active=allPacks.find(p=>p.id===selectedPack)||allPacks[0];
 const activeCommands=active.commandIds.map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 const matches=commands.filter(c=>`${c.title} ${c.platform} ${c.tool} ${c.category}`.toLowerCase().includes(customSearch.toLowerCase())).slice(0,24);

 const addPackToWorkflow=()=>{
  const steps=activeCommands.map((c,i)=>({
   id:Date.now()+i,title:c.title,kind:'Validation',commandId:c.id,notes:c.notes,yesLabel:'Yes',noLabel:'No'
  }));
  localStorage.setItem('security-studio-workflow',JSON.stringify(steps));
  studioToast(`${active.name} added to Workflow Builder`);
 };

 const exportPack=()=>{
  const blob=new Blob([JSON.stringify(active,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${active.id}.json`;a.click();URL.revokeObjectURL(a.href);
  studioToast('Command pack exported');
 };

 const saveCustom=()=>{
  if(!customName.trim()||!selectedIds.length)return;
  const pack={id:`custom-${Date.now()}`,name:customName.trim(),platform:'Custom',description:'Custom Security Studio command pack.',commandIds:selectedIds};
  setCustomPacks([...customPacks,pack]);setSelectedPack(pack.id);setSelectedIds([]);studioToast('Custom command pack saved');
 };

 return <>
  <PageTitle kicker="COMMANDS" title="Command Packs" text="Open reusable command collections, add them to workflows, or build your own pack."/>

  <div className="packsLayout">
   <div className="packSidebar">
    <span className="eyebrow">BUILT-IN PACKS</span>
    {builtInPacks.map(p=><button className={selectedPack===p.id?'active':''} onClick={()=>setSelectedPack(p.id)} key={p.id}><Package size={16}/><div><b>{p.name}</b><span>{p.commandIds.length} commands</span></div></button>)}
    {customPacks.length>0&&<>
     <span className="eyebrow customLabel">CUSTOM PACKS</span>
     {customPacks.map(p=><button className={selectedPack===p.id?'active':''} onClick={()=>setSelectedPack(p.id)} key={p.id}><Star size={16}/><div><b>{p.name}</b><span>{p.commandIds.length} commands</span></div></button>)}
    </>}
   </div>

   <div className="packMain">
    <div className="packHero">
     <div><span className="eyebrow">{active.platform.toUpperCase()}</span><h2>{active.name}</h2><p>{active.description}</p></div>
     <div className="packActions">
      <button className="primarySmall" onClick={addPackToWorkflow}><Workflow size={15}/> Add to workflow</button>
      <button className="secondarySmall" onClick={exportPack}><Download size={15}/> Export pack</button>
      {active.id.startsWith('custom-')&&<button className="secondarySmall dangerOutline" onClick={()=>{setCustomPacks(customPacks.filter(p=>p.id!==active.id));setSelectedPack(builtInPacks[0].id)}}><Trash2 size={15}/> Delete pack</button>}
     </div>
    </div>
    <div className="packCommandList">
     {activeCommands.map((c,i)=><button key={c.id} onClick={()=>openCommand(c)}><span>{i+1}</span><div><b>{c.title}</b><small>{c.platform} · {c.tool} · {c.category}</small><code>{c.command}</code></div><ChevronRight/></button>)}
    </div>
   </div>
  </div>

  <section className="customPackBuilder">
   <div className="sectionhead"><div><span className="eyebrow">CUSTOM PACK</span><h2>Build your own command pack</h2></div></div>
   <div className="customPackTop">
    <input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Pack name"/>
    <div className="librarysearch"><Search size={16}/><input value={customSearch} onChange={e=>setCustomSearch(e.target.value)} placeholder="Search catalogue..."/></div>
    <button className="primarySmall" disabled={!selectedIds.length} onClick={saveCustom}><Save size={15}/> Save pack ({selectedIds.length})</button>
   </div>
   <div className="packPicker">{matches.map(c=><label key={c.id} className={selectedIds.includes(c.id)?'selected':''}><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={()=>setSelectedIds(ids=>ids.includes(c.id)?ids.filter(x=>x!==c.id):[...ids,c.id])}/><div><b>{c.title}</b><span>{c.platform} · {c.tool}</span></div></label>)}</div>
  </section>
 </>
}

function ReportBuilder(){
 const [author,setAuthor]=useState(localStorage.getItem('security-studio-report-author')||'');
 const [scope,setScope]=useState(localStorage.getItem('security-studio-report-scope')||'');
 const [executive,setExecutive]=useState(localStorage.getItem('security-studio-report-executive')||'');
 const [recommendations,setRecommendations]=useState(localStorage.getItem('security-studio-report-recommendations')||'');
 const purpleMap=(()=>{try{return JSON.parse(localStorage.getItem('security-studio-purple-map')||'[]')}catch{return []}})();
 const purpleStatus=(()=>{try{return JSON.parse(localStorage.getItem('security-studio-purple-status')||'{}')}catch{return {}}})();
 const technique=localStorage.getItem('security-studio-purple-technique')||'';
 const commandId=localStorage.getItem('security-studio-purple-command')||'';
 const exerciseName=localStorage.getItem('security-studio-purple-name')||'Purple Team Validation';
 const selectedCommand=commands.find(c=>c.id===commandId);

 useEffect(()=>localStorage.setItem('security-studio-report-author',author),[author]);
 useEffect(()=>localStorage.setItem('security-studio-report-scope',scope),[scope]);
 useEffect(()=>localStorage.setItem('security-studio-report-executive',executive),[executive]);
 useEffect(()=>localStorage.setItem('security-studio-report-recommendations',recommendations),[recommendations]);

 const reportData=()=>({
  title:exerciseName,author,scope,executiveSummary:executive,recommendations,
  technique,
  command:selectedCommand?{title:selectedCommand.title,command:selectedCommand.command,notes:selectedCommand.notes}:null,
  statuses:purpleStatus,
  mapping:purpleMap,
  generatedAt:new Date().toISOString()
 });

 const markdown=()=>{
  const r=reportData();
  return [
   `# ${r.title}`,'',
   author?`**Author:** ${author}`:'',
   scope?`**Scope:** ${scope}`:'',
   `**ATT&CK technique:** ${r.technique||'Not selected'}`,
   `**Validation command:** ${r.command?.title||'Not selected'}`,'',
   '## Executive Summary','',r.executiveSummary||'_Not provided_','',
   '## Validation Status','',
   `- Telemetry: ${r.statuses.telemetry||'Not tested'}`,
   `- Detection: ${r.statuses.detection||'Not tested'}`,
   `- Response: ${r.statuses.response||'Not tested'}`,
   `- Overall: ${r.statuses.overall||'Not tested'}`,'',
   '## Technical Mapping','',
   ...(r.mapping.length?r.mapping.flatMap(x=>[`### ${x.id}. ${x.title}`,x.value||'_Not documented_','']):['_No Purple Team mapping data available._','']),
   '## Recommendations','',r.recommendations||'_Not provided_',''
  ].filter(x=>x!==undefined).join('\n');
 };

 const html=()=>{
  const r=reportData();
  const mapping=(r.mapping||[]).map(x=>`<section><h3>${x.id}. ${x.title}</h3><p>${escapeHtml(x.value||'Not documented')}</p></section>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(r.title)}</title><style>body{font:16px system-ui;max-width:980px;margin:48px auto;padding:0 24px;color:#17212b}h1,h2{color:#0a5060}code{background:#eef3f5;padding:3px 6px;border-radius:4px}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;background:#f4f8f9;padding:16px;border-radius:8px}.status{display:flex;gap:10px;flex-wrap:wrap}.status span{border:1px solid #ccd9df;padding:8px 12px;border-radius:6px}section{border-top:1px solid #dde6ea;padding:14px 0}</style></head><body><h1>${escapeHtml(r.title)}</h1><div class="meta"><div><b>Author</b><br>${escapeHtml(r.author||'Not provided')}</div><div><b>Scope</b><br>${escapeHtml(r.scope||'Not provided')}</div><div><b>ATT&CK</b><br>${escapeHtml(r.technique||'Not selected')}</div><div><b>Command</b><br>${escapeHtml(r.command?.title||'Not selected')}</div></div><h2>Executive Summary</h2><p>${escapeHtml(r.executiveSummary||'Not provided')}</p><h2>Validation Status</h2><div class="status"><span>Telemetry: ${escapeHtml(r.statuses.telemetry||'Not tested')}</span><span>Detection: ${escapeHtml(r.statuses.detection||'Not tested')}</span><span>Response: ${escapeHtml(r.statuses.response||'Not tested')}</span><span>Overall: ${escapeHtml(r.statuses.overall||'Not tested')}</span></div><h2>Technical Mapping</h2>${mapping||'<p>No Purple Team mapping data available.</p>'}<h2>Recommendations</h2><p>${escapeHtml(r.recommendations||'Not provided')}</p></body></html>`;
 };

 const download=(content,type,name)=>{
  const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);studioToast(`${name} exported`);
 };

 return <>
  <PageTitle kicker="WORKSPACE" title="Report Builder" text="Turn Purple Team validation data into a clean executive and technical report."/>

  <div className="reportGrid">
   <div className="reportForm panel">
    <h3>Report details</h3>
    <label>Author<input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Name or team"/></label>
    <label>Scope<input value={scope} onChange={e=>setScope(e.target.value)} placeholder="Assessment scope"/></label>
    <label>Executive summary<textarea value={executive} onChange={e=>setExecutive(e.target.value)} placeholder="Summarise what was validated, what was observed and the overall result."/></label>
    <label>Recommendations<textarea value={recommendations} onChange={e=>setRecommendations(e.target.value)} placeholder="Document practical improvements and next actions."/></label>
    <div className="reportActions">
     <button className="primarySmall" onClick={()=>download(markdown(),'text/markdown','security-studio-report.md')}><Download size={15}/> Markdown</button>
     <button className="secondarySmall" onClick={()=>download(html(),'text/html','security-studio-report.html')}><Download size={15}/> HTML</button>
     <button className="secondarySmall" onClick={()=>download(JSON.stringify(reportData(),null,2),'application/json','security-studio-report.json')}><FileJson size={15}/> JSON</button>
    </div>
   </div>

   <div className="reportPreview panel">
    <span className="eyebrow">LIVE PREVIEW</span>
    <h2>{exerciseName}</h2>
    <div className="reportMeta">
     <span>ATT&CK <b>{technique||'Not selected'}</b></span>
     <span>Overall <b>{purpleStatus.overall||'Not tested'}</b></span>
     <span>Detection <b>{purpleStatus.detection||'Not tested'}</b></span>
     <span>Response <b>{purpleStatus.response||'Not tested'}</b></span>
    </div>
    <h3>Executive Summary</h3><p>{executive||'Add an executive summary on the left.'}</p>
    <h3>Validation command</h3>
    {selectedCommand?<code className="reportCode">{selectedCommand.command}</code>:<p>No validation command selected in Purple Team Mapping.</p>}
    <h3>Technical Mapping</h3>
    <div className="reportMapping">{purpleMap.length?purpleMap.map(x=><div key={x.id}><b>{x.id}. {x.title}</b><p>{x.value||'Not documented'}</p></div>):<p>No Purple Team mapping data available.</p>}</div>
   </div>
  </div>
 </>
}

function escapeHtml(value=''){
 return String(value).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function NotesLinkBuilder(){
 const [commandId,setCommandId]=useState(commands[0]?.id||'');
 const c=commands.find(x=>x.id===commandId)||commands[0];
 const studioUrl=`https://studio.asifnawazminhas.com/#/command/${c.id}`;
 const markdown=`[Open in Security Studio](${studioUrl})`;
 const mkdocs=`[Open in Security Studio](${studioUrl}){ target="_blank" rel="noopener noreferrer" }`;
 const related=`## Related Interactive Material\n\n- [Open ${c.title} in Security Studio](${studioUrl}){ target="_blank" rel="noopener noreferrer" }\n- [Security Notes documentation](${c.notes})`;
 const copy=(value,label)=>{navigator.clipboard?.writeText(value);studioToast(`${label} copied`);};

 return <>
  <PageTitle kicker="WORKSPACE" title="Notes Link Builder" text="Generate exact Notes ↔ Studio links for your MkDocs pages."/>

  <div className="notesBuilder panel">
   <label>Command<select value={commandId} onChange={e=>setCommandId(e.target.value)}>{commands.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
   <div className="notesCommandPreview"><b>{c.title}</b><span>{c.platform} · {c.tool} · {c.category}</span><code>{c.command}</code></div>

   <LinkOutput title="Studio URL" value={studioUrl} onCopy={()=>copy(studioUrl,'Studio URL')}/>
   <LinkOutput title="Markdown link" value={markdown} onCopy={()=>copy(markdown,'Markdown link')}/>
   <LinkOutput title="MkDocs external link" value={mkdocs} onCopy={()=>copy(mkdocs,'MkDocs link')}/>
   <LinkOutput title="Related Material block" value={related} multiline onCopy={()=>copy(related,'Related Material block')}/>

   <div className="notesBuilderActions">
    <a className="primarySmall" href={studioUrl}>Open command <ExternalLink size={15}/></a>
    <a className="secondarySmall" href={c.notes} target="_blank" rel="noopener noreferrer">Open Notes page <BookOpen size={15}/></a>
   </div>
  </div>
 </>
}

function LinkOutput({title,value,onCopy,multiline=false}){
 return <div className="linkOutput"><label>{title}</label>{multiline?<textarea readOnly value={value}/>:<input readOnly value={value}/>}<button className="secondarySmall" onClick={onCopy}><Copy size={14}/> Copy</button></div>
}

function ToastHost(){
 const [message,setMessage]=useState('');
 useEffect(()=>{
  let timer;
  const handler=e=>{setMessage(e.detail||'Done');clearTimeout(timer);timer=setTimeout(()=>setMessage(''),2200)};
  addEventListener('studio-toast',handler);
  return()=>{removeEventListener('studio-toast',handler);clearTimeout(timer)};
 },[]);
 return message?<div className="studioToast"><Check size={16}/>{message}</div>:null;
}

function WorkspacePage({favorites,recent,toggleFavorite,openCommand,removeRecent,clearRecent}){
 const saved=favorites.map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 const viewed=recent.map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 const exportWorkspace=()=>{
  const payload={
   name:'Asif Security Studio Workspace',schemaVersion:'2.5',version:'2.5',exportedAt:new Date().toISOString(),
   favorites,recent,
   workflow:JSON.parse(localStorage.getItem('security-studio-workflow')||'[]'),
   assessment:JSON.parse(localStorage.getItem('security-studio-assessment')||'[]'),
   purpleMap:JSON.parse(localStorage.getItem('security-studio-purple-map')||'[]'),
   purpleTechnique:localStorage.getItem('security-studio-purple-technique')||'',
   purpleCommand:localStorage.getItem('security-studio-purple-command')||'',
   purpleStatus:JSON.parse(localStorage.getItem('security-studio-purple-status')||'{}'),
   purpleName:localStorage.getItem('security-studio-purple-name')||'',
   context:JSON.parse(localStorage.getItem('security-studio-context')||'{}'),
   contextProfile:localStorage.getItem('security-studio-context-profile')||'Default',
   quickNotes:Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith('security-studio-quick-notes:')).map(k=>[k,localStorage.getItem(k)])),
   customCommands:JSON.parse(localStorage.getItem('security-studio-custom-commands')||'[]'),
   copyHistory:JSON.parse(localStorage.getItem('security-studio-copy-history')||'[]'),
   appearance:JSON.parse(localStorage.getItem('security-studio-appearance')||'{}')
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='security-studio-workspace.json';a.click();URL.revokeObjectURL(a.href);studioToast('Workspace exported');
 };
 const clearWorkspace=()=>{
  if(!confirm('Clear favourites, recent commands, workflow, assessment, Purple Team data and local context from this browser?'))return;
  ['security-studio-favorites','security-studio-recent','security-studio-workflow','security-studio-assessment','security-studio-purple-map','security-studio-purple-technique','security-studio-purple-command','security-studio-purple-status','security-studio-purple-name','security-studio-context','security-studio-context-profile','security-studio-custom-commands','security-studio-copy-history','security-studio-appearance'].forEach(k=>localStorage.removeItem(k));
  Object.keys(localStorage).filter(k=>k.startsWith('security-studio-quick-notes:')||k.startsWith('security-studio-timer:')).forEach(k=>localStorage.removeItem(k));
  location.reload();
 };
 const savedList=saved.length?<div className="workspaceList">{saved.map(c=><div className="workspaceItem" key={c.id}><div><span>{c.platform} · {c.tool}</span><b>{c.title}</b><code>{c.command}</code></div><div><button onClick={()=>toggleFavorite(c.id)} title="Remove favourite"><Star size={15} fill="currentColor"/></button><a href={c.notes} target="_blank" rel="noopener noreferrer" title="Open Notes"><BookOpen size={15}/></a><button onClick={()=>openCommand(c)}>Open <ChevronRight size={14}/></button></div></div>)}</div>:<div className="empty">No saved commands yet. Use the star button in the Command Library or Command Studio.</div>;
 const recentList=viewed.length?<div className="workspaceList">{viewed.map(c=><div className="workspaceItem" key={c.id}><div><span>{c.platform} · {c.tool}</span><b>{c.title}</b><code>{c.command}</code></div><div><button onClick={()=>toggleFavorite(c.id)} title="Toggle favourite"><Star size={15} fill={favorites.includes(c.id)?'currentColor':'none'}/></button><a href={c.notes} target="_blank" rel="noopener noreferrer" title="Open Notes"><BookOpen size={15}/></a><button onClick={()=>openCommand(c)}>Open <ChevronRight size={14}/></button><button className="recentDelete" onClick={()=>removeRecent(c.id)} title="Remove from recently viewed"><X size={15}/></button></div></div>)}</div>:<div className="empty">Open commands in Studio and they will appear here.</div>;
 return <><PageTitle kicker="WORKSPACE" title="Saved Workspace" text="Keep useful commands close, manage recent history and export your local Studio workspace."/><div className="studioToolbar workspaceToolbar"><div className="toolbarPrimary"><button className="primarySmall" onClick={exportWorkspace}><Download size={15}/> Export workspace</button></div><div className="toolbarSecondary"><span className="exportOnlyNote">Export only - Security Studio never asks you to upload a workspace file.</span><button className="secondarySmall dangerOutline" onClick={clearWorkspace}><Trash2 size={15}/> Clear workspace</button></div></div><div className="workspaceStats"><div><Star/><b>{saved.length}</b><span>Saved commands</span></div><div><Clock3/><b>{viewed.length}</b><span>Recent commands</span></div><div><Library/><b>{commands.length}</b><span>Total catalogue</span></div></div><div className="workspaceColumns"><Panel title="Favourites">{savedList}</Panel><div className="panel"><div className="panelTitleActions"><h3>Recently viewed</h3><button className="secondarySmall dangerOutline compact" disabled={!viewed.length} onClick={clearRecent}><Trash2 size={14}/> Clear recent</button></div>{recentList}</div></div></>;
}

function WorkflowBuilder(){
 const visualRef=useRef(null);
 const templates={
  'Assessment':[
   {title:'Define scope',kind:'Planning',commandId:'',notes:''},
   {title:'Collect baseline',kind:'Validation',commandId:'windows-computer-info',notes:'https://notes.asifnawazminhas.com/windows/'},
   {title:'Review telemetry',kind:'Detection',commandId:'',notes:''},
   {title:'Capture learning',kind:'Learning',commandId:'',notes:''}
  ],
  'Purple validation':[
   {title:'Choose ATT&CK technique',kind:'Planning',commandId:'',notes:''},
   {title:'Execute authorised validation',kind:'Validation',commandId:'nmap-service',notes:'https://notes.asifnawazminhas.com/purple-teaming/'},
   {title:'Was expected telemetry observed?',kind:'Decision',commandId:'',notes:''},
   {title:'Review detection result',kind:'Detection',commandId:'',notes:''},
   {title:'Document learning outcome',kind:'Learning',commandId:'',notes:''}
  ],
  'Web review':[
   {title:'Inspect response headers',kind:'Validation',commandId:'curl-head',notes:'https://notes.asifnawazminhas.com/web/'},
   {title:'Inspect redirects',kind:'Validation',commandId:'curl-follow',notes:'https://notes.asifnawazminhas.com/web/'},
   {title:'Review security headers',kind:'Detection',commandId:'web-security-headers',notes:'https://notes.asifnawazminhas.com/web/'},
   {title:'Capture observations',kind:'Learning',commandId:'',notes:''}
  ]
 };
 const createNodes=rows=>rows.map((x,i)=>({id:Date.now()+i,...x,yesLabel:x.yesLabel||'Yes',noLabel:x.noLabel||'No'}));
 const defaultNodes=createNodes(templates['Assessment']);

 const [nodes,setNodes]=useState(()=>{
   try{
    const saved=localStorage.getItem('security-studio-workflow');
    return saved?JSON.parse(saved):defaultNodes;
   }catch{return defaultNodes}
 });
 const [template,setTemplate]=useState('Assessment');
 const [dragIndex,setDragIndex]=useState(null);
 useEffect(()=>localStorage.setItem('security-studio-workflow',JSON.stringify(nodes)),[nodes]);

 const update=(id,patch)=>setNodes(nodes.map(n=>n.id===id?{...n,...patch}:n));
 const add=(kind='Validation')=>setNodes([...nodes,{id:Date.now(),title:kind==='Decision'?'Decision point':'New step',kind,commandId:'',notes:'',yesLabel:'Yes',noLabel:'No'}]);
 const loadTemplate=()=>setNodes(createNodes(templates[template]));
 const move=(from,to)=>{
   if(from===to||from<0||to<0||from>=nodes.length||to>=nodes.length)return;
   const next=[...nodes];
   const [item]=next.splice(from,1);
   next.splice(to,0,item);
   setNodes(next);
 };
 const reset=()=>setNodes(createNodes(templates['Assessment']));

 const exportJson=()=>{
   const blob=new Blob([JSON.stringify({name:'Security Studio Workflow',schemaVersion:'2.5',version:'2.5',steps:nodes},null,2)],{type:'application/json'});
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='security-studio-workflow.json';a.click();URL.revokeObjectURL(a.href);
 };
 const exportImage=async type=>{
   if(!visualRef.current)return;
   const fn=type==='png'?toPng:toSvg;
   const data=await fn(visualRef.current,{pixelRatio:2,cacheBust:true,backgroundColor:'#061018'});
   const a=document.createElement('a');a.href=data;a.download=`security-studio-workflow.${type}`;a.click();
 };

 return <>
  <PageTitle kicker="BUILDERS" title="Workflow Builder" text="Build reusable assessment flows with drag-and-drop steps, decisions, commands and Notes links."/>

  <div className="studioToolbar">
   <div className="toolbarPrimary">
    <button className="primarySmall" onClick={()=>add('Validation')}><Plus size={15}/> Add step</button>
    <button className="secondarySmall" onClick={()=>add('Decision')}><GitCompareArrows size={15}/> Add decision</button>
    <select value={template} onChange={e=>setTemplate(e.target.value)}>{Object.keys(templates).map(x=><option key={x}>{x}</option>)}</select>
    <button className="secondarySmall" onClick={loadTemplate}><Workflow size={15}/> Load template</button>
   </div>
   <div className="toolbarSecondary">
    <span className="exportOnlyNote">Export only</span>
    <button className="secondarySmall" onClick={exportJson}><FileJson size={15}/> Export JSON</button>
    <button className="secondarySmall" onClick={()=>exportImage('png')}><Download size={15}/> PNG</button>
    <button className="secondarySmall" onClick={()=>exportImage('svg')}><Download size={15}/> SVG</button>
    <button className="secondarySmall dangerOutline" onClick={reset}><RotateCcw size={15}/> Reset</button>
   </div>
  </div>

  <div className="workflowCanvas" ref={visualRef}>
   {nodes.map((n,i)=><React.Fragment key={n.id}>
    <div
     className={`worknode pro ${dragIndex===i?'dragging':''}`}
     draggable
     onDragStart={()=>setDragIndex(i)}
     onDragOver={e=>e.preventDefault()}
     onDrop={()=>{move(dragIndex,i);setDragIndex(null)}}
     onDragEnd={()=>setDragIndex(null)}
    >
     <button className="dragHandle" title="Drag to reorder"><GripVertical size={18}/></button>
     <span className="worknumber">{i+1}</span>
     <div className="workflowFields">
      <input value={n.title} onChange={e=>update(n.id,{title:e.target.value})}/>
      <select value={n.kind} onChange={e=>update(n.id,{kind:e.target.value})}>
       <option>Planning</option><option>Validation</option><option>Decision</option><option>Detection</option><option>Response</option><option>Learning</option>
      </select>
      <select value={n.commandId||''} onChange={e=>update(n.id,{commandId:e.target.value})}>
       <option value="">No command attached</option>
       {commands.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <input placeholder="Notes URL (optional)" value={n.notes||''} onChange={e=>update(n.id,{notes:e.target.value})}/>
      {n.kind==='Decision'&&<div className="decisionLabels">
       <input placeholder="Yes branch" value={n.yesLabel||''} onChange={e=>update(n.id,{yesLabel:e.target.value})}/>
       <input placeholder="No branch" value={n.noLabel||''} onChange={e=>update(n.id,{noLabel:e.target.value})}/>
      </div>}
     </div>
     <button className="dangerAction iconOnly" onClick={()=>setNodes(nodes.filter(x=>x.id!==n.id))} title="Delete"><Trash2 size={16}/></button>
    </div>
    {i<nodes.length-1&&<div className={`workflowConnector ${n.kind==='Decision'?'decision':''}`}>
     {n.kind==='Decision'?<><span>{n.yesLabel||'Yes'}</span><span>{n.noLabel||'No'}</span></>:<span>↓</span>}
    </div>}
   </React.Fragment>)}
   {!nodes.length&&<div className="empty">No workflow steps yet. Add a step or load a template.</div>}
  </div>
 </>
}

function Detection(){
 const counts={}; commands.flatMap(c=>c.telemetry).forEach(x=>counts[x]=(counts[x]||0)+1);
 const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12);
 return <><PageTitle kicker="DEFENCE" title="Detection & Telemetry" text="Explore which data sources provide visibility across the command catalogue."/><div className="metricgrid">{top.map(([s,count])=><div className="metric" key={s}><RadioTower/><b>{count}</b><span>{s}</span></div>)}</div><Panel title="Telemetry coverage"><p>Open a command in Command Studio and select <b>Detect</b> to see its individual defensive context.</p></Panel></>
}

function Purple(){
 const defaults=[
  {id:1,title:'Validation action',hint:'Authorised assessment step',value:''},
  {id:2,title:'Expected telemetry',hint:'What should become observable',value:''},
  {id:3,title:'Actual telemetry observed',hint:'What was actually observed during validation',value:''},
  {id:4,title:'Telemetry source',hint:'Where the signal appeared',value:''},
  {id:5,title:'Detection',hint:'How the activity was identified',value:''},
  {id:6,title:'Response',hint:'Expected or actual defensive action',value:''},
  {id:7,title:'Learning outcome',hint:'What should improve next',value:''}
 ];
 const [items,setItems]=useState(()=>{try{const s=localStorage.getItem('security-studio-purple-map');const p=s?JSON.parse(s):null;return Array.isArray(p)&&p.length===7?p:defaults}catch{return defaults}});
 const [technique,setTechnique]=useState(()=>localStorage.getItem('security-studio-purple-technique')||'');
 const [commandId,setCommandId]=useState(()=>localStorage.getItem('security-studio-purple-command')||'');
 const [exerciseName,setExerciseName]=useState(()=>localStorage.getItem('security-studio-purple-name')||'Purple Team Validation');
 const [statuses,setStatuses]=useState(()=>{try{return JSON.parse(localStorage.getItem('security-studio-purple-status')||'{"telemetry":"Not tested","detection":"Not tested","response":"Not tested","overall":"Not tested"}')}catch{return {telemetry:'Not tested',detection:'Not tested',response:'Not tested',overall:'Not tested'}}});

 useEffect(()=>localStorage.setItem('security-studio-purple-map',JSON.stringify(items)),[items]);
 useEffect(()=>localStorage.setItem('security-studio-purple-technique',technique),[technique]);
 useEffect(()=>localStorage.setItem('security-studio-purple-command',commandId),[commandId]);
 useEffect(()=>localStorage.setItem('security-studio-purple-name',exerciseName),[exerciseName]);
 useEffect(()=>localStorage.setItem('security-studio-purple-status',JSON.stringify(statuses)),[statuses]);

 const selectedCommand=commands.find(c=>c.id===commandId);
 const techniques=[...new Set(commands.flatMap(c=>c.attack))].filter(Boolean).sort();
 const setValue=(id,value)=>setItems(items.map(x=>x.id===id?{...x,value}:x));
 const statusClass=v=>['Observed','Detected','Successful','Passed'].includes(v)?'good':v==='Partial'?'partial':['Missed','Failed'].includes(v)?'bad':'neutral';

 const clear=()=>{
  setItems(defaults);setTechnique('');setCommandId('');setExerciseName('Purple Team Validation');
  setStatuses({telemetry:'Not tested',detection:'Not tested',response:'Not tested',overall:'Not tested'});
 };
 const payload=()=>({
  name:exerciseName,schemaVersion:'2.5',version:'2.5',technique,
  command:selectedCommand?{id:selectedCommand.id,title:selectedCommand.title,command:selectedCommand.command}:null,
  statuses,mapping:items
 });
 const downloadBlob=(content,type,name)=>{
  const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);
 };
 const exportJson=()=>downloadBlob(JSON.stringify(payload(),null,2),'application/json','purple-team-exercise.json');
 const exportMarkdown=()=>{
  const p=payload();
  const md=[
   `# ${p.name}`,'',
   `- ATT&CK technique: ${p.technique||'Not selected'}`,
   `- Validation command: ${p.command?.title||'Not selected'}`,
   `- Telemetry status: ${p.statuses.telemetry}`,
   `- Detection status: ${p.statuses.detection}`,
   `- Response status: ${p.statuses.response}`,
   `- Overall status: ${p.statuses.overall}`,'',
   '## Exercise mapping','',
   ...p.mapping.flatMap(x=>[`### ${x.id}. ${x.title}`,x.value||'_Not documented_',''])
  ].join('\n');
  downloadBlob(md,'text/markdown','purple-team-exercise-summary.md');
 };

 return <>
  <PageTitle kicker="DEFENCE" title="Purple Team Validation Workspace" text="Connect an authorised validation action to expected and observed telemetry, detection, response and learning outcomes."/>

  <div className="purpleSetup">
   <label>Exercise name<input value={exerciseName} onChange={e=>setExerciseName(e.target.value)}/></label>
   <label>ATT&CK technique<select value={technique} onChange={e=>setTechnique(e.target.value)}><option value="">Select technique</option>{techniques.map(t=><option key={t}>{t}</option>)}</select></label>
   <label>Validation command<select value={commandId} onChange={e=>setCommandId(e.target.value)}><option value="">Select command</option>{commands.filter(c=>!technique||c.attack.includes(technique)).map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
  </div>

  {selectedCommand&&<div className="purpleCommandPreview">
   <div><span>{selectedCommand.platform} · {selectedCommand.tool}</span><b>{selectedCommand.title}</b><code>{selectedCommand.command}</code></div>
   <a href={selectedCommand.notes} target="_blank" rel="noopener noreferrer">Open Notes <ExternalLink size={13}/></a>
  </div>}

  <div className="purpleStatuses four">
   <label>Telemetry<select className={statusClass(statuses.telemetry)} value={statuses.telemetry} onChange={e=>setStatuses({...statuses,telemetry:e.target.value})}><option>Not tested</option><option>Observed</option><option>Partial</option><option>Missed</option></select></label>
   <label>Detection<select className={statusClass(statuses.detection)} value={statuses.detection} onChange={e=>setStatuses({...statuses,detection:e.target.value})}><option>Not tested</option><option>Detected</option><option>Partial</option><option>Missed</option></select></label>
   <label>Response<select className={statusClass(statuses.response)} value={statuses.response} onChange={e=>setStatuses({...statuses,response:e.target.value})}><option>Not tested</option><option>Successful</option><option>Partial</option><option>Failed</option></select></label>
   <label>Overall<select className={statusClass(statuses.overall)} value={statuses.overall} onChange={e=>setStatuses({...statuses,overall:e.target.value})}><option>Not tested</option><option>Passed</option><option>Partial</option><option>Failed</option></select></label>
  </div>

  <div className="studioToolbar purpleToolbar">
   <div className="toolbarPrimary">
    <button className="primarySmall" onClick={exportJson}><FileJson size={15}/> Export JSON</button>
    <button className="secondarySmall" onClick={exportMarkdown}><Download size={15}/> Export summary</button>
   </div>
   <div className="toolbarSecondary">
    <span>Saved locally in your browser</span>
    <button className="secondarySmall dangerOutline" onClick={clear}><Trash2 size={15}/> Clear validation</button>
   </div>
  </div>

  <div className="purpleflow signature">
   {items.map((x,i)=><React.Fragment key={x.id}>
    <div>
     <span>{x.id}</span><b>{x.title}</b><small>{x.hint}</small>
     <textarea value={x.value} onChange={e=>setValue(x.id,e.target.value)} placeholder={`Add ${x.title.toLowerCase()}...`}/>
    </div>
    {i<items.length-1&&<ChevronRight/>}
   </React.Fragment>)}
  </div>

  <Panel title="Exercise summary">
   <div className="summaryStrip five">
    <span>Technique <b>{technique||'Not selected'}</b></span>
    <span>Telemetry <b className={statusClass(statuses.telemetry)}>{statuses.telemetry}</b></span>
    <span>Detection <b className={statusClass(statuses.detection)}>{statuses.detection}</b></span>
    <span>Response <b className={statusClass(statuses.response)}>{statuses.response}</b></span>
    <span>Overall <b className={statusClass(statuses.overall)}>{statuses.overall}</b></span>
   </div>
  </Panel>
 </>
}

function NotFound(){return <PageTitle kicker="STUDIO" title="Not found" text="This Studio route does not exist."/>}
function PageTitle({kicker,title,text}){return <div className="pagetitle"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{text}</p></div>}
function Panel({title,children}){return <div className="panel"><h3>{title}</h3>{children}</div>}

class AppErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={error:null}}
 static getDerivedStateFromError(error){return {error}}
 componentDidCatch(error,info){console.error('Security Studio error',error,info)}
 render(){
  if(!this.state.error)return this.props.children;
  return <main className="fatalError">
   <div className="fatalErrorCard">
    <span className="eyebrow">RECOVERY</span>
    <h1>Security Studio could not render this view.</h1>
    <p>Your local data has not been uploaded anywhere. You can reload the application or reset Security Studio browser data if the problem persists.</p>
    <code>{String(this.state.error?.message||'Unexpected application error')}</code>
    <div>
     <button className="primarySmall" onClick={()=>location.reload()}><RotateCcw size={15}/> Reload Studio</button>
     <button className="secondarySmall dangerOutline" onClick={()=>{if(confirm('Reset Security Studio local browser data?')){clearStudioData();location.reload()}}}><Trash2 size={15}/> Reset local data</button>
    </div>
   </div>
  </main>
 }
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App/></AppErrorBoundary>);

if('serviceWorker' in navigator){
 addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}

