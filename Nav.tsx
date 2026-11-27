import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useJump } from '../lib/nav'
const links=[['about','About'],['projects','Projects'],['skills','Skills'],['education','Education'],['experience','Experience'],['contact','Contact']]
export default function Nav({home=true}:{home?:boolean}){
 const [open,setOpen]=useState(false); const go=useJump(); void home
 return(<header className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur border-b border-ink/10">
  <nav aria-label="Primary" className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
   <a href="#top" onClick={e=>{e.preventDefault();go('top')}} className="font-mono text-sm tracking-widest">SQN<span className="text-accent">.</span></a>
   <ul className="hidden md:flex gap-8">{links.map(([id,l])=><li key={id}><a className="font-mono text-xs uppercase tracking-widest text-mute hover:text-accent transition-colors" href={`#${id}`} onClick={e=>{e.preventDefault();go(id)}}>{l}</a></li>)}</ul>
   <button className="md:hidden p-2" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </nav>
  {open&&<ul className="md:hidden bg-bg border-t border-ink/10 px-5 py-4 space-y-4">{links.map(([id,l])=><li key={id}><a onClick={e=>{e.preventDefault();setOpen(false);go(id)}} className="font-mono text-sm uppercase tracking-widest" href={`#${id}`}>{l}</a></li>)}</ul>}
 </header>)}
