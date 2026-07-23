# DecodeLabs — Project 1

A fully responsive, accessible web interface built with **pure semantic HTML5, mobile-first CSS, and vanilla JavaScript**. Zero external libraries. Zero frameworks. Everything from scratch.

> Industrial Training Programme · DecodeLabs · 2026

---

## Live Preview

Open `index.html` directly in your browser — no build step required.

For the **Component Transmitter** (live API feed) to work, start the backend server separately:

```bash
cd Decode_Labs_P2_Backend
npm run dev
```

The backend must be running at `http://localhost:3000`.

---

## Project Structure

```
Decode_Labs_Project1/
├── index.html      # Semantic HTML5 document — single page
├── styles.css      # Mobile-first CSS with design tokens
└── app.js          # Pure vanilla JS — all interactivity
```

---

## Features

### UI & Layout
- **Mobile-first responsive design** — `min-width` breakpoints scale up from mobile, never down
- **CSS Grid** for macro layout structure; **Flexbox** for micro component alignment
- **Design token system** — every color, font, spacing, and shadow value lives in CSS custom properties (`:root`)
- Animated **3D particle field** background rendered on a `<canvas>` element with perspective projection and mouse parallax
- Floating animated **gradient orbs** and mesh overlay for depth

### Navigation
- Sticky header with **hamburger menu** for mobile
- Animated X toggle, outside-click dismissal, and `Escape` key to close
- **Active nav link** tracking via `IntersectionObserver` as the user scrolls through sections
- Smooth scroll-to-section on nav link click

### Dashboard
- **Filterable card grid** — filter by All / Active / Pending / Done
- Animated tab switching with fade transitions
- **Animated progress bars** per card, staggered on render
- Status badges with distinct color coding

### Animations
- **Scroll-triggered entrance animations** using `IntersectionObserver`
- Staggered **page load animations** for hero content
- **3D parallax tilt** on cards — tracks mouse position relative to card center (`rotateX` / `rotateY`)
- **Animated stat counters** with ease-out cubic easing and bounce on completion
- Respects `prefers-reduced-motion` — all animations are skipped when the user has this set

### Forms
- **Contact form** with real-time validation (blur + live re-validation after first touch)
  - Name (min 2 chars), Email (regex), Subject (min 3 chars), Message (10–500 chars)
  - Character counter for the message textarea
  - ARIA live regions for screen reader feedback
  - Shake animation on invalid fields
- **Component Transmitter form** that `POST`s to the backend REST API
  - Live server state feed that auto-refreshes after each submission
  - Graceful error states for network failures and server rejections

### Accessibility
- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA roles, `aria-label`, `aria-expanded`, `aria-live`, `aria-required`, `aria-invalid` throughout
- Keyboard navigation support (Escape, Tab focus management)
- Focus-visible outlines on all interactive elements
- Screen reader announcements for dynamic content updates

### Performance
- **Zero dependencies** — no Bootstrap, no jQuery, no Tailwind
- Explicit image dimensions and lazy loading to minimize CLS
- Debounced resize handler for the canvas particle field
- `IntersectionObserver` used instead of scroll event listeners where possible
- Targets **100/100 Lighthouse** score across Performance, Accessibility, Best Practices, and SEO

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Headline, CTA buttons, and live Web Vitals metrics panel (LCP, CLS, Score) |
| **Stats Bar** | Animated counters — 12 components, 3 breakpoints, 0 frameworks, 100 Lighthouse |
| **Dashboard** | Filterable card grid with progress tracking |
| **Features** | Six core feature cards with tilt animation |
| **Team** | G. Abbas (Frontend Developer) & DecodeLabs (Training Institute) |
| **Component Transmitter** | Form → POST to backend API + live server state feed |
| **Contact** | Fully validated contact form with character counter |

---

## Backend Integration

The Component Transmitter section connects to a separate backend project (`Decode_Labs_P2_Backend`) via REST API.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/components` | Fetch all components |
| `POST` | `/api/components` | Submit a new component |

**POST payload:**
```json
{
  "title": "Component name",
  "purpose": "What it does",
  "layout": "CSS Grid"
}
```

All three fields are required. The server validates and rejects incomplete payloads with a `400` response.

If the backend is not running, the feed section displays a clear error state and the form shows a network error message.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styles | Vanilla CSS (custom properties, Grid, Flexbox) |
| Scripting | Vanilla JavaScript (ES6+, `async/await`, `fetch`) |
| Fonts | Google Fonts — Inter + Playfair Display |
| APIs | `IntersectionObserver`, `requestAnimationFrame`, Canvas 2D |
| Backend (separate) | Node.js / Express (`Decode_Labs_P2_Backend`) |

---

## Author

**G. Abbas** — Frontend Developer  
Industrial Trainee at DecodeLabs, 2026
