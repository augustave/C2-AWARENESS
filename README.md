# 51

A lightweight, browser-based Command & Control (C2) situational awareness interface inspired by [Anduril's IBCS Maneuver Program](https://www.anduril.com/news/anduril-selected-for-u-s-army-s-integrated-battle-command-system-maneuver-program).

**[Live Demo →](https://augustave.github.io/C2-AWARENESS/)**

![51 Screenshot](Screenshot%202026-04-08%20at%209.53.43%20AM.png)

---

## Overview

A single-page prototype that replicates a three-pane tactical C2 layout with real satellite imagery, live telemetry simulation, and full interactivity — no build step, no backend, no frameworks.

## Features

### Core Interface
- **Three-pane layout** — Left (Needs Review queue), Center (satellite map), Right (track management)
- **Real satellite tiles** via Leaflet + Esri World Imagery
- **Live telemetry simulation** — SPD, RCS, HDG, ALT update every 2s with drift
- **Expandable asset cards** — click to expand with full stats, MGRS coordinates, and action buttons
- **Track queue management** — Pending → Current → Complete lifecycle with E-Stop and Cancel actions

### Map
- **39+ tactical markers** — Friendlies (cyan unit symbols), Hostiles (red diamonds with heading arrows), Unknowns (yellow triangles)
- **Geofence zones** — AO NORTH, KEZ, AO SOUTH with dashed polygons
- **Flight path polylines** — 5 dashed lines showing intercept corridors
- **Hostile network lines** — Red dashed connections between hostile markers
- **Smoke plume** — Multi-layered animated CSS smoke effect at the impact point
- **Persistent hostile callout** — Red-bordered telemetry popup pinned on the map
- **Compass rose** — North indicator overlay

### Interactivity
- **Layer toggles** (top-right) — Show/hide Friendlies, Hostiles, Unknowns, Zones, Paths
- **NVG mode** — Green monochrome night-vision theme toggle
- **Keyboard shortcuts**:
  - `↑/↓` — Cycle through assets
  - `1-8` — Quick-select asset by number
  - `E` — E-Stop first current track
  - `T` — Task selected asset
  - `Esc` — Dismiss callout
- **Drag-to-assign** — Drag asset cards onto track rows to reassign
- **Search filter** — Filter assets by text in the left panel
- **Hover highlight** — Hovering a track row pulses its map marker

### Feedback Systems
- **Real-time distance countdown** — Track distances to target update live via Haversine calculation; pills turn red when < 2km
- **Audio alerts** (Web Audio API, no files) — Beeps on E-Stop/Cancel, urgent double-beep on proximity warning
- **Toast notifications** — Slide-in alerts on state changes (stops, cancellations, proximity warnings)
- **Event timeline** — Bottom bar showing a 10-minute rolling window of events as colored dots

## Tech Stack

| Layer | Tech |
|-------|------|
| Layout | CSS Grid, 3-column + timeline row |
| Map | [Leaflet 1.9.4](https://leafletjs.com/) + [Esri World Imagery](https://www.arcgis.com/) |
| JS | Vanilla ES6, no frameworks |
| Audio | Web Audio API (synthesized beeps) |
| Hosting | GitHub Pages (static) |

## Quick Start

```bash
# Clone
git clone https://github.com/augustave/C2-AWARENESS.git
cd C2-AWARENESS

# Serve (any static server works)
python3 -m http.server 5173
# → open http://localhost:5173
```

Or just open `index.html` directly in a browser.

## File Structure

```
C2-AWARENESS/
├── index.html      # Page structure: 3-pane layout + timeline + layer bar
├── styles.css      # Dark theme, NVG theme, all component styles
├── app.js          # Data, renderers, map init, events, audio, drag-drop
└── README.md
```

## Project Context

This prototype was built as a lightweight reference implementation of a C2 awareness display, demonstrating how modern browser APIs (Leaflet, Web Audio, CSS Grid, drag-and-drop) can deliver a tactically-styled interface with zero dependencies beyond a CDN-loaded map library.

---

**Disclaimer:** This is a UI prototype with simulated data. Not affiliated with Anduril Industries.
