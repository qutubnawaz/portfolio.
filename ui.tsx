import { motion } from 'framer-motion'
import { ImageIcon } from 'lucide-react'
import type { ReactNode } from 'react'
export const Reveal=({children,delay=0,className=''}:{children:ReactNode;delay?:number;className?:string})=>
 <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.6,delay,ease:[.2,.7,.2,1]}}>{children}</motion.div>
export const SectionHead=({n,label,title}:{n:string;label:string;title:string})=>
 <Reveal className="mb-12 md:mb-16"><p className="label">{n} / {label}</p><h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">{title}</h2></Reveal>
export const Section=({id,children,alt}:{id:string;children:ReactNode;alt?:boolean})=>
 <section id={id} className={`py-24 md:py-32 scroll-mt-16 ${alt?'bg-bg2':''}`}><div className="mx-auto max-w-6xl px-5 md:px-8">{children}</div></section>
export const Empty=({text}:{text:string})=><p className="border border-dashed border-ink/20 p-8 font-mono text-sm text-mute">{text}</p>
/** Clearly-labelled placeholder used wherever no real image has been supplied. */
export const Placeholder=({label,className=''}:{label:string;className?:string})=>
 <div role="img" aria-label={`Placeholder: ${label}`} className={`relative grid-bg bg-bg2 border border-ink/10 grid place-items-center overflow-hidden ${className}`}>
  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#FF6B35" strokeWidth="1"><circle cx="200" cy="120" r="70"/><circle cx="200" cy="120" r="40"/><path d="M20 120h360M200 10v220" strokeDasharray="6 6"/></svg>
  <div className="relative text-center px-4"><ImageIcon className="mx-auto mb-2 text-accent" size={22} aria-hidden/><p className="font-mono text-[11px] uppercase tracking-widest text-mute">Placeholder · {label}</p></div>
 </div>
