import { motion } from 'framer-motion'
import { ArrowDownRight, Download, Linkedin, Mail } from 'lucide-react'
import type { Profile, Social } from '../lib/types'
import { Placeholder } from './ui'
import { useJump } from '../lib/nav'
export default function Hero({p,social}:{p:Profile;social:Social[]}){
 const go=useJump();const li=social.find(s=>/linkedin/i.test(s.label))?.url
 const [first,...rest]=p.full_name.split(' ')
 return(<section id="top" className="relative min-h-screen pt-28 pb-16 grid-bg flex items-center">
  <div className="mx-auto max-w-6xl px-5 md:px-8 w-full grid lg:grid-cols-[1.4fr_1fr] gap-12 items-end">
   <div>
    <motion.p initial={{opacity:0}} animate={{opacity:1}} className="label">Mechanical Engineering · Thermal · Production — {p.location}</motion.p>
    <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:.8}} className="mt-5 text-[15vw] sm:text-7xl lg:text-[7.5rem] leading-[.9] font-bold tracking-tighter">{first}<br/><span className="text-accent">{rest.join(' ')}</span></motion.h1>
    <motion.h2 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}} className="mt-8 text-2xl md:text-4xl font-medium">{p.headline}</motion.h2>
    <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55}} className="mt-5 max-w-xl text-mute leading-relaxed">{p.intro}</motion.p>
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7}} className="mt-10 flex flex-wrap gap-3">
     <a href="#projects" onClick={e=>{e.preventDefault();go('projects')}} className="btn btn-p">View Projects <ArrowDownRight size={16}/></a>
     <a href="#contact" onClick={e=>{e.preventDefault();go('contact')}} className="btn btn-s"><Mail size={16}/> Contact Me</a>
     {p.resume_url&&<a href={p.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn-s"><Download size={16}/> Resume</a>}
     {li&&<a href={li} target="_blank" rel="noopener noreferrer" className="btn btn-s"><Linkedin size={16}/> LinkedIn</a>}
    </motion.div>
   </div>
   <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{delay:.3,duration:.8}} className="max-w-sm lg:max-w-none">
    {p.photo_url?<img src={p.photo_url} alt={`Portrait of ${p.full_name}`} className="w-full aspect-[4/5] object-cover object-[50%_25%] border border-ink/10"/>:<Placeholder label="Profile portrait" className="aspect-[4/5]"/>}
    <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-mute">{p.tagline}</p>
   </motion.div>
  </div></section>)}
