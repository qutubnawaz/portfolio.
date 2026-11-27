import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
export function useJump(){
 const nav=useNavigate(),{pathname}=useLocation()
 return useCallback((id:string)=>{
  const go=()=>id==='top'?window.scrollTo({top:0}):document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  if(pathname==='/')go();else{nav('/');setTimeout(go,60)}},[nav,pathname])
}
