import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
type Row=Record<string,any>
/**
 * LinkedIn status: no official LinkedIn API integration is implemented. LinkedIn's
 * self-serve products (e.g. Sign In with OpenID Connect) expose only basic identity data
 * (name, email, photo), not experience/education/projects. So this tab provides the
 * fallback workflow: upload the LinkedIn "Save to PDF" export -> extract text ->
 * review & edit -> publish. Nothing is reported as "synced" unless it was saved.
 */
async function pdfText(file:File){
 const pdfjs=await import('pdfjs-dist')
 const worker=(await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
 pdfjs.GlobalWorkerOptions.workerSrc=worker
 const doc=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise
 let t='';for(let i=1;i<=doc.numPages;i++){const c=await (await doc.getPage(i)).getTextContent();t+=c.items.map((x:any)=>x.str).join(' ')+'\n'}
 return t.trim()
}
export default function Sync(){
 const[logs,setLogs]=useState<Row[]>([]),[drafts,setDrafts]=useState<Row[]>([]),[sel,setSel]=useState<Row|null>(null),[f,setF]=useState({headline:'',intro:'',about:''}),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
 const load=async()=>{const[a,b]=await Promise.all([supabase!.from('sync_logs').select('*').order('created_at',{ascending:false}).limit(10),supabase!.from('sync_drafts').select('*').eq('status','pending').order('created_at',{ascending:false})]);setLogs(a.data??[]);setDrafts(b.data??[])}
 useEffect(()=>{load()},[])
 const log=(status:string,imported:string[],failed:string[],message:string)=>supabase!.from('sync_logs').insert({source:'linkedin_pdf',status,imported,failed,message})
 const onFile=async(file?:File)=>{if(!file)return;setBusy(true);setMsg('')
  try{const raw=await pdfText(file);if(!raw)throw new Error('No text found in this PDF.')
   const{error}=await supabase!.from('sync_drafts').insert({source:'linkedin_pdf',raw_text:raw,fields:{}});if(error)throw error
   await log('partial',['raw_text'],['headline','intro','about'],'PDF text extracted; awaiting manual review.');setMsg('PDF extracted into a draft. Review it below.')}
  catch(e:any){await log('failed',[],['pdf'],String(e.message||e));setMsg('Import failed: '+(e.message||e)+'. Your live portfolio is unchanged.')}
  setBusy(false);load()}
 const publish=async()=>{if(!sel)return;setBusy(true);const imp:string[]=[];const patch:Row={id:1}
  if(f.headline.trim()){patch.headline=f.headline.trim();imp.push('headline')}
  if(f.intro.trim()){patch.intro=f.intro.trim();imp.push('intro')}
  if(f.about.trim()){patch.about=f.about.split('\n').map(s=>s.trim()).filter(Boolean);imp.push('about')}
  if(!imp.length){setMsg('Nothing to publish: fill at least one field.');setBusy(false);return}
  const{error}=await supabase!.from('profiles').upsert(patch)
  if(error){await log('failed',[],imp,error.message);setMsg('Publish failed: '+error.message)}
  else{await supabase!.from('sync_drafts').update({status:'published',fields:f}).eq('id',sel.id);await log('success',imp,[],'Reviewed draft published to profile.');setMsg('Published to profile.');setSel(null)}
  setBusy(false);load()}
 const last=(s:string)=>logs.find(l=>l.status===s)?.created_at
 const d=(x?:string)=>x?new Date(x).toLocaleString():'Never'
 return<div className="space-y-8 max-w-3xl">
  <div className="border border-ink/10 p-5 space-y-2 font-mono text-xs"><p><span className="text-accent">Connection:</span> LinkedIn API — <strong>not connected</strong>. LinkedIn’s official APIs do not provide full profile data (experience, education, projects) to personal-site apps, so automatic sync is not enabled.</p>
   <p><span className="text-accent">Last successful sync:</span> {d(last('success'))}</p><p><span className="text-accent">Last attempted sync:</span> {d(logs[0]?.created_at)}</p>
   <p><span className="text-accent">Imported fields (latest):</span> {logs[0]?.imported?.join(', ')||'—'}</p><p><span className="text-accent">Failed fields (latest):</span> {logs[0]?.failed?.join(', ')||'—'}</p></div>
  <div><h2 className="label">Import from LinkedIn PDF</h2><p className="text-sm text-mute mt-2">LinkedIn → Me → View profile → More → Save to PDF. Upload it here; text is extracted into a draft you review before anything goes live.</p>
   <input type="file" accept="application/pdf" disabled={busy} className="mt-3 text-sm" onChange={e=>onFile(e.target.files?.[0])}/></div>
  {msg&&<p role="status" className="font-mono text-xs text-accent">{msg}</p>}
  <div><h2 className="label">Pending drafts</h2>{!drafts.length&&<p className="mt-2 font-mono text-xs text-mute">None.</p>}
   <ul className="mt-2 space-y-1">{drafts.map(x=><li key={x.id}><button className="text-sm underline" onClick={()=>{setSel(x);setF({headline:'',intro:'',about:''})}}>Draft · {d(x.created_at)}</button></li>)}</ul></div>
  {sel&&<div className="space-y-4"><div><p className="label">Extracted text (reference)</p><pre className="mt-1 max-h-64 overflow-auto bg-bg2 p-3 text-xs whitespace-pre-wrap">{sel.raw_text}</pre></div>
   {(['headline','intro','about'] as const).map(k=><label key={k} className="block"><span className="label">{k}{k==='about'?' (one paragraph per line)':''}</span>{k==='headline'?<input className="field mt-1" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>:<textarea rows={4} className="field mt-1" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>}</label>)}
   <div className="flex gap-3"><button disabled={busy} className="btn btn-p" onClick={publish}>Review & publish</button><button className="btn btn-s" onClick={async()=>{await supabase!.from('sync_drafts').update({status:'discarded'}).eq('id',sel.id);setSel(null);load()}}>Discard</button></div></div>}
  <div><h2 className="label">Recent log</h2><ul className="mt-2 space-y-1 font-mono text-xs text-mute">{logs.map(l=><li key={l.id}>{d(l.created_at)} · {l.status} · {l.message}</li>)}{!logs.length&&<li>No sync attempts yet.</li>}</ul></div></div>}
