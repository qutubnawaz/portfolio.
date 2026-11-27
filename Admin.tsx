import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Eye, LogOut, Plus, Trash2, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Sync from './AdminSync'

type F={key:string;label:string;type?:'text'|'area'|'list'|'json'|'sections'|'metrics'|'bool'|'image'|'images'|'file'|'num';hint?:string}
type Cfg={table:string;label:string;title:string;fields:F[];single?:boolean}
const CFG:Cfg[]=[
 {table:'profiles',label:'Profile',title:'full_name',single:true,fields:[{key:'full_name',label:'Full name'},{key:'headline',label:'Headline'},{key:'tagline',label:'Tagline'},{key:'intro',label:'Intro',type:'area'},{key:'about',label:'About (one paragraph per line)',type:'list'},{key:'location',label:'Location'},{key:'languages',label:'Languages (one per line)',type:'list'},{key:'photo_url',label:'Profile photo',type:'image'},{key:'resume_url',label:'Resume (PDF)',type:'file'},{key:'cv_url',label:'CV (PDF)',type:'file'}]},
 {table:'projects',label:'Projects',title:'title',fields:[{key:'slug',label:'Slug (url-friendly)'},{key:'title',label:'Title'},{key:'category',label:'Category'},{key:'summary',label:'Summary',type:'area'},{key:'featured',label:'Featured',type:'bool'},{key:'tags',label:'Tags (one per line)',type:'list'},{key:'tools',label:'Software & tools (one per line)',type:'list'},{key:'metrics',label:'Key numbers (one per line: Label | Value)',type:'metrics'},{key:'sections',label:'Write-up. Start each part with ## Heading, then its text. Leave a blank line between parts.',type:'sections'},{key:'cover_url',label:'Cover image',type:'image'},{key:'gallery',label:'Gallery images',type:'images'},{key:'sort',label:'Order',type:'num'}]},
 {table:'skills',label:'Skills',title:'name',fields:[{key:'category',label:'Category'},{key:'name',label:'Skill'},{key:'learned_from',label:'Learned from (one per line)',type:'list'},{key:'sort',label:'Order',type:'num'}]},
 {table:'education',label:'Education',title:'degree',fields:[{key:'degree',label:'Degree'},{key:'institution',label:'Institution'},{key:'period',label:'Period'},{key:'note',label:'Note'},{key:'sort',label:'Order',type:'num'}]},
 {table:'certifications',label:'Certifications',title:'title',fields:[{key:'title',label:'Title'},{key:'issuer',label:'Issuer'},{key:'year',label:'Year'},{key:'note',label:'Note'},{key:'sort',label:'Order',type:'num'}]},
 {table:'achievements',label:'Achievements',title:'title',fields:[{key:'title',label:'Title'},{key:'description',label:'Description',type:'area'},{key:'year',label:'Year'},{key:'sort',label:'Order',type:'num'}]},
 {table:'experience',label:'Experience',title:'title',fields:[{key:'title',label:'Title'},{key:'org',label:'Organisation'},{key:'date_label',label:'Date'},{key:'description',label:'Description',type:'area'},{key:'sort',label:'Order',type:'num'}]},
 {table:'social_links',label:'Links',title:'label',fields:[{key:'label',label:'Label'},{key:'url',label:'URL'},{key:'sort',label:'Order',type:'num'}]},
]
type Row=Record<string,any>

async function upload(file:File,folder:string){
 const path=`${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`
 const{error}=await supabase!.storage.from('portfolio').upload(path,file,{upsert:false})
 if(error)throw error
 return supabase!.storage.from('portfolio').getPublicUrl(path).data.publicUrl
}

