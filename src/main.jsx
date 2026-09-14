import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {toPng,toSvg} from 'html-to-image';
import {
  Activity,ArrowLeft,BookOpen,CheckCircle2,ChevronDown,ChevronRight,Copy,Download,
  Clock3,ExternalLink,Filter,GitCompareArrows,Image,Layers3,LayoutDashboard,Library,Menu,
  Check,FileJson,FileText,GripVertical,Link2,Network,Package,Plus,RadioTower,RotateCcw,Save,Search,ShieldCheck,Star,Tag,TerminalSquare,Trash2,Upload,Workflow,X
} from 'lucide-react';
import {commands} from './data/commands';
import './styles.css';

const sections=[
 {title:'',items:[['Dashboard','dashboard',LayoutDashboard]]},
 {title:'COMMANDS',items:[['Command Library','library',Library],['Command Studio','command-studio',TerminalSquare],['Command Visualiser','visualiser',Image],['Command Packs','packs',Package]]},
 {title:'EXPLORERS',items:[['PrivEsc Explorer','privesc',ShieldCheck],['ATT&CK Explorer','attack',Network],['Attack Path Explorer','attack-path',GitCompareArrows]]},
 {title:'WORKSPACE',items:[['Saved Workspace','workspace',Star],['Report Builder','reports',FileText],['Notes Link Builder','notes-links',Link2]]},
 {title:'BUILDERS',items:[['Workflow Builder','workflow',Workflow]]},
 {title:'DEFENCE',items:[['Detection & Telemetry','detection',RadioTower],['Purple Team Mapping','purple',Layers3]]}
];


