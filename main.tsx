import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
const Router:any=import.meta.env.VITE_ARTIFACT?MemoryRouter:BrowserRouter
import App from './App'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Router {...(import.meta.env.VITE_ARTIFACT?{}:{basename:import.meta.env.BASE_URL.replace(/\/$/,'')})}><App/></Router></React.StrictMode>)