function Editor({cfg}:{cfg:Cfg}){
 const[rows,setRows]=useState<Row[]>([]),[sel,setSel]=useState<Row|null>(null),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[raw,setRaw]=useState<Row>({})
 const load=async()=>{setLoading(true);const{data,error}=await supabase!.from(cfg.table).select('*').order(cfg.single?'id':'sort' as string,{ascending:true})
  if(error)setMsg('Load failed: '+error.message);else{setRows(data??[]);if(cfg.single&&data?.[0])open(data[0])}setLoading(false)}
 const open=(r:Row)=>{setSel(r);const o:Row={};cfg.fields.forEach(f=>{const v=r[f.key];o[f.key]=f.type==='json'?JSON.stringify(v??[],null,1):f.type==='sections'?(v??[]).map((x:any)=>`## ${x.heading}\n${x.body}`).join('\n\n'):f.type==='metrics'?(v??[]).map((x:any)=>`${x.label} | ${x.value}`).join('\n'):f.type==='list'||f.type==='images'&&false?(v??[]).join('\n'):v??''});setRaw(o);setMsg('')}
 useEffect(()=>{setSel(null);setMsg('');load()},[cfg.table])
 const neu=()=>{const r:Row={published:false};cfg.fields.forEach(f=>{r[f.key]=f.type==='bool'?false:f.type==='num'?rows.length+1:f.type==='sections'||f.type==='metrics'?[]:f.type==='list'||f.type==='images'?[]:f.type==='json'?[]:''});delete r.id;open(r)}
 const save=async(published?:boolean)=>{if(!sel)return;setBusy(true);setMsg('')
  try{const out:Row={};for(const f of cfg.fields){const v=raw[f.key];
    out[f.key]=f.type==='sections'?String(v||'').split(/\n\s*\n(?=## )/).map(b=>b.trim()).filter(Boolean).map(b=>{const[h,...r]=b.replace(/^##\s*/,'').split('\n');return{heading:h.trim(),body:r.join('\n').trim()}}):f.type==='metrics'?String(v||'').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const[a,...b]=l.split('|');return{label:a.trim(),value:b.join('|').trim()}}):f.type==='list'?String(v).split('\n').map(s=>s.trim()).filter(Boolean):f.type==='images'?(Array.isArray(v)?v:[]):f.type==='json'?JSON.parse(v||'[]'):f.type==='num'?Number(v)||0:f.type==='file'||f.type==='image'?(v||null):v}
   if(cfg.single)out.id=1;else if(sel.id)out.id=sel.id
   out.published=published??sel.published??false
   const{error}=await supabase!.from(cfg.table).upsert(out).select().single();if(error)throw error
   setMsg(published===undefined?'Saved.':published?'Published.':'Unpublished.');setSel(null);await load()}
  catch(e:any){setMsg('Error: '+(e.message||e))}setBusy(false)}
 const del=async()=>{if(!sel?.id||!confirm('Delete permanently?'))return;const{error}=await supabase!.from(cfg.table).delete().eq('id',sel.id);setMsg(error?error.message:'Deleted.');if(!error){setSel(null);load()}}
 const up=async(f:F,files:FileList|null)=>{if(!files?.length)return;setBusy(true);try{
   if(f.type==='images'){const urls=[...(raw[f.key]||[])];for(const x of Array.from(files))urls.push(await upload(x,'images'));setRaw({...raw,[f.key]:urls})}
   else setRaw({...raw,[f.key]:await upload(files[0],f.type==='file'?'resume':'images')});setMsg('Uploaded. Remember to save.')}catch(e:any){setMsg('Upload failed: '+e.message)}setBusy(false)}
 return<div className="grid md:grid-cols-[260px_1fr] gap-6">
  <div>{!cfg.single&&<button className="btn btn-s w-full mb-3" onClick={neu}><Plus size={14}/> New</button>}
   {loading?<p className="font-mono text-xs text-mute">Loading…</p>:!rows.length&&!cfg.single?<p className="font-mono text-xs text-mute">Nothing yet.</p>:null}
   <ul className="space-y-1">{rows.map(r=><li key={r.id}><button onClick={()=>open(r)} className={`w-full text-left px-3 py-2 text-sm border ${sel?.id===r.id?'border-accent':'border-ink/10'}`}>{r[cfg.title]||'(untitled)'} <span className={`font-mono text-[10px] ml-1 ${r.published?'text-accent':'text-mute'}`}>{r.published?'LIVE':'DRAFT'}</span></button></li>)}</ul>
   {cfg.single&&!rows.length&&<button className="btn btn-s" onClick={neu}>Create profile</button>}</div>
  <div>{msg&&<p role="status" className="mb-3 font-mono text-xs text-accent">{msg}</p>}
   {sel?<div className="space-y-4">{cfg.fields.map(f=><label key={f.key} className="block"><span className="label">{f.label}</span>
    {f.type==='area'||f.type==='list'||f.type==='json'||f.type==='sections'||f.type==='metrics'?<textarea rows={f.type==='sections'?12:f.type==='json'?8:4} className={`field mt-1 ${f.type==='json'?'font-mono text-xs':''}`} value={raw[f.key]??''} onChange={e=>setRaw({...raw,[f.key]:e.target.value})}/>
    :f.type==='bool'?<input type="checkbox" className="ml-3" checked={!!raw[f.key]} onChange={e=>setRaw({...raw,[f.key]:e.target.checked})}/>
    :f.type==='image'||f.type==='file'||f.type==='images'?<div className="mt-1 flex flex-wrap items-center gap-3"><span className="btn btn-s cursor-pointer"><Upload size={14}/> Upload<input type="file" hidden multiple={f.type==='images'} accept={f.type==='file'?'application/pdf':'image/*'} onChange={e=>up(f,e.target.files)}/></span>
     {f.type==='images'?(raw[f.key]||[]).map((u:string)=><span key={u} className="relative"><img src={u} alt="" className="h-14 w-14 object-cover"/><button type="button" aria-label="Remove image" className="absolute -top-2 -right-2 bg-bg border border-ink/30 size-5 text-xs" onClick={()=>setRaw({...raw,[f.key]:raw[f.key].filter((x:string)=>x!==u)})}>×</button></span>)
     :raw[f.key]?<span className="font-mono text-xs text-mute truncate max-w-xs">{raw[f.key]}</span>:null}</div>
    :<input type={f.type==='num'?'number':'text'} className="field mt-1" value={raw[f.key]??''} onChange={e=>setRaw({...raw,[f.key]:e.target.value})}/>}</label>)}
    <div className="flex flex-wrap gap-3 pt-2"><button disabled={busy} className="btn btn-s" onClick={()=>save()}>Save</button>
     <button disabled={busy} className="btn btn-p" onClick={()=>save(true)}>Save & publish</button>
     <button disabled={busy} className="btn btn-s" onClick={()=>save(false)}>Unpublish</button>
     {sel.id&&!cfg.single&&<button disabled={busy} className="btn btn-s text-red-400" onClick={del}><Trash2 size={14}/> Delete</button>}</div></div>
   :<p className="font-mono text-sm text-mute">{cfg.single?'':'Select or create an entry.'}</p>}</div></div>}

function Messages(){const[m,setM]=useState<Row[]|null>(null),[err,setErr]=useState('')
 const load=()=>supabase!.from('messages').select('*').order('created_at',{ascending:false}).then(({data,error})=>error?setErr(error.message):setM(data))
 useEffect(()=>{load()},[])
 return<div className="space-y-3">{err&&<p className="text-red-400 text-sm">{err}</p>}{m===null&&!err&&<p className="font-mono text-xs text-mute">Loading…</p>}{m?.length===0&&<p className="font-mono text-sm text-mute">No messages yet.</p>}
  {m?.map(x=><div key={x.id} className="border border-ink/10 p-4"><p className="font-mono text-xs text-mute">{x.name} · <a className="text-accent" href={`mailto:${x.email}`}>{x.email}</a> · {new Date(x.created_at).toLocaleString()}</p><p className="mt-2 whitespace-pre-line">{x.body}</p><button className="mt-2 font-mono text-[11px] text-red-400" onClick={async()=>{await supabase!.from('messages').delete().eq('id',x.id);load()}}>Delete</button></div>)}</div>}

function Login(){const[e,setE]=useState(''),[p,setP]=useState(''),[err,setErr]=useState(''),[b,setB]=useState(false)
 return<form className="max-w-sm mx-auto mt-32 space-y-4" onSubmit={async ev=>{ev.preventDefault();setB(true);setErr('');const{error}=await supabase!.auth.signInWithPassword({email:e,password:p});if(error)setErr('Sign-in failed. Check your credentials.');setB(false)}}>
  <h1 className="text-3xl font-bold">Admin sign-in</h1>
  <label className="block"><span className="label">Email</span><input required type="email" autoComplete="username" className="field mt-1" value={e} onChange={x=>setE(x.target.value)}/></label>
  <label className="block"><span className="label">Password</span><input required type="password" autoComplete="current-password" className="field mt-1" value={p} onChange={x=>setP(x.target.value)}/></label>
  {err&&<p role="alert" className="text-red-400 text-sm">{err}</p>}<button disabled={b} className="btn btn-p w-full justify-center">{b?'Signing in…':'Sign in'}</button></form>}

export default function Admin(){
 const[s,setS]=useState<Session|null>(null),[ready,setReady]=useState(false),[ok,setOk]=useState<boolean|null>(null),[tab,setTab]=useState('Profile')
 useEffect(()=>{document.title='Admin — Portfolio';if(!supabase)return;supabase.auth.getSession().then(({data})=>{setS(data.session);setReady(true)})
  const{data:l}=supabase.auth.onAuthStateChange((_,x)=>setS(x));return()=>l.subscription.unsubscribe()},[])
 useEffect(()=>{if(!s||!supabase){setOk(null);return};supabase.from('admins').select('user_id').eq('user_id',s.user.id).maybeSingle().then(({data})=>setOk(!!data))},[s])
 if(!supabase)return<main className="p-10 max-w-xl"><h1 className="text-3xl font-bold">Backend not configured</h1><p className="mt-3 text-mute">Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see .env.example) and run <code>supabase/schema.sql</code>.</p></main>
 if(!ready)return<p className="p-10 font-mono text-sm text-mute">Loading…</p>
 if(!s)return<Login/>
 if(ok===null)return<p className="p-10 font-mono text-sm text-mute">Checking permissions…</p>
 if(!ok)return<main className="p-10 max-w-xl"><h1 className="text-3xl font-bold">Not authorised</h1><p className="mt-3 text-mute">This account is not an administrator.</p><button className="btn btn-s mt-6" onClick={()=>supabase!.auth.signOut()}>Sign out</button></main>
 const tabs=[...CFG.map(c=>c.label),'LinkedIn Sync','Messages']
 return<div className="min-h-screen"><header className="border-b border-ink/10 px-5 py-4 flex flex-wrap gap-3 items-center justify-between"><span className="font-mono text-sm tracking-widest">ADMIN<span className="text-accent">.</span></span>
  <div className="flex gap-3"><a className="btn btn-s !py-2" href="/?preview=1" target="_blank" rel="noopener"><Eye size={14}/> Preview (incl. drafts)</a><button className="btn btn-s !py-2" onClick={()=>supabase!.auth.signOut()}><LogOut size={14}/> Sign out</button></div></header>
  <nav aria-label="Admin sections" className="px-5 py-3 flex gap-2 overflow-x-auto border-b border-ink/10">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} aria-current={tab===t} className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest px-3 py-2 ${tab===t?'bg-accent text-bg':'text-mute hover:text-ink'}`}>{t}</button>)}</nav>
  <main className="p-5 md:p-8 max-w-6xl">{tab==='LinkedIn Sync'?<Sync/>:tab==='Messages'?<Messages/>:<Editor key={tab} cfg={CFG.find(c=>c.label===tab)!}/>}</main></div>}
