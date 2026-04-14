# Netflix Redesign — HCI Class Project

A Netflix UI redesign built with React, TypeScript, and Tailwind CSS, focused on improving usability through Nielsen's 10 Usability Heuristics.

**Live Demo:** https://netflix-redesign-pi.vercel.app/

---

## Features

- Genre filtering across all content sections
- Sort by Recommended, Top Rated, or Newest First
- Autoplay video previews with mute/unmute toggle
- Continue Watching with episode progress tracking
- My List with add/remove and undo toast notifications
- Detail modal with trailer preview and full cast info
- Full-screen play screen with Skip Intro and playback controls
- Light/dark theme toggle
- Keyboard shortcuts (`?` to view all shortcuts, `Space`/`K` to play/pause, `M` to mute)
- Onboarding flow to capture genre preferences
- Error boundary for crash recovery
- Responsive grid and list view modes

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

Then open http://localhost:5173 in your browser.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Styling |
| Lucide React | Icons |

---

## HCI Heuristics Addressed

| # | Heuristic | Implementation |
|---|---|---|
| 1 | Visibility of System Status | Loading spinners, toast notifications, progress bars |
| 2 | Match Between System & Real World | Familiar Netflix-style layout and language |
| 3 | User Control & Freedom | Undo on remove, close modals with Esc |
| 4 | Consistency & Standards | Unified color system, consistent icon usage |
| 5 | Error Prevention | Confirmation via undo toasts before permanent actions |
| 6 | Recognition Rather Than Recall | Persistent genre filters, visible My List badge count |
| 7 | Flexibility & Efficiency | Keyboard shortcuts, genre + sort filters |
| 8 | Aesthetic & Minimalist Design | Clean card layout, no unnecessary information |
| 9 | Help Users Recognize & Recover | Error boundary crash screen with reload |
| 10 | Help & Documentation | `?` keyboard shortcut overlay listing all shortcuts |
