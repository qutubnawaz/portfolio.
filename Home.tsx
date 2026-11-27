import Nav from '../components/Nav'
import Hero from '../components/Hero'
import * as S from '../components/Sections'
import { useContent } from '../lib/useContent'
export default function Home(){
 const{data:c,loading,error}=useContent()
 return<><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:bg-accent focus:text-bg focus:p-3">Skip to content</a>
  <Nav/>{error&&<p role="alert" className="fixed top-16 inset-x-0 z-40 bg-bg2 text-center font-mono text-xs text-accent py-2">{error}</p>}
  <main id="main" aria-busy={loading}><Hero p={c.profile} social={c.social}/><S.About c={c}/><S.Projects c={c}/><S.Skills c={c}/><S.Education c={c}/><S.Experience c={c}/><S.Certs c={c}/><S.Achievements c={c}/><S.Contact c={c}/></main>
  <S.Footer name={c.profile.full_name}/></>}
