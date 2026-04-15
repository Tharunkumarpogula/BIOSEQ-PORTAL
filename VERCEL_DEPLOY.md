# Deploy BioSeq Portal to Vercel

This repo is a Next.js App Router project and deploys cleanly on Vercel.

## 1) Make sure you have Supabase keys

In Supabase:
- Go to **Project Settings → API**
- Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Locally you can keep them in `.env.local`.

## 2) Deploy using the Vercel Dashboard (recommended)

1. Push your code to GitHub (same branch you want to deploy).
2. Go to https://vercel.com/new
3. **Import** the GitHub repo.
4. Framework preset: **Next.js** (auto-detected)
5. Build settings (defaults are fine):
   - Build Command: `next build`
   - Output: handled by Next.js
6. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click **Deploy**.

After deploy:
- If you change env vars, redeploy (or “Redeploy” from Vercel).

## 3) Deploy using Vercel CLI (optional)

Install and login:

```bash
npm i -g vercel
vercel login
```

From the project root:

```bash
vercel
```

When prompted:
- Link to existing project or create a new one
- Set env vars in the Vercel UI (recommended) or via CLI

Production deploy:

```bash
vercel --prod
```

## Common issues

- **Build fails with “Missing Supabase env vars…”**
  - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.

- **Supabase auth redirects / email confirmation**
  - Ensure your Vercel domain is added in Supabase Auth settings (Redirect URLs / Site URL), if you enabled email confirmations.
