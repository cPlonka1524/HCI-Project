# Netflix Redesign — HCI Class Project

A Netflix UI redesign built with React, TypeScript, and Tailwind CSS, focused on improving usability through Nielsen's 10 Usability Heuristics and WCAG 2.1 AA accessibility standards.

**Live Demo:** https://netflix-redesign-pi.vercel.app/

---

## Features

- Genre filtering across all content sections (filter bar + **Genres dropdown in navbar** for direct access from any tab)
- Sort by Recommended, Top Rated, or Newest First
- Autoplay video previews with mute/unmute toggle
- Continue Watching with episode progress tracking
- My List with add/remove and undo toast notifications
- Detail modal with trailer preview, full cast info, and "Why We Recommend This" panel
- Full-screen play screen with Skip Intro and playback controls
- Light/dark theme toggle
- Keyboard shortcuts (`?` to view all shortcuts, `Space`/`K` to play/pause, `M` to mute, `Esc` to clear search or close modals)
- Onboarding flow to capture genre preferences
- Error boundary for crash recovery
- Responsive grid and list view modes
- Smart search empty state — shows actual query and genre suggestions when no results found
- Recommendation reasons on every card ("Because you watched X", "Popular in Genre")

---

## Accessibility (WCAG 2.1 AA)

| Criterion | Implementation |
|---|---|
| 1.1.1 Non-text Content | Descriptive alt text on all images; decorative images use empty alt |
| 1.2.2 Captions | `<track kind="captions">` on all video elements (PlayScreen, Hero, DetailModal, ContentCard) |
| 1.3.1 Semantic HTML | `<button>`, `<nav>`, `<header>`, `<select>`, `<ul role="list">` used throughout |
| 1.4.3 Contrast | Dark/light CSS variable system designed to meet 4.5:1 ratio |
| 1.4.4 Resize Text | All font sizes use rem via Tailwind — scales with browser text size |
| 2.1.1 Keyboard | All controls keyboard reachable; full shortcut system |
| 2.1.2 No Keyboard Trap | All modals close on Esc; focus trapped within open modals via Tab cycling |
| 2.4.2 Page Title | `<title>Netflix Redesign</title>` |
| 2.4.3 Focus Order | Modals receive focus on open (DetailModal → close button, Onboarding → first genre button, KeyboardHelp → close button) |
| 2.4.7 Focus Visible | Global `focus-visible` 3px outline; never removed without replacement |
| 3.1.1 Language | `<html lang="en">` present |
| 4.1.2 Name/Role/Value | All icon-only buttons have `aria-label`; toggles use `role="switch"` and `aria-checked` |

This project also used the WAVE Evaluation Tool Chrome Extension to verify in real-time all WCAG 2.1 AA Guideline passes/fails.

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/FGCU-HCI-Netflix/HCI-Project.git
cd HCI-Project

# 2. Install dependencies
npm ci

# 3. Start the dev server
npm run dev
```

Then click on the link displayed to open your browser onto https://localhost:5173/

## Local Media Strategy
Local `.mp4` assets are no longer bundled into the production build.

- In local development, the app can read videos directly from `src/Assets`.
- In production, local-asset cards only appear if you set `VITE_LOCAL_MEDIA_BASE_URL` to a separately hosted media path such as a CDN, object storage bucket, or static file server.
- Add that variable in `.env.local` or your Vercel project settings if you want the local asset row enabled outside development.
