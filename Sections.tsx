import { ArrowUpRight, Download, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Empty, Placeholder, Reveal, Section, SectionHead } from './ui'
import type { Content } from '../lib/types'
import { supabase } from '../lib/supabase'

export const About=({c}:{c:Content})=><Section id="about" alt><SectionHead n="01" label="About" title="The journey so far."/>
 <div className="grid md:grid-cols-[1fr_2fr] gap-10"><Reveal><dl className="font-mono text-xs uppercase tracking-widest space-y-4 text-mute"><div><dt className="text-accent">Based in</dt><dd className="mt-1 text-ink">{c.profile.location}</dd></div>{!!c.profile.languages?.length&&<div><dt className="text-accent">Languages</dt><dd className="mt-1 text-ink normal-case tracking-normal font-sans text-sm space-y-1">{c.profile.languages.map(l=><p key={l}>{l}</p>)}</dd></div>}
 {c.profile.resume_url&&<a className="btn btn-s" href={c.profile.resume_url} target="_blank" rel="noopener noreferrer"><Download size={14}/> Resume (PDF)</a>}
 {c.profile.cv_url&&<a className="btn btn-s" href={c.profile.cv_url} target="_blank" rel="noopener noreferrer"><Download size={14}/> CV (PDF)</a>}</dl></Reveal>
 <Reveal delay={.1}><div className="space-y-5 text-lg leading-relaxed text-ink/90">{c.profile.about.map((t,i)=><p key={i}>{t}</p>)}</div></Reveal></div></Section>

export const Projects=({c}:{c:Content})=><Section id="projects"><SectionHead n="02" label="Projects" title="Selected work."/>
 {!c.projects.length?<Empty text="No projects published yet."/>:<div className="grid md:grid-cols-2 gap-6">{[...c.projects].sort((a,b)=>a.sort-b.sort).map((p,i)=>
 <Reveal key={p.slug} delay={(i%2)*.08} className={p.featured&&i===0?'md:col-span-2':''}>
  <Link to={`/projects/${p.slug}`} className="group block bg-bg2 border border-ink/10 hover:border-accent transition-colors h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
   <div className="overflow-hidden">{p.cover_url?<img loading="lazy" src={p.cover_url} alt={`${p.title} cover`} className={`w-full object-contain bg-bg ${i===0?'aspect-[21/9]':'aspect-[16/9]'}`}/>:<Placeholder label="Project image" className={i===0?'aspect-[21/9]':'aspect-[16/9]'}/>}</div>
   <div className="p-6 md:p-8"><p className="label">{String(i+1).padStart(2,'0')} · {p.category}</p>
    <h3 className="mt-3 text-2xl md:text-3xl font-bold flex items-start justify-between gap-4">{p.title}<ArrowUpRight className="shrink-0 text-mute group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"/></h3>
    <p className="mt-3 text-mute">{p.summary}</p>
    <div className="mt-5 flex flex-wrap gap-2">{[...p.tools,...p.tags].map(t=><span key={t} className="font-mono text-[10px] uppercase tracking-widest border border-ink/15 px-2 py-1 text-mute">{t}</span>)}</div></div>
  </Link></Reveal>)}</div>}</Section>

