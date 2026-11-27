import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { seed } from './seed'
import type { Content } from './types'
import { asset } from './asset'
const fix=(c:Content):Content=>({...c,profile:{...c.profile,photo_url:asset(c.profile.photo_url),resume_url:asset(c.profile.resume_url),cv_url:asset(c.profile.cv_url)},projects:c.projects.map(p=>({...p,cover_url:asset(p.cover_url),gallery:(p.gallery||[]).map(g=>asset(g))}))})
const q=(t:string,preview:boolean)=>{let r=supabase!.from(t).select('*');if(!preview)r=r.eq('published',true);return r.order('sort' as never,{ascending:true})}
export function useContent(){
 const [data,setData]=useState<Content>(fix(seed)),[loading,setLoading]=useState(!!supabase),[error,setError]=useState<string|null>(null),[live,setLive]=useState(false)
 useEffect(()=>{ if(!supabase)return; let off=false
  ;(async()=>{try{
   const preview=new URLSearchParams(location.search).has('preview')&&!!(await supabase!.auth.getSession()).data.session
   const names=['projects','skills','education','certifications','achievements','experience','social_links'] as const
   const [pr,...rs]=await Promise.all([supabase!.from('profiles').select('*').eq('id',1).maybeSingle(),...names.map(n=>q(n,preview))])
   const err=[pr,...rs].find(r=>r.error); if(err?.error)throw err.error
   const rows=rs.map(r=>(r.data??[]) as never[]) ; if(off)return
   const any=Boolean(pr.data)||rows.some(r=>r.length)
   if(any){setLive(true);setData(fix({profile:{...seed.profile,...(pr.data??{})} as never,projects:rows[0],skills:rows[1],education:rows[2],certifications:rows[3],achievements:rows[4],experience:rows[5],social:rows[6]} as Content))}
  }catch(e){if(!off)setError('Live content could not be loaded; showing the saved version.')}finally{if(!off)setLoading(false)}})()
  return()=>{off=true}},[])
 return{data,loading,error,live}
}
