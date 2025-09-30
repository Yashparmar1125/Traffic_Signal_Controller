## Smart City Traffic Control System — Interactive Demo

An interactive, educational simulation of a 4-road intersection demonstrating core Distributed Systems concepts applied to urban traffic management: centralized control, coordinated timing, phased transitions, deadlock simulation, failover, and state consistency.

Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

---

### Highlights
- **Realistic signal model**: 4 roads (R1–R4) with vehicle and pedestrian signals.
- **Modes**: Normal cycle, Emergency vehicle priority, VIP priority, Deadlock simulation.
- **Controller logic**: Pair-wise switching with safe yellow→red→green transitions.
- **Clock/DB visualization**: Visual indicators for clock sync and shared state.
- **Accessible UI**: Clear state indicators; keyboard-friendly controls (see A11y section).

---

### Quick Start
1) Install Node.js LTS (v18+ recommended).

2) Install dependencies:
```sh
npm i
```

3) Start the dev server:
```sh
npm run dev
```

4) Build for production:
```sh
npm run build && npm run preview
```

---

### Project Structure
```text
src/
  App.tsx              # Providers (React Query, Router, Toasts)
  main.tsx             # App bootstrap
  index.css            # Theme tokens, components, animations (Tailwind layers)
  components/
    TrafficIntersection.tsx  # Core visualization + auto/pair controller logic
    ControlPanel.tsx          # Manual controls, modes, transitions
    TaskSidebar.tsx           # Task navigation
    TrafficLight.tsx          # Light atom
    PedestrianSignal.tsx      # Pedestrian atom
    Vehicle.tsx               # Vehicle badges (normal/emergency/VIP)
    ui/…                      # shadcn/ui primitives
  pages/
    Index.tsx          # Main page composing Sidebar + Intersection + Panel
    NotFound.tsx       # 404
  lib/utils.ts         # Tailwind className helper
```

---

### Core Concepts Demonstrated
- **Task 1 — Traffic Signals**: Single-green policy; pedestrians walk when their road is red.
- **Task 2 — Central Controller**: Pair-wise switching between (R1,R3) and (R2,R4) with phased transitions (yellow→red→green) for safety.
- **Task 3 — Coordination**: Multi-signal coordination visualized across the intersection grid.
- **Task 4 — Clock Sync**: Visual clock indicator suggesting synchronized timing.
- **Task 5 — Critical Section**: Only one road may be “in the intersection” at a time.
- **Task 6 — Deadlock**: Simulate and resolve contention.
- **Task 7 — Load Balancing**: Primary/Backup controllers with a ZooKeeper indicator.
- **Task 8 — Consistency**: Database icon representing shared state across controllers.

---

### How It Works
- State is owned by `pages/Index.tsx` as `intersectionState` and `activeTask`.
- `TrafficIntersection` renders the grid and derives each road’s light state via `getRoadStatus(road)`, considering current task and modes.
- Normal auto-cycle: advances the active road periodically when not in special modes or during transitions.
- Task 2 controller: switches pairs (13 ↔ 24) with a timed sequence:
  1) Outgoing pair turns yellow
  2) Then red
  3) Then opposite pair becomes active
- `ControlPanel` exposes manual road selection with the same safe transition when crossing pairs, plus Emergency/VIP toggles and Deadlock simulation.

---

### Scripts
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run build:dev` — Development-mode build
- `npm run preview` — Preview production build
- `npm run lint` — Lint the project

---

### Technology Stack
- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui (Radix UI under the hood)
- React Router, React Query

---

### Architecture Notes
- UI is split into three main surfaces: `TaskSidebar`, `TrafficIntersection`, and `ControlPanel`.
- Styling uses HSL CSS variables for dark/light theming and consistent design tokens.
- Animations (e.g., emergency flash, VIP glow, sync pulse) are declared in Tailwind layers and referenced as utility classes.

---

### Accessibility (A11y)
- Use descriptive labels for interactive controls (e.g., “Road R1”).
- Consider adding ARIA status text to traffic/pedestrian signals (e.g., “R1: green”).
- Provide motion-reduced fallbacks for flashing/bounce animations using `prefers-reduced-motion`.

---

### Development Tips
- Prefer functional state updates when deriving from previous state:
  ```ts
  onStateChange(prev => ({ ...prev, activeRoad: 2 }))
  ```
- Keep timers and timeouts managed via `useRef` and clear them on effect cleanup to avoid overlaps.
- Narrow React `useEffect` dependencies to only what’s required; avoid re-creating intervals unnecessarily.
- Strongly type `intersectionState` (create a shared `IntersectionState` interface) and avoid `any`.

---

### Known Improvements (Good First Issues)
- Replace nested `setInterval`/`setTimeout` flows with a small, typed state machine for transitions.
- Consolidate duplicate `cn` util (`src/pages/lib/utils.ts` → use `@/lib/utils`).
- Remove unused imports and the unused Vite starter `App.css` if not needed.
- Add ARIA attributes to signals and buttons; add tests for state transitions.
- Honor `prefers-reduced-motion` for all flashing/animated elements.

---

### Troubleshooting
- Port already in use: set a new port `vite --port 5174` or stop the conflicting process.
- Styles not applying: ensure Tailwind content globs include `src/**/*.{ts,tsx}` and restart dev server after config changes.
- Animations missing: verify the custom keyframes/animations exist in `tailwind.config.ts` and `index.css`.

---

### License
This project is provided as an educational/demo resource. Add a license of your choice if you intend to distribute or modify.

---

### Credits
- UI components: shadcn/ui + Radix Primitives
- Icons: lucide-react
- Build tooling: Vite
