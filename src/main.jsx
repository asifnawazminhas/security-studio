import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {toPng,toSvg} from 'html-to-image';
import {
  Activity,ArrowLeft,BookOpen,CheckCircle2,ChevronDown,ChevronRight,Copy,Download,
  Clock3,ExternalLink,Filter,GitCompareArrows,Image,Layers3,LayoutDashboard,Library,Menu,
  FileJson,GripVertical,Network,Plus,RadioTower,RotateCcw,Save,Search,ShieldCheck,Star,Tag,TerminalSquare,Trash2,Upload,Workflow,X
} from 'lucide-react';
import {commands} from './data/commands';
import './styles.css';

const sections=[
 {title:'',items:[['Dashboard','dashboard',LayoutDashboard]]},
 {title:'COMMANDS',items:[['Command Library','library',Library],['Command Studio','command-studio',TerminalSquare],['Command Visualiser','visualiser',Image]]},
 {title:'EXPLORERS',items:[['PrivEsc Explorer','privesc',ShieldCheck],['ATT&CK Explorer','attack',Network],['Attack Path Explorer','attack-path',GitCompareArrows]]},
 {title:'WORKSPACE',items:[['Saved Workspace','workspace',Star]]},
 {title:'BUILDERS',items:[['Workflow Builder','workflow',Workflow]]},
 {title:'DEFENCE',items:[['Detection & Telemetry','detection',RadioTower],['Purple Team Mapping','purple',Layers3]]}
];

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
   <a className="notes" href="https://notes.asifnawazminhas.com/">Notes <ExternalLink size={14}/></a>
   <button className="hamb" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button>
  </header>
  <aside className={mobile?'open':''}>{sections.map((s,i)=><div className="navgroup" key={i}>{s.title&&<label>{s.title}</label>}{s.items.map(([name,id,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>go(id)}><Icon size={18}/>{name}</button>)}</div>)}<div className="sidefoot"><span className="dot"/> Studio v1.8</div></aside>
  <main>
   {page==='dashboard'?<Dashboard go={go} favorites={favorites} recent={recent}/>:
    page==='library'?<LibraryPage query={query} setQuery={setQuery} platform={platform} setPlatform={setPlatform} tool={tool} setTool={setTool} openCommand={openCommand} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='command-studio'?<CommandStudio c={selected} tab={tab} setTab={setTab} go={go} favorites={favorites} toggleFavorite={toggleFavorite}/>:
    page==='visualiser'?<Visualiser c={selected}/>:
    page==='privesc'?<PrivEscExplorer openCommand={openCommand}/>:
    page==='attack'?<AttackExplorer openCommand={openCommand}/>:
    page==='attack-path'?<AttackPathExplorer openCommand={openCommand}/>:
    page==='workspace'?<WorkspacePage favorites={favorites} recent={recent} toggleFavorite={toggleFavorite} openCommand={openCommand} removeRecent={removeRecent} clearRecent={clearRecent}/>: 
    page==='workflow'?<WorkflowBuilder/>:
    page==='detection'?<Detection/>:
    page==='purple'?<Purple/>:<NotFound/>}
  </main>
  {palette&&<CommandPalette close={()=>setPalette(false)} openCommand={c=>{setPalette(false);openCommand(c)}} go={p=>{setPalette(false);go(p)}}/>}
 </div>
}

function Dashboard({go,favorites,recent}){
 const quick=[['Command Library','library',Library,'Search structured security commands'],['Command Studio','command-studio',TerminalSquare,'Explain, modify and contextualise commands'],['Saved Workspace','workspace',Star,'Return to favourites and recent commands'],['PrivEsc Explorer','privesc',ShieldCheck,'Explore privilege-boundary checks'],['ATT&CK Explorer','attack',Network,'Map techniques to commands and telemetry'],['Purple Team Mapping','purple',Layers3,'Connect validation to defence']];
 return <><div className="hero"><div><span className="eyebrow">ASIF'S SECURITY STUDIO</span><h1>Security knowledge,<br/><em>made interactive.</em></h1><p>Explore commands, understand context, map telemetry and turn security notes into practical workflows.</p><div className="heroactions"><button onClick={()=>go('library')}>Explore Commands <ChevronRight size={16}/></button><a href="https://notes.asifnawazminhas.com/"><BookOpen size={16}/> Open Security Notes</a></div><div className="heroStats"><span><b>{commands.length}</b> commands</span><span><b>{favorites.length}</b> favourites</span><span><b>{recent.length}</b> recent</span></div></div><div className="terminal"><div className="termbar"><i/><i/><i/><span>security-studio</span></div><code><b>$</b> knowledge --interactive<br/><span>✓ {commands.length} commands indexed</span><br/><span>✓ Notes integration ready</span><br/><span>✓ Saved workspace enabled</span><br/><span>✓ ATT&CK mappings loaded</span><br/><span>✓ Detection context ready</span><br/><br/><b>$</b> explore <u>security</u><br/><strong>Ready.</strong></code></div></div><section><div className="sectionhead"><div><span className="eyebrow">WORKSPACE</span><h2>Choose where to start</h2></div></div><div className="grid">{quick.map(([n,id,I,d])=><button className="featurecard" onClick={()=>go(id)} key={id}><I/><div><h3>{n}</h3><p>{d}</p></div><ChevronRight className="arrow"/></button>)}</div></section><section><div className="banner"><Activity/><div><b>Built to connect Notes and Studio</b><span>Read methodology in Security Notes, open commands in Studio, then save useful references to your workspace.</span></div></div></section></>
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
 const copy=(e,c)=>{e.stopPropagation();navigator.clipboard?.writeText(c.command)};
 const fav=(e,c)=>{e.stopPropagation();toggleFavorite(c.id)};
 const copyLink=()=>navigator.clipboard?.writeText(location.href);
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

function WorkspacePage({favorites,recent,toggleFavorite,openCommand,removeRecent,clearRecent}){
 const importRef=useRef(null);
 const saved=favorites.map(id=>commands.find(c=>c.id===id)).filter(Boolean);
 const viewed=recent.map(id=>commands.find(c=>c.id===id)).filter(Boolean);

 const exportWorkspace=()=>{
  const payload={
   name:'Asif Security Studio Workspace',
   version:'1.8',
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
   const blob=new Blob([JSON.stringify({name:'Security Studio Workflow',version:'1.7',steps:nodes},null,2)],{type:'application/json'});
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
  name:exerciseName,version:'1.7',technique,
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
