# Lead Management Dashboard

A public, macro-level dashboard for Privyr lead data. Upload the two daily CSV
exports and it replaces all existing data instantly — no individual client
names, phone numbers, or emails are ever shown.

## What it shows

1. **Lead Overview** — inflow, source performance, team workload, uncontacted
   leads, lead stages, first response time (overall + by team/date/source/stage).
2. **Team Productivity** — activities by date, team member, and type (Phone
   Call / Message / Note / Other), including crossed breakdowns.
3. **Team Performance Summary** — one table comparing every team member on
   leads, uncontacted %, avg first response, calls, messages, notes.

Filters (date range, source, team member, lead stage) apply live across the
whole dashboard. All uploaded data is shown by default.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Create a `.env.local` with:

```
UPLOAD_PASSWORD=some-password-you-choose
```

Without a `BLOB_READ_WRITE_TOKEN` env var, uploaded data is saved to a local
`.data/latest.json` file (gitignored) — fine for local testing, not used in
production.

## Deploying to Vercel (one-time setup)

1. **Push this project to GitHub.**
   ```bash
   git remote add origin <your-empty-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

2. **Import into Vercel.**
   Go to [vercel.com/new](https://vercel.com/new), sign in, and import the
   GitHub repo you just pushed. Keep the default settings (Next.js is
   auto-detected) and click **Deploy**.

3. **Add Blob storage** (this is what makes uploaded data persist and be
   visible to everyone with the link).
   In the Vercel project → **Storage** tab → **Create Database** → **Blob** →
   connect it to this project. Vercel automatically adds the
   `BLOB_READ_WRITE_TOKEN` environment variable for you — no manual copying
   needed.

4. **Set your upload password.**
   In the Vercel project → **Settings** → **Environment Variables**, add:
   - `UPLOAD_PASSWORD` = a password only you know
   Then redeploy (Vercel will prompt you, or go to **Deployments** → click the
   latest one → **Redeploy**) so the new env var takes effect.

5. **Done.** Your public dashboard is at the URL Vercel gives you (e.g.
   `https://your-project.vercel.app`). Share that link with anyone — they'll
   see the dashboard, read-only.

## Daily update workflow

1. Export the **Client List** and **Timeline Activities** CSVs from Privyr.
2. Go to `https://your-project.vercel.app/upload`.
3. Choose both files, enter your password, click **Replace Dashboard Data**.
4. The public dashboard updates immediately — no redeploy needed.

Anyone with the plain dashboard link can view it, but only someone who knows
`UPLOAD_PASSWORD` can replace the data.
