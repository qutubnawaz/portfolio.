# Syed Qutub Nawaz — Portfolio

React + TypeScript + Tailwind + Framer Motion + Supabase.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only, never the service_role key).
3. `npm run dev`

Without those two values the site shows the built-in content from `src/lib/seed.ts` (read-only; no contact form or admin).

## Supabase setup (once)
1. Create a project at supabase.com.
2. Authentication → Users → Add user: email `qutubnawaz10@gmail.com` + password, tick Auto Confirm.
3. SQL Editor: paste and run `supabase/setup.sql` (schema + your content + admin). Run once.
4. Project Settings → API: copy the URL and anon key into `.env` (and into Vercel/Netlify env vars).

## Deploy (GitHub → Vercel)
1. Push this folder to a GitHub repository.
2. vercel.com → Add New Project → import the repo (framework: Vite).
3. Add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then Deploy.
   `public/_redirects` is for Netlify; for Vercel add nothing, Vite SPA routing works via `vercel.json` below.

## Editing content later
Open `/admin` on the live site and sign in. Add or edit projects, skills, achievements, education, certifications, experience and links, then Save & publish. Upload new resume/CV PDFs in the Profile tab.

Resume and CV PDFs shipped with the site are in `public/`.

## Deploy directly with GitHub Pages
1. Any repository name works. Named `YOUR-USERNAME.github.io` the site is at https://YOUR-USERNAME.github.io; named `portfolio` it is at https://YOUR-USERNAME.github.io/portfolio/ (the workflow sets the base path itself).
2. Repo Settings → Secrets and variables → Actions → New repository secret: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Repo Settings → Pages → Source: GitHub Actions.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes. Check the Actions tab.