export const Skills=({c}:{c:Content})=>{const cats=Array.from(new Set([...c.skills].sort((a,b)=>a.sort-b.sort).map(s=>s.category)))
 return<Section id="skills" alt><SectionHead n="03" label="Skills" title="Technical capabilities."/>
 {!cats.length?<Empty text="No skills published yet."/>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">{cats.map(cat=><Reveal key={cat} className="bg-bg2 p-6"><h3 className="label">{cat}</h3><ul className="mt-4 space-y-2">{c.skills.filter(s=>s.category===cat).sort((a,b)=>a.sort-b.sort).map(s=><li key={s.name} className="flex gap-3"><span className="text-accent font-mono">▸</span><span>{s.name}{!!s.learned_from?.length&&<span className="block font-mono text-[10px] uppercase tracking-wider text-mute mt-0.5">Learned from: {s.learned_from.join(' · ')}</span>}</span></li>)}</ul></Reveal>)}</div>}</Section>}

export const Education=({c}:{c:Content})=><Section id="education"><SectionHead n="04" label="Education" title="Academic timeline."/>
 {!c.education.length?<Empty text="No education entries published yet."/>:<ol className="border-l border-accent/50 ml-2 space-y-10">{[...c.education].sort((a,b)=>a.sort-b.sort).map(e=><Reveal key={e.degree}><li className="pl-8 relative"><span className="absolute -left-[5px] top-2 size-2.5 bg-accent"/><p className="label">{e.period}</p><h3 className="mt-2 text-2xl font-bold">{e.degree}</h3>{e.institution&&<p className="text-mute">{e.institution}</p>}{e.note&&<p className="mt-1 font-mono text-xs text-mute">{e.note}</p>}</li></Reveal>)}</ol>}</Section>

export const Experience=({c}:{c:Content})=><Section id="experience" alt><SectionHead n="05" label="Experience & Activities" title="In the field."/>
 {!c.experience.length?<Empty text="No activities published yet."/>:<div className="divide-y divide-ink/10 border-y border-ink/10">{[...c.experience].sort((a,b)=>a.sort-b.sort).map(x=><Reveal key={x.title}><div className="grid md:grid-cols-[1fr_2fr] gap-4 py-8"><div><p className="label">{x.date_label}</p>{x.org&&<p className="mt-1 text-mute">{x.org}</p>}</div><div><h3 className="text-xl font-bold">{x.title}</h3><p className="mt-2 text-mute">{x.description}</p></div></div></Reveal>)}</div>}</Section>

export const Certs=({c}:{c:Content})=><Section id="certifications"><SectionHead n="06" label="Certifications & Training" title="Training."/>
 {!c.certifications.length?<Empty text="No training records published yet."/>:<div className="grid md:grid-cols-2 gap-6">{c.certifications.map(x=><Reveal key={x.title}><div className="bg-bg2 border border-ink/10 p-6 h-full"><p className="label">{x.year||'Training'}</p><h3 className="mt-2 text-xl font-bold">{x.title}</h3>{x.issuer&&<p className="text-mute">{x.issuer}</p>}{x.note&&<p className="mt-2 font-mono text-xs text-mute">{x.note}</p>}</div></Reveal>)}</div>}</Section>

export const Achievements=({c}:{c:Content})=><Section id="achievements" alt><SectionHead n="07" label="Achievements" title="Milestones."/>
 {!c.achievements.length?<Empty text="No documented achievements yet. This section will be updated as they are added."/>:<div className="grid md:grid-cols-2 gap-6">{c.achievements.map(x=><Reveal key={x.title}><div className="border border-ink/10 p-6 h-full"><p className="label">{x.year}</p><h3 className="mt-2 text-xl font-bold">{x.title}</h3><p className="text-mute mt-1">{x.description}</p></div></Reveal>)}</div>}</Section>

export function Contact({c}:{c:Content}){
 const em=(c.social.find(s=>s.url.startsWith('mailto:'))?.url.slice(7))||'qutubnawaz10@gmail.com'
 const li=c.social.find(s=>/linkedin/i.test(s.url))?.url||'https://www.linkedin.com/in/syed-qutub-nawaz/'
 const mail='mailto:'+em+'?subject='+encodeURIComponent('Hello Qutub, reaching out from your portfolio')
 return<Section id="contact"><SectionHead n="08" label="Contact" title="Let’s build something."/>
 <Reveal><p className="text-mute max-w-md">Open to conversations about engineering projects, internships and collaboration. Choose how you want to reach me.</p>
  <div className="mt-8 flex flex-wrap gap-4"><a className="btn btn-p" href={mail}><Mail size={16}/>Email me</a><a className="btn" href={li} target="_blank" rel="noopener noreferrer"><Linkedin size={16}/>Message on LinkedIn<ArrowUpRight size={14}/></a></div>
  <p className="mt-6 inline-flex items-center gap-3 flex-wrap text-sm text-mute"><span>Email not opening? Copy it:</span><span className="select-all text-ink">{em}</span><button type="button" className="font-mono text-[11px] uppercase tracking-widest text-accent" onClick={()=>navigator.clipboard?.writeText(em).catch(()=>{})}>Copy</button></p>
 </Reveal></Section>}

export const Footer=({name}:{name:string})=><footer className="border-t border-ink/10 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-mute">© {new Date().getFullYear()} {name} {supabase&&<> · <a className="hover:text-accent" href={import.meta.env.BASE_URL+'admin'}>Admin</a></>}</footer>