const studioToast=(message)=>window.dispatchEvent(new CustomEvent('studio-toast',{detail:message}));

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
     if(e.key==='Escape')setPalette(false);
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

 return <div className="app">
  <header>
   <button className="brand" onClick={()=>go('dashboard')}><div className="mark">A</div><div><b>Asif's Security Studio</b><span>Interactive security knowledge workspace</span></div></button>
   <button className="topsearch" onClick={()=>setPalette(true)}><Search size={17}/><span>Search commands, tools, techniques...</span><kbd>Ctrl K</kbd></button>
   <div className={`connectionState ${online?'online':'offline'}`}><span/> {online?'Online':'Offline'}</div><a className="notes" href="https://notes.asifnawazminhas.com/">Notes <ExternalLink size={14}/></a>
   <button className="hamb" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  </header>
  <aside className={mobile?'open':''}>{sections.map((s,i)=><div className="navgroup" key={i}>{s.title&&<label>{s.title}</label>}{s.items.map(([name,id,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><Icon size={18}/>{name}</button>)}</div>)}<div className="sidefoot"><span className="dot"/> Studio v2.0</div></aside>
  <main>
   {page==='dashboard'?<Dashboard go={go} favorites={favorites} recent={recent}/>:
    page==='library'?<LibraryPage query={query} setQuery={setQuery} platform={platform} setPlatform={setPlatform} tool={tool} setTool={setTool} openCommand={openCommand} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='command-studio'?<CommandStudio c={selected} tab={tab} setTab={setTab} go={go} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='visualiser'?<Visualiser c={selected}/>: 
    page==='packs'?<CommandPacks openCommand={openCommand}/>:
    page==='privesc'?<PrivEscExplorer openCommand={openCommand}/>:
    page==='attack'?<AttackExplorer openCommand={openCommand}/>:
    page==='attack-path'?<AttackPathExplorer openCommand={openCommand}/>:
    page==='workspace'?<WorkspacePage favorites={favorites} recent={recent} toggleFavorite={toggleFavorite} openCommand={openCommand} removeRecent={removeRecent} clearRecent={clearRecent}/>: 
    page==='reports'?<ReportBuilder/>:
    page==='notes-links'?<NotesLinkBuilder/>:
    page==='workflow'?<WorkflowBuilder/>:
    page==='detection'?<Detection/>:
    page==='purple'?<Purple/>:<NotFound/>}
  </main>
  {palette&&<CommandPalette close={()=>setPalette(false)} openCommand={c=>{setPalette(false);openCommand(c)}} go={p=>{setPalette(false);go(p)}}/>}
  <ToastHost/>
 </div>
}

function Dashboard({go,favorites,recent}){
 const quick=[
  ['Command Library','library',Library,'Search structured security commands'],
  ['Command Studio','command-studio',TerminalSquare,'Explain, modify and contextualise commands'],
  ['Command Packs','packs',Package,'Open reusable command collections'],
  ['Saved Workspace','workspace',Star,'Return to favourites and recent commands'],
  ['Report Builder','reports',FileText,'Turn validation work into a finished report'],
  ['Purple Team Mapping','purple',Layers3,'Connect validation to defence']
 ];
 const health=catalogHealth();
 return <>
  <div className="hero">
   <div>
    <span className="eyebrow">ASIF'S SECURITY STUDIO</span>
    <h1>Security knowledge,<br/><em>made interactive.</em></h1>
    <p>Explore commands, understand context, map telemetry and turn security notes into practical workflows and finished reports.</p>
    <div className="heroactions">
     <button onClick={()=>go('library')}>Explore Commands <ChevronRight size={16}/></button>
     <a href="https://notes.asifnawazminhas.com/"><BookOpen size={16}/> Open Security Notes</a>
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
     <b>$</b> knowledge --interactive<br/>
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
 const input=useRef(null);
 useEffect(()=>input.current?.focus(),[]);
 const results=commands.filter(c=>`${c.title} ${c.tool} ${c.platform} ${c.category} ${c.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0,8);
 return <div className="paletteback" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="palette"><div className="paletteinput"><Search/><input ref={input} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search commands, tools, techniques..."/><kbd>Esc</kbd></div><div className="paletteresults">{results.map(c=><button key={c.id} onClick={()=>openCommand(c)}><TerminalSquare/><div><b>{c.title}</b><span>{c.platform} · {c.tool} · {c.category}</span></div><ChevronRight/></button>)}{!results.length&&<div className="empty">No matching commands.</div>}</div><div className="palettefoot"><button onClick={()=>go('library')}>Open Command Library</button><span>{commands.length} indexed commands</span></div></div></div>
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
     `${c.title} ${c.platform} ${c.tool} ${c.category} ${c.tags.join(' ')} ${c.command}`.toLowerCase().includes(query.toLowerCase())
   );
   return [...rows].sort((a,b)=>{
     if(sort==='Platform')return a.platform.localeCompare(b.platform)||a.title.localeCompare(b.title);
     if(sort==='Tool')return a.tool.localeCompare(b.tool)||a.title.localeCompare(b.title);
     if(sort==='Category')return a.category.localeCompare(b.category)||a.title.localeCompare(b.title);
     return a.title.localeCompare(b.title);
   });
 },[query,platform,tool,category,tag,onlyFavorites,favorites,sort]);

 const count=(key,value)=>commands.filter(c=>value==='All'||(key==='tags'?c.tags.includes(value):c[key]===value)).length;
 const copy=(e,c)=>{e.stopPropagation();navigator.clipboard?.writeText(c.command);studioToast('Command copied');};
 const fav=(e,c)=>{e.stopPropagation();toggleFavorite(c.id)};
 const copyLink=()=>{navigator.clipboard?.writeText(location.href);studioToast('Filtered Command Library link copied');};
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
   <div className="badges"><span>{c.platform}</span><span>{c.tool}</span><small>{c.risk}</small></div>
   <h3>{c.title}</h3><p>{c.description}</p><code>{c.command}</code>
   <div className="tags">{c.tags.map(t=><small key={t}>{t}</small>)}</div>
   <div className="cardActions">
    <button onClick={e=>fav(e,c)} className={favorites.includes(c.id)?'favOn':''}><Star size={14} fill={favorites.includes(c.id)?'currentColor':'none'}/> {favorites.includes(c.id)?'Saved':'Save'}</button>
    <button onClick={e=>copy(e,c)}><Copy size={14}/> Copy</button>
    <a href={c.notes} onClick={e=>e.stopPropagation()}><BookOpen size={14}/> Notes</a>
    <button className="openBtn" onClick={()=>openCommand(c)}>Open in Studio <ChevronRight size={14}/></button>
   </div>
  </article>)}</div>
  {!filtered.length&&<div className="empty">No commands match the current search and filters.</div>}
 </>
}

function CommandStudio({c,tab,setTab,go,favorites,toggleFavorite}){
 const [values,setValues]=useState({});
 useEffect(()=>setValues(Object.fromEntries(c.parameters.map(p=>[p.name,'']))),[c.id]);
 const generated=c.parameters.reduce((s,p)=>s.replaceAll(`<${p.name}>`,values[p.name]||`<${p.name}>`),c.command);
 const copy=()=>navigator.clipboard?.writeText(generated);
 return <><button className="back" onClick={()=>go('library')}><ArrowLeft size={15}/> Command Library</button><div className="studioTitleRow"><PageTitle kicker={`${c.platform} / ${c.category}`} title={c.title} text={c.description}/><button className={`saveCommand ${favorites.includes(c.id)?'saved':''}`} onClick={()=>toggleFavorite(c.id)}><Star size={16} fill={favorites.includes(c.id)?'currentColor':'none'}/>{favorites.includes(c.id)?'Saved':'Save command'}</button></div><div className="studio"><div className="commandbox"><div className="commandmeta"><span className="cmdtool"><TerminalSquare size={18}/>{c.tool}</span><span className="cmdrisk">{c.risk}</span></div><div className="commandline"><code>{generated}</code><button className="copybtn" onClick={copy}><Copy size={15}/> Copy</button></div></div><div className="tabs">{['Explain','Modify','Detect','Visualise','Related'].map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>
 {tab==='Explain'&&<div className="twocol"><Panel title="Command Breakdown"><dl>{c.explanation.map(([a,b])=><React.Fragment key={a}><dt>{a}</dt><dd>{b}</dd></React.Fragment>)}</dl></Panel><Panel title="Context"><dl><dt>Platform</dt><dd>{c.platform}</dd><dt>Tool</dt><dd>{c.tool}</dd><dt>Category</dt><dd>{c.category}</dd><dt>Changes system</dt><dd>{c.changesSystem?'Yes':'No'}</dd><dt>Risk</dt><dd>{c.risk}</dd></dl></Panel></div>}
 {tab==='Modify'&&<Panel title="Command Parameters">{c.parameters.length?<>{c.parameters.map(p=><label className="field" key={p.name}>{p.label}<input placeholder={p.placeholder} value={values[p.name]||''} onChange={e=>setValues({...values,[p.name]:e.target.value})}/></label>)}<div className="generated"><small>GENERATED COMMAND</small><code>{generated}</code><button onClick={copy}><Copy size={15}/> Copy</button></div></>:<p>This command has no editable placeholders.</p>}</Panel>}
 {tab==='Detect'&&<div className="twocol"><Panel title="Defender View"><p>Use the telemetry below as assessment context. A command alone is not automatically suspicious; correlation and intent matter.</p>{c.telemetry.map(x=><div className="check" key={x}><CheckCircle2 size={16}/>{x}</div>)}</Panel><Panel title="ATT&CK Context">{c.attack.length?c.attack.map(x=><div className="attackpill" key={x}>{x}</div>):<p>No ATT&CK mapping assigned to this reference entry.</p>}</Panel></div>}
 {tab==='Visualise'&&<VisualPreview c={{...c,command:generated}}/>}
 {tab==='Related'&&<div className="twocol"><Panel title="Security Notes"><p>Continue with the full methodology and supporting documentation.</p><a className="textlink" href={c.notes}>Open related Security Notes <ExternalLink size={14}/></a></Panel><Panel title="Tags"><div className="tags big">{c.tags.map(x=><small key={x}>{x}</small>)}</div><p className="permalink">Permalink<br/><code>{location.href}</code></p></Panel></div>}
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
 return <><PageTitle kicker="EXPLORERS" title="PrivEsc Explorer" text="Decision-support for reviewing privilege boundaries, context and defensive controls."/><div className="explorerShell"><div className="explorerTop"><div className="segmented"><button className={os==='Windows'?'active':''} onClick={()=>setOs('Windows')}>Windows</button><button className={os==='Linux'?'active':''} onClick={()=>setOs('Linux')}>Linux</button></div><div className="explainer">This explorer organises review steps and links to read-only validation commands. It does not perform exploitation.</div></div><div className="explorerGrid"><div className="stepRail">{steps.map(([id,title],i)=><button className={step===id?'active':''} key={id} onClick={()=>setStep(id)}><span>{i+1}</span><b>{title}</b><ChevronRight/></button>)}</div><div className="stepContent"><span className="eyebrow">{os.toUpperCase()} REVIEW STEP</span><h2>{current[1]}</h2><p>{current[2]}</p><div className="decisionRow"><button className={answers[step]==='reviewed'?'yes':''} onClick={()=>setAnswers({...answers,[step]:'reviewed'})}>Mark reviewed</button><button className={answers[step]==='followup'?'follow':''} onClick={()=>setAnswers({...answers,[step]:'followup'})}>Needs follow-up</button></div><h3>Related commands</h3><div className="miniCommands">{currentCommands.map(c=><button key={c.id} onClick={()=>openCommand(c)}><div><b>{c.title}</b><code>{c.command}</code></div><ChevronRight/></button>)}</div><a className="textlink" href={os==='Windows'?'https://notes.asifnawazminhas.com/windows/':'https://notes.asifnawazminhas.com/linux/'}>Open {os} Security Notes <ExternalLink size={14}/></a></div></div></div></>
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
    <a className="textlink" href="https://notes.asifnawazminhas.com/active-directory/">Open related Security Notes <ExternalLink size={14}/></a>
   </div>
  </div>
 </>;
}

function VisualPreview({c}){
 const ref=useRef(null);
 const [theme,setTheme]=useState('Security Notes Dark');
 const [prompt,setPrompt]=useState(c.platform==='Windows'?'PS>':'$');
 const [watermark,setWatermark]=useState(true);
 const [watermarkText,setWatermarkText]=useState('studio.asifnawazminhas.com');
 const [windowTitle,setWindowTitle]=useState(c.tool);
 const [fontSize,setFontSize]=useState(20);
 const [padding,setPadding]=useState(48);
 const [customCommand,setCustomCommand]=useState(c.command);

 useEffect(()=>{
   setPrompt(c.platform==='Windows'?'PS>':'$');
   setWindowTitle(c.tool);
   setCustomCommand(c.command);
 },[c.id]);

 const themeClass={
   'Security Notes Dark':'theme-security',
   'Midnight':'theme-midnight',
   'Clean Light':'theme-light',
   'Matrix Green':'theme-matrix',
   'Purple Ops':'theme-purple',
   'Dracula':'theme-dracula',
   'Nord':'theme-nord',
   'Solarized Dark':'theme-solarized',
   'Amber Terminal':'theme-amber',
   'High Contrast':'theme-contrast'
 }[theme]||'theme-security';

 const download=async(type)=>{
   if(!ref.current)return;
   const fn=type==='png'?toPng:toSvg;
   const data=await fn(ref.current,{pixelRatio:2,cacheBust:true});
   const a=document.createElement('a');
   a.href=data;
   a.download=`${c.id}-${theme.toLowerCase().replaceAll(' ','-')}.${type}`;
   a.click();
 };

 const reset=()=>{
   setTheme('Security Notes Dark');
   setPrompt(c.platform==='Windows'?'PS>':'$');
   setWatermark(true);
   setWatermarkText('studio.asifnawazminhas.com');
   setWindowTitle(c.tool);
   setFontSize(20);
   setPadding(48);
   setCustomCommand(c.command);
 };

 return <div className="visualPro">
  <div className="visualSettings">
   <div className="visualField wide">
    <label>Command</label>
    <textarea value={customCommand} onChange={e=>setCustomCommand(e.target.value)}/>
   </div>
   <div className="visualField">
    <label>Theme</label>
    <select value={theme} onChange={e=>setTheme(e.target.value)}>
     <option>Security Notes Dark</option>
     <option>Midnight</option>
     <option>Clean Light</option>
     <option>Matrix Green</option>
     <option>Purple Ops</option>
     <option>Dracula</option>
     <option>Nord</option>
     <option>Solarized Dark</option>
     <option>Amber Terminal</option>
     <option>High Contrast</option>
    </select>
   </div>
   <div className="visualField">
    <label>Prompt</label>
    <input value={prompt} onChange={e=>setPrompt(e.target.value)}/>
   </div>
   <div className="visualField">
    <label>Window title</label>
    <input value={windowTitle} onChange={e=>setWindowTitle(e.target.value)}/>
   </div>
   <div className="visualField">
    <label>Font size</label>
    <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))}>
     <option value="16">16 px</option>
     <option value="18">18 px</option>
     <option value="20">20 px</option>
     <option value="22">22 px</option>
     <option value="24">24 px</option>
     <option value="28">28 px</option>
    </select>
   </div>
   <div className="visualField">
    <label>Card padding</label>
    <select value={padding} onChange={e=>setPadding(Number(e.target.value))}>
     <option value="32">Compact</option>
     <option value="48">Balanced</option>
     <option value="64">Spacious</option>
     <option value="80">Poster</option>
    </select>
   </div>
   <div className="visualField watermarkField">
    <label>Watermark</label>
    <div className="inlineControl">
     <input type="checkbox" checked={watermark} onChange={e=>setWatermark(e.target.checked)}/>
     <input disabled={!watermark} value={watermarkText} onChange={e=>setWatermarkText(e.target.value)}/>
    </div>
   </div>
  </div>

  <div ref={ref} className={`exportcard pro ${themeClass}`}>
   <div className="exportbar"><i/><i/><i/><span>{windowTitle}</span></div>
   <div className="exportbody" style={{padding:`${padding}px`}}>
    <div className="exportCommand" style={{fontSize:`${fontSize}px`}}>
     <b>{prompt}</b>
     <code>{customCommand}</code>
    </div>
    {watermark&&<small>{watermarkText}</small>}
   </div>
  </div>

  <div className="visualActionBar">
   <div className="visualActionGroup">
    <button className="primarySmall" onClick={()=>download('png')}><Download size={15}/> Export PNG</button>
    <button className="secondarySmall" onClick={()=>download('svg')}><Download size={15}/> Export SVG</button>
    <button className="secondarySmall" onClick={()=>navigator.clipboard?.writeText(customCommand)}><Copy size={15}/> Copy command</button>
   </div>
   <button className="secondarySmall" onClick={reset}><RotateCcw size={15}/> Reset</button>
  </div>
 </div>
}

function Visualiser({c}){
 const [chosen,setChosen]=useState(c||commands[0]);
 return <>
  <PageTitle kicker="COMMANDS" title="Command Visualiser" text="Create polished Security Studio command cards with multiple terminal themes and export them as PNG or SVG."/>
  <div className="visualselect">
   <label>Library command
    <select value={chosen.id} onChange={e=>setChosen(commands.find(c=>c.id===e.target.value))}>
     {commands.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
    </select>
   </label>
  </div>
  <VisualPreview c={chosen}/>
 </>
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
    <a className="secondarySmall" href={c.notes}>Open Notes page <BookOpen size={15}/></a>
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
 const importRef=useRef(null);
 const saved=favorites.map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 const viewed=recent.map(id=>commands.find(c=>c.id===id)).filter(Boolean);

 const exportWorkspace=()=>{
  const payload={
   name:'Asif Security Studio Workspace',
   schemaVersion:'2.0',version:'2.0',
   exportedAt:new Date().toISOString(),
   favorites,
   recent,
   workflow:JSON.parse(localStorage.getItem('security-studio-workflow')||'[]'),
   purpleMap:JSON.parse(localStorage.getItem('security-studio-purple-map')||'[]'),
   purpleTechnique:localStorage.getItem('security-studio-purple-technique')||'',
   purpleCommand:localStorage.getItem('security-studio-purple-command')||'',
   purpleStatus:JSON.parse(localStorage.getItem('security-studio-purple-status')||'{}'),
   purpleName:localStorage.getItem('security-studio-purple-name')||''
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='security-studio-workspace.json';
  a.click();
  URL.revokeObjectURL(a.href);
 };

 const importWorkspace=e=>{
  const file=e.target.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
   try{
    const p=JSON.parse(reader.result);
    if(!p||!Array.isArray(p.favorites)||!Array.isArray(p.recent))throw new Error('Invalid workspace');
    if(p.schemaVersion && p.schemaVersion!=='2.0')throw new Error(`Unsupported workspace schema ${p.schemaVersion}`);
    localStorage.setItem('security-studio-favorites',JSON.stringify(p.favorites));
    localStorage.setItem('security-studio-recent',JSON.stringify(p.recent));
    if(Array.isArray(p.workflow))localStorage.setItem('security-studio-workflow',JSON.stringify(p.workflow));
    if(Array.isArray(p.purpleMap))localStorage.setItem('security-studio-purple-map',JSON.stringify(p.purpleMap));
    if(typeof p.purpleTechnique==='string')localStorage.setItem('security-studio-purple-technique',p.purpleTechnique);
    if(typeof p.purpleCommand==='string')localStorage.setItem('security-studio-purple-command',p.purpleCommand);
    if(p.purpleStatus)localStorage.setItem('security-studio-purple-status',JSON.stringify(p.purpleStatus));
    if(typeof p.purpleName==='string')localStorage.setItem('security-studio-purple-name',p.purpleName);
    location.reload();
   }catch{
    alert('This file does not contain a valid Security Studio workspace backup.');
   }
  };
  reader.readAsText(file);
  e.target.value='';
 };

 const clearWorkspace=()=>{
  if(!confirm('Clear favourites, recent commands, workflow and purple-team workspace data from this browser?'))return;
  [
   'security-studio-favorites',
   'security-studio-recent',
   'security-studio-workflow',
   'security-studio-purple-map',
   'security-studio-purple-technique',
   'security-studio-purple-command',
   'security-studio-purple-status',
   'security-studio-purple-name'
  ].forEach(k=>localStorage.removeItem(k));
  location.reload();
 };

 const savedList=saved.length?<div className="workspaceList">{saved.map(c=>
  <div className="workspaceItem" key={c.id}>
   <div><span>{c.platform} · {c.tool}</span><b>{c.title}</b><code>{c.command}</code></div>
   <div>
    <button onClick={()=>toggleFavorite(c.id)} title="Remove favourite"><Star size={15} fill="currentColor"/></button>
    <a href={c.notes} title="Open Notes"><BookOpen size={15}/></a>
    <button onClick={()=>openCommand(c)}>Open <ChevronRight size={14}/></button>
   </div>
  </div>)}</div>:<div className="empty">No saved commands yet. Use the star button in the Command Library or Command Studio.</div>;

 const recentList=viewed.length?<div className="workspaceList">{viewed.map(c=>
  <div className="workspaceItem" key={c.id}>
   <div><span>{c.platform} · {c.tool}</span><b>{c.title}</b><code>{c.command}</code></div>
   <div>
    <button onClick={()=>toggleFavorite(c.id)} title="Toggle favourite"><Star size={15} fill={favorites.includes(c.id)?'currentColor':'none'}/></button>
    <a href={c.notes} title="Open Notes"><BookOpen size={15}/></a>
    <button onClick={()=>openCommand(c)}>Open <ChevronRight size={14}/></button>
    <button className="recentDelete" onClick={()=>removeRecent(c.id)} title="Remove from recently viewed"><X size={15}/></button>
   </div>
  </div>)}</div>:<div className="empty">Open commands in Studio and they will appear here.</div>;

 return <>
  <PageTitle kicker="WORKSPACE" title="Saved Workspace" text="Keep useful commands close, manage recent history and back up your Studio workspace."/>
  <div className="studioToolbar workspaceToolbar">
   <div className="toolbarPrimary">
    <button className="primarySmall" onClick={exportWorkspace}><Download size={15}/> Export workspace</button>
    <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={importWorkspace}/>
    <button className="secondarySmall" onClick={()=>importRef.current?.click()}><Upload size={15}/> Import workspace</button>
   </div>
   <div className="toolbarSecondary">
    <button className="secondarySmall dangerOutline" onClick={clearWorkspace}><Trash2 size={15}/> Clear workspace</button>
   </div>
  </div>

  <div className="workspaceStats">
   <div><Star/><b>{saved.length}</b><span>Saved commands</span></div>
   <div><Clock3/><b>{viewed.length}</b><span>Recent commands</span></div>
   <div><Library/><b>{commands.length}</b><span>Total catalogue</span></div>
  </div>

  <div className="workspaceColumns">
   <Panel title="Favourites">{savedList}</Panel>
   <div className="panel">
    <div className="panelTitleActions">
     <h3>Recently viewed</h3>
     <button className="secondarySmall dangerOutline compact" disabled={!viewed.length} onClick={clearRecent}><Trash2 size={14}/> Clear recent</button>
    </div>
    {recentList}
   </div>
  </div>
 </>
}

function WorkflowBuilder(){
 const visualRef=useRef(null);
 const fileRef=useRef(null);
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
   const blob=new Blob([JSON.stringify({name:'Security Studio Workflow',schemaVersion:'2.0',version:'2.0',steps:nodes},null,2)],{type:'application/json'});
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='security-studio-workflow.json';a.click();URL.revokeObjectURL(a.href);
 };
 const importJson=e=>{
   const file=e.target.files?.[0]; if(!file)return;
   const reader=new FileReader();
   reader.onload=()=>{
    try{
     const parsed=JSON.parse(reader.result);
     const rows=Array.isArray(parsed)?parsed:parsed.steps;
     if(!Array.isArray(rows))throw new Error('Invalid workflow');
     setNodes(rows.map((x,i)=>({id:x.id||Date.now()+i,title:x.title||'Imported step',kind:x.kind||'Validation',commandId:x.commandId||'',notes:x.notes||'',yesLabel:x.yesLabel||'Yes',noLabel:x.noLabel||'No'})));
    }catch{alert('This file does not contain a valid Security Studio workflow.')}
   };
   reader.readAsText(file); e.target.value='';
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
    <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importJson}/>
    <button className="secondarySmall" onClick={()=>fileRef.current?.click()}><Upload size={15}/> Import JSON</button>
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
  name:exerciseName,schemaVersion:'2.0',version:'2.0',technique,
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
   <a href={selectedCommand.notes}>Open Notes <ExternalLink size={13}/></a>
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

createRoot(document.getElementById('root')).render(<App/>);

if('serviceWorker' in navigator){
 addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}

