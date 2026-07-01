# Your Lead Dashboard — Setup Guide

This is a private website that shows your lead numbers. You upload two files
from Privyr every day, and it turns them into charts anyone can view with a
link. No client names, phone numbers, or emails are ever shown — just the
numbers.

You only need to do the setup below **once**. After that, updating it daily
takes 30 seconds.

Two free accounts are needed to make this work — think of them as the two
ingredients:
- **GitHub** — just stores the website's files (like a folder in the cloud)
- **Vercel** — takes those files and turns them into a live, working website

Neither needs a credit card. Both are free for this.

---

## Part 1: One-time setup (about 15 minutes)

### Step 1 — Create a GitHub account

1. Go to [github.com/signup](https://github.com/signup)
2. Enter your email, create a password, pick a username
3. Verify your email when it asks you to

If you already have a GitHub account, just log in and skip to Step 2.

### Step 2 — Create an empty "repository" (just a storage folder)

1. Once logged in, click the **+** icon top-right → **New repository**
2. Name it something like `lead-dashboard`
3. Leave everything else as-is (don't check any boxes)
4. Click **Create repository**
5. You'll land on a page with some grey commands — leave this tab open, come
   back to me and say "I've created the GitHub repository", and I'll push the
   website's files into it for you.

### Step 3 — Create a Vercel account

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Choose **Continue with GitHub** — this links the two accounts together
   automatically, which saves you a step later
3. Approve the permission screen it shows you

### Step 4 — Import your project into Vercel

1. Once logged in to Vercel, click **Add New...** → **Project**
2. Find `lead-dashboard` in the list (the repository from Step 2) and click
   **Import**
3. Leave all settings as they are
4. Click **Deploy**
5. Wait about a minute — Vercel will show a "Congratulations" screen with
   confetti when it's done

You now have a live website! It will show "No data uploaded yet" — that's
expected, we haven't added your leads yet.

### Step 5 — Turn on storage (so your uploads are saved)

This is the one slightly technical step — just follow the clicks exactly:

1. On your project page in Vercel, click the **Storage** tab along the top
2. Click **Create Database**
3. Choose **Blob**
4. Click **Continue**, then **Connect** — accept the defaults
5. Vercel will automatically redeploy your site (you'll see it happen). Wait
   for it to finish.

### Step 6 — Set your upload password

This password protects the *upload* page only — the dashboard itself is
public and doesn't need it. It just stops a stranger from wiping your data if
they ever guessed the upload link.

1. Click the **Settings** tab along the top
2. Click **Environment Variables** on the left
3. In the "Key" box type: `UPLOAD_PASSWORD`
4. In the "Value" box type any password you'll remember, e.g. `Dreams2Realty2026`
5. Click **Save**
6. Go to the **Deployments** tab, click the three dots (⋯) next to the most
   recent deployment, and click **Redeploy** — this makes your new password
   take effect

### Step 7 — Find your dashboard link

1. Click the **Visit** button (or go to the project's overview page) — you'll
   see a web address like `https://lead-dashboard-yourname.vercel.app`
2. That's your dashboard link. Save/bookmark it. This is what you'll share
   with anyone you want to see the numbers.

**Setup is done.** Now let's put your first data in.

---

## Part 2: Uploading your data (do this daily, takes 30 seconds)

1. Open Privyr and export your two files:
   - **Client List Export**
   - **Timeline Activities Export**
2. Go to your dashboard link and add `/upload` to the end of it, e.g.
   `https://lead-dashboard-yourname.vercel.app/upload`
   (Tip: bookmark this exact `/upload` link separately — you'll use it every day.)
3. Click **Choose file** under "Client List Export" and pick that CSV
4. Click **Choose file** under "Timeline Activities Export" and pick that CSV
5. Type in the password you set in Step 6 above
6. Click **Replace Dashboard Data**
7. You'll see a green confirmation message. Click **View dashboard** — it's
   already updated with today's numbers.

That's it. Every time you do this, it completely replaces yesterday's data
with today's — you don't need to delete anything first.

---

## Part 3: Sharing the dashboard

- Share your main link (from Step 7, **without** `/upload` on the end) with
  anyone — team members, partners, whoever. They'll see the dashboard, but
  they cannot upload or change anything.
- Only share the `/upload` link with yourself (or anyone you trust to update
  the data). Anyone with that link would still need your password to actually
  replace the data.
- Works the same on phone and computer — no app needed, just the link in any
  browser.

---

## If something goes wrong

- **"No data uploaded yet"** — you haven't uploaded the two CSVs yet, or
  Step 5 (storage) wasn't completed. Go do Part 2 above.
- **Upload says "Incorrect password"** — re-check Step 6, you may have a typo
  in the password you saved in Vercel.
- **Upload says "Both CSV files are required"** — make sure you selected a
  file under *both* boxes before clicking the button.
- Anything else — send me a screenshot of the error and I'll fix it.
