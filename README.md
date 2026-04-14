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

## Nielsen's 10 Heuristics — Full Coverage

| # | Heuristic | Implementation |
|---|---|---|
| 1 | Visibility of System Status | Loading spinners, toast confirmations, progress bars in Continue Watching, "Preview unavailable" badge on video failure, My List badge count |
| 2 | Match Between System & Real World | Familiar Netflix-style layout; plain language ("Play", "My List", "Top 10", "New") |
| 3 | User Control & Freedom | Undo toast on list removal (5s window); Esc clears search text first then closes panel; Esc closes all modals |
| 4 | Consistency & Standards | Unified red/dark palette; consistent Lucide icons; ThumbsUp toggles with visual feedback; Skip Intro in player |
| 5 | Error Prevention | Undo available before permanent deletion; genre filter shows item count; no irreversible destructive actions |
| 6 | Recognition Rather Than Recall | Genre chips always visible; Genres dropdown in navbar; My List badge count; recommendation reasons on every card |
| 7 | Flexibility & Efficiency | Full keyboard shortcut system; **Genres dropdown in navbar** for direct genre access; sort + filter options; Ctrl+K search |
| 8 | Aesthetic & Minimalist Design | Clean card grid; information revealed progressively on hover; no visual clutter |
| 9 | Help Users Recognize & Recover | Error boundary crash screen; video fallback thumbnail + badge; **smart search empty state** with query name + genre suggestions |
| 10 | Help & Documentation | `?` key opens shortcuts overlay (focus-managed, Esc to close); tooltips on all navbar icon buttons; onboarding flow |
