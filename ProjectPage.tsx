import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Nav from '../components/Nav'
import { Placeholder, Reveal } from '../components/ui'
import { useJump } from '../lib/nav'
import { useContent } from '../lib/useContent'
export default function ProjectPage(){
 const go=useJump();const[lb,setLb]=useState<string|null>(null);const{slug}=useParams();const{data,loading}=useContent()
 const list=[...data.projects].sort((a,b)=>a.sort-b.sort);const i=list.findIndex(p=>p.slug===slug);const p=list[i];const next=list[(i+1)%list.length]
 useEffect(()=>{window.scrollTo(0,0);if(p){document.title=`${p.title} — Syed Qutub Nawaz`}},[p])
 if(loading)return<><Nav home={false}/><p className="pt-32 px-8 font-mono text-sm text-mute" role="status">Loading project…</p></>
 if(!p)return<><Nav home={false}/><main className="min-h-screen grid place-items-center text-center"><div><p className="label">Not found</p><h1 className="text-4xl font-bold my-4">Project not found</h1><Link className="btn btn-p" to="/" onClick={()=>setTimeout(()=>go('projects'),80)}>All projects</Link></div></main></>
 const isChassis=p.slug==='automotive-car-chassis-design'
 return<><Nav home={false}/><main className="pt-28 pb-24">
  <div className="mx-auto max-w-6xl px-5 md:px-8">
   <Link to="/" onClick={()=>setTimeout(()=>document.getElementById('projects')?.scrollIntoView(),80)} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute hover:text-accent"><ArrowLeft size={14}/> All projects</Link>
   <p className="label mt-10">{p.category}</p>
   <h1 className="mt-3 text-5xl md:text-8xl font-bold tracking-tighter leading-[.95]">{p.title}</h1>
   <p className="mt-6 max-w-2xl text-xl text-mute">{p.summary}</p>
   <div className="mt-10">{p.cover_url?<img src={p.cover_url} alt={`${p.title} main view`} className="w-full max-h-[78vh] object-contain bg-bg2 border border-ink/10"/>:<Placeholder label={isChassis?'Large CAD visualisation — to be supplied':'Hero image — to be supplied'} className={isChassis?'aspect-[21/9] md:aspect-[2.6/1]':'aspect-[21/9]'}/>}</div>
   {p.metrics.length>0&&<div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">{p.metrics.map(m=><div key={m.label} className="bg-bg2 p-6"><p className="text-4xl md:text-5xl font-bold text-accent">{m.value}</p><p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-mute">{m.label}</p></div>)}</div>}
   <div className="mt-16 grid md:grid-cols-[1fr_2fr] gap-12">
    <aside className="space-y-8">{p.tools.length>0&&<div><p className="label">Software & tools</p><ul className="mt-3 space-y-1">{p.tools.map(t=><li key={t}>{t}</li>)}</ul></div>}
     {p.tags.length>0&&<div><p className="label">Focus</p><ul className="mt-3 space-y-1 text-mute">{p.tags.map(t=><li key={t}>{t}</li>)}</ul></div>}</aside>
    <div className="space-y-12">{p.sections.map(s=><Reveal key={s.heading}><h2 className="label">{s.heading}</h2><p className="mt-3 text-lg leading-relaxed whitespace-pre-line">{s.body}</p></Reveal>)}</div>
   </div>
   <section className="mt-20" aria-label="Project gallery"><h2 className="label mb-6">Gallery</h2>
    {p.gallery.length?<div className="columns-1 sm:columns-2 gap-4 [&>button]:mb-4">{p.gallery.map((g,k)=><button key={k} type="button" onClick={()=>setLb(g)} aria-label={`Open ${p.title} image ${k+1} full size`} className="block w-full break-inside-avoid border border-ink/10 hover:border-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><img loading="lazy" src={g} alt={`${p.title} gallery ${k+1}`} className="w-full h-auto block"/></button>)}</div>
    :<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{(isChassis?['CAD render','Front suspension view','Top view','Side view','Technical detail','Assembly']:['Image 1','Image 2']).map(l=><Placeholder key={l} label={l} className="aspect-[4/3]"/>)}</div>}</section>
   {lb&&<div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[70] bg-bg/95 grid place-items-center p-4" onClick={()=>setLb(null)}><button type="button" aria-label="Close image" className="absolute top-4 right-4 btn btn-s !py-2" onClick={()=>setLb(null)}>Close</button><img src={lb} alt="" className="max-w-full max-h-full object-contain"/></div>}
   <Link to={`/projects/${next.slug}`} className="mt-20 flex items-center justify-between border-t border-ink/10 pt-8 group"><span><span className="label block">Next project</span><span className="text-2xl md:text-4xl font-bold group-hover:text-accent transition-colors">{next.title}</span></span><ArrowRight className="text-accent"/></Link>
  </div></main></>}
