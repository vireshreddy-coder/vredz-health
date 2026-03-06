# 🏋️ Vredz Health Hub

Your personal health, workout & meal tracker. Built for you — dark theme, mobile-first, no accounts needed.

## Features

- **Dashboard** — Daily calorie/protein/water rings, quick-add meals, supplement summary
- **Meals** — Log meals, quick-add presets, AI-powered meal suggestions
- **Workout** — Full 6-day split (push/pull/core/legs/recovery/sport), set-by-set logging
- **Habits** — Water tracker, vaping counter, supplement stack checklist, sleep log
- **Progress** — Weekly weigh-ins, body measurements, charts
- **Meal Ideas** — Dubai-friendly high-protein meal library with filters

## Local Development

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo in [vercel.com](https://vercel.com)
3. Deploy — it works out of the box

### Optional: AI Meal Suggestions

To enable the "Ask AI" feature on the Meals page:

1. Go to your Vercel project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = `sk-ant-...` (your key from console.anthropic.com)
3. Redeploy

## Your Targets

| Metric | Target |
|--------|--------|
| Calories | 1,900 kcal/day |
| Protein | 160g/day |
| Water | 3L/day |
| Eating window | 12pm – 7pm |

## Workout Split

| Day | Session |
|-----|---------|
| 1 | Push (Chest · Shoulders · Triceps) |
| 2 | Pull (Back · Biceps) |
| 3 | Core & Abs |
| 4 | Legs (knee-modified) |
| 5 | Active Recovery & Mobility |
| 6 | Sport (Football / Padel) |

## Data

All data is stored in your browser's localStorage — no server, no account, fully private. To share with family on the same device, they can use the same browser. Multi-profile support can be added later.

---
Built with Next.js · Deployed on Vercel
