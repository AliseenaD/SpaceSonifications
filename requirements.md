# Project Requirements — NASA Sonification

## Overview
A web application that allows users to listen to NASA space image sonifications and create their own by uploading custom space images. The app converts visual image data into sound by scanning images left to right, mapping pixel brightness to volume and vertical position to pitch. The project is small-scale (2–3 users) but should be built to professional full-stack standards.

---

## Tech Stack
- **Frontend:** React (Vite), React Router v6
- **Audio:** Tone.js (client-side sonification, Web Audio API)
- **Backend/Database:** Supabase (Postgres, Auth, Storage)
- **Hosting:** Vercel
- **PWA:** manifest.json + service worker for home screen installation on iOS

---

## Pages

### `/` — Landing Page
- Full-bleed hero banner with space image background
- Headline: "THE COSMOS, IN SOUND"
- Subtext: "Upload an image of space. We'll turn it into music."
- CTA button linking to `/listen`
- Preview row of featured sonification cards
- Section with description text and CTA linking to `/create`

### `/listen` — Library Page
- Grid of all public sonification clips (NASA + custom)
- Each card displays: space image, title, date, NASA/Custom badge, play button, favorite button
- Clicking a card opens a modal with: large image, title, date created, play/pause, loop toggle, favorite button
- Search bar to filter by title
- Filter pills: All / NASA / Custom
- Sort: Newest / Oldest
- Favorite button only active when signed in; prompts sign-in otherwise

### `/create` — Create Page
- Space image banner header (consistent with other pages)
- "How it works" collapsible section (4 steps: Upload, Tune, Preview, Save)
- Image upload via drag-and-drop or file browser
- Canvas preview of uploaded image with animated scan line during playback
- Preview (play/stop) button
- **Sound controls:**
  - Scan Speed (slider: Fast → Slow)
  - Scale (dropdown: Pentatonic, Major, Minor, Whole Tone)
  - Tone / Oscillator (buttons: Smooth, Warm, Hollow, Rich, Metallic)
  - Reverb (slider: Dry → Space)
- Save panel: title input + save button (disabled until image uploaded and title entered)
- Saving uploads image + rendered audio blob to Supabase Storage and inserts a row into the `clips` table
- Requires authentication to save

### `/account` — Account Page
- Requires authentication; redirects to `/signin` if not signed in
- Profile banner (selectable from 4 space image options)
- Avatar showing user initials (or photo if set), email, created/favorited counts
- Tab toggle: My Sounds / Favorited
- Both tabs render the same card grid, filtered by ownership or favorites
- Sign out button with confirmation modal

### `/signin` — Sign In Page
- Supabase Auth (email/password or magic link)
- Nav account link toggles between `/signin` and `/account` based on auth state

---

## Database Schema (Supabase)

### `clips`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| title | text | |
| source | enum | `nasa` or `custom` |
| image_url | text | Supabase Storage URL |
| audio_url | text | Supabase Storage URL |
| created_at | timestamp | |

### `favorites`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| clip_id | uuid | FK → clips.id |
| created_at | timestamp | |

---

## Sonification Logic (Client-Side)
- Image is drawn to a hidden canvas and sampled at 80 columns × 36 rows
- Each column = one time step, scanned left to right using `Tone.Transport`
- Per column, up to 4 brightest pixels (above brightness threshold) are selected
- Pixel row → pitch (mapped to selected musical scale across octaves 2–6)
- Pixel brightness → volume (range: −38dB to −6dB)
- Audio routed through `Tone.FeedbackDelay` → `Tone.Reverb` → destination
- Output recorded via `MediaRecorder` for upload as audio blob
- iOS Safari: `AudioContext.resume()` called on user gesture before playback

---

## Design System
- **Background:** `#05090f`
- **Surface/Cards:** `#0a1520`
- **Primary accent:** `#2ba8d4`
- **Hover/glow:** `#5ecfea`
- **CTA/Action:** `#e8734a`
- **Text:** `#e8f4f8`
- **Muted text:** `#4a7a8a`
- **Font:** Segoe UI (body), Orbitron or Exo 2 (headings)
- Cards use full-bleed images with a `linear-gradient` overlay fading to `#05090f`
- Glassmorphism (`backdrop-filter: blur`) used on the create page panels
- Page header pattern: space image banner with gradient fade, eyebrow label + page title overlaid bottom-left

---

## Frontend Architecture

### MVVM Pattern
The frontend follows an MVVM (Model-View-ViewModel) architecture:
- Each main page has a dedicated custom hook that acts as its ViewModel, containing all logic and state for that page
- The page component itself is purely presentational — it receives state and functions from its hook and passes them down to children
- Child components receive everything they need via props; they do not fetch or derive their own data if it can come from the parent hook

### Component & Hook Rules
- **Reuse components wherever possible.** If two pages need the same UI element, it lives in a shared `components/` folder
- **Small components** may contain minimal local state only if the logic is purely self-contained and has no use outside that component (e.g. a hover state, a toggle)
- **Complex components** that require substantial logic (e.g. the image drop/upload zone) get their own dedicated hook used exclusively by that component
- Page-level hooks handle all data fetching, Supabase calls, audio logic, and derived state for their respective page

### useEffect Policy
- `useEffect` should be avoided unless absolutely necessary
- Acceptable uses: initializing the Tone.js audio context on mount, setting up event listeners with no reactive alternative, syncing with a non-React external system
- Never use `useEffect` to derive state from other state — use `useMemo` instead
- Never use `useEffect` to respond to user events — use event handlers instead

### Documentation
- Every function, interface, and type must have a concise JSDoc comment above it
- Comments should describe **what** it does and **why** if non-obvious — not restate the code
- Keep it brief: one to two lines for the description is ideal, three max
- All function parameters must be documented with `@param` and a short description
- Example:
```ts
/**
 * Maps a pixel row index to a frequency in the given scale.
 * @param row - The pixel row index from the processed canvas
 * @param totalRows - Total number of sampled rows in the image
 * @param scale - Sorted array of frequencies to map onto
 */
const getFrequencyFromRow = (row: number, totalRows: number, scale: number[]): number => { ... }

/** Represents a single saved sonification clip in the library. */
interface Clip { ... }
```

### Formatting
- Prettier is used for all source files under `src/`
- A `.prettierrc` config file must be present at the project root
- Prettier runs automatically on save (via editor integration) and as a pre-commit check
- All contributors must have the Prettier extension installed in their editor

### Styling
- CSS Modules for all styling (`PageName.module.css`)
- One CSS module file per page and per component
- No global inline styles beyond truly dynamic values (e.g. a scan line `left` percentage driven by playback progress)
- Design tokens (colors, spacing, typography) defined as CSS custom properties in a single `global.css`

---

## Non-Functional Requirements
- Mobile-first responsive layout; installable as PWA on iOS via Add to Home Screen
- No server-side audio processing — all sonification runs in the browser
- Supabase free tier is sufficient for expected usage
- Row-level security (RLS) enabled on Supabase tables
- Vercel for hosting and CI/CD via GitHub