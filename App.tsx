import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
const Admin=import.meta.env.VITE_ARTIFACT?(()=>null):lazy(()=>import('./pages/Admin'))
export default function App(){return(
 <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/projects/:slug" element={<ProjectPage/>}/>
  <Route path="/admin/*" element={<Suspense fallback={<p className="p-10 font-mono text-sm text-mute">Loading admin…</p>}><Admin/></Suspense>}/>
  <Route path="*" element={<div className="min-h-screen grid place-items-center text-center"><div><p className="label">404</p><h1 className="text-5xl font-bold my-4">Page not found</h1><Link className="btn btn-p" to="/">Back home</Link></div></div>}/>
 </Routes>)}
