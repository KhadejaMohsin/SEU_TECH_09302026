# FuenteLuz Demo Dashboard

Vercel URL: https://seu-tech-09302026-swqv.vercel.app/

FuenteLuz is a business dashboard for understanding how AI shopping assistants describe and recommend a company's products. It brings product facts, AI visibility, misinformation issues, scan activity, and suggested improvements together so a team can see what shoppers may hear and what to fix.

This repository is a competition-demo prototype. Product records can come from Supabase, while many visibility scores, impact estimates, issues, and audit events are simulated examples. The standard demo scan does not call a live AI service. This README explains how to set up and try the dashboard. The Next.js app lives in the `autentico-dashboard` folder.

## What You Need

- A computer with Node.js 20.9 or newer and npm installed.
- Access to the Supabase project used by this demo.
- A confirmed Supabase account to sign in to the protected dashboard.

You do not need an OpenAI key to use the standard demo dashboard or create a simulated demo scan.

## Set Up the App

1. Open a terminal in this project folder.
2. Move into the app folder and install its packages:

	```powershell
	cd .\autentico-dashboard
	npm install
	```

3. Create your local settings file only if you do not already have one:

	```powershell
	Copy-Item .env.example .env.local
	```

	If `.env.local` already exists, do not overwrite it. Open it and check that it has these two Supabase settings, filled in with values from the Supabase project settings under **Project Settings > API**:

	```dotenv
	NEXT_PUBLIC_SUPABASE_URL=your-project-url
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
	```

	Keep `.env.local` private. Never put API keys in this README, in a screenshot, or in a `NEXT_PUBLIC_` variable unless they are explicitly intended to be public. Do not use a Supabase service-role/secret key in the browser.

4. Start the local website:

	```powershell
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000). If that port is already being used, Next.js may print another local address, such as `http://localhost:3001`.

Run all npm commands from inside `autentico-dashboard`. If npm says it cannot find `package.json`, check that the terminal is in this folder.

## Sign In

1. Choose **Sign up** and create an account with an email address and password.
2. Confirm the email using the link Supabase sends you.
3. Return to the app and log in at `/auth/login`.
4. A successful login opens `/dashboard`. An already signed-in user who visits `/auth/login` is also sent to `/dashboard`.

The dashboard pages require a signed-in user. `/products` is intentionally public. Supabase row-level security (RLS) still controls which records the signed-in user can read or change; this app does not create or change RLS policies automatically.

## Dashboard Pages

Use the left sidebar to move between these pages:

- `/dashboard` — Overview, with live LunaTech business/product data where available and clearly labeled demo metrics.
- `/dashboard/visibility` — Illustrative assistant visibility, prompts, sources, and recommendations. This is not live AI measurement.
- `/dashboard/issues` — Simulated misinformation examples. Approve and Reject change only the current page's demo state; they are not saved to Supabase.
- `/dashboard/impact` — Modeled impact scenarios. Funnel visits and conversions are illustrative, not measured outcomes.
- `/dashboard/product-feed` — LunaTech product fields read from Supabase. Feed Health and Freshness are illustrative scores. Conflict checks use the latest visible completed scan when available.
- `/dashboard/audit-log` — Simulated governance events, not a live production audit trail.
- `/dashboard/fact-vault` — Prototype section for verified product facts.
- `/dashboard/consulting` — Claro Consulting service information. Scheduling is not connected to a booking system.

The shared top-right **Talk to Claro Consulting** button opens `/dashboard/consulting` from every dashboard page.

## Create a Demo Scan

The **Create Demo Scan** control appears on `/dashboard` while the app is running in development mode. It uses saved demo responses and does not call OpenAI.

Clicking it once makes authenticated Supabase changes:

- Creates one LunaTech scan.
- Selects five active LunaTech questions.
- Saves five simulated response rows labeled as demo data.
- Marks the scan completed when the steps succeed.

Clicking again creates another scan and another set of response rows. Only click when you intend to add another demo run. If the scan or response tables reject the operation, the control displays the error; ask the project administrator to review the appropriate RLS policy rather than sharing a secret key.

The OpenAI provider code is separate from this button. No OpenAI API key is needed for the ordinary demo flow. If you intentionally enable a live OpenAI test, its key must be configured server-side and must never be shared or committed.

## Supabase Data

The dashboard expects the existing Supabase tables to be available, including `businesses`, `products`, `questions`, `scans`, and `responses`. The active demo business is looked up by the exact name **LunaTech Electronics**. Its business row, products, and active questions must be visible to the signed-in account through RLS policies. Scan/response writes also require the relevant authenticated insert/update policies.

If a page says that LunaTech or its products are unavailable, check that the business name matches exactly and that the signed-in account has the required read access. If a demo scan fails with an RLS message, only a Supabase project administrator should review the corresponding policy. No policy is changed by the app.

## Build Check

From the `autentico-dashboard` folder:

```powershell
npm run build
```

To serve a production build locally, run `npm start` after the build completes.

