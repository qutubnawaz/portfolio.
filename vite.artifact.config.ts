import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
export default defineConfig({ base: './', plugins: [react(), viteSingleFile()], define:{'import.meta.env.VITE_ARTIFACT':'true'}, build:{outDir:'dist-artifact',chunkSizeWarningLimit:5000} })
