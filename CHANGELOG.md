# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-09-23

### Fixed
- Client-only guard for GSAP plugin to eliminate `process` reference error in browser context.
- Prevented duplicate registration of the `v-split` directive by adding an SSR-safe no-op on server and a client-only directive plugin.

### Changed
- Iterated navbar design (rounded, centered pill, separate logo chip, mobile "Меню" button, hide-on-scroll). Final UI was reverted by request to the original baseline; release captures stable code without experimental UI.

### Maintenance
- General cleanup and type fixes across plugins. Prepared for next UI iteration as a separate track.

## [1.1.0] - 2025-09-22

### Added / Changed
- Navbar: fixed position on scroll, removed brand text, larger logo; later adjusted back to original bar height with logo filling height.
- Branding: replaced logo across app with `/public/content/IMG_3306.PNG`; updated favicons and JSON-LD.
- Content refresh:
  - Home: new hero tagline, updated “О нас” teaser, CTA phone updated to +7 (917) 142-15-74.
  - About: full rewrite with story, features, philosophy (5 principles), archetype/positioning, team rules.
  - Contacts: primary address `г. Самара, ул. Советской Армии, 177`; phone `+7 (917) 142-15-74`; JSON-LD contactPoint updated; map caption updated; branches kept.
- Footer: contact block updated to new address/phone.

### Maintenance
- Cleared Nuxt/Vite caches.

