# Glasswake · The Last Lantern
A complete original illustrated browser party RPG, inspired by the strategic patterns of Final Fantasy X. The ocean has turned to glass. Four lighthouse keepers carry one living flame through five beacons, confront the Stillheart, and bring tomorrow back.

**Play:** http://127.0.0.1:5187/ on this Mac. A supported terminal session runs the local server; it lasts until stopped or the host/session exits. No boot/login autostart. Previous game repositories and ports 5173–5186 are untouched. This folder is a cloned repository, not a newly registered Codex sidebar project (no supported registration capability was available).

## Restart
```sh
cd /Users/intrepion/Documents/Codex/2026-10-11/task-3/kata-inspired-by-final-fantasy-x-codex-dot
npm ci
npm run dev
```
Node 24+ required. `npm run dev` uses loopback only and strict port 5187; if occupied, stop the existing Glasswake session before restarting. No paid services or public deployment.

## Controls and strategy
Pointer/touch native buttons, or Tab / Shift+Tab and Enter / Space. Escape cancels a selected action or opens/closes pause. Pick action → pick target when required → confirm. Menus do not spend turns. Costs and recovery previews are visible.

Iona shelters; Sable exploits three elemental weaknesses; Tavi binds and acts quickly; Orin heals and recalls. Three active slots, one reserve. Voluntary swaps cost 35 ticks; required replacement is free. Weak hits double damage and add 25 shared Lighthouse. Basic physical hits halve against armor. Every non-burst action adds 18 individual Charge; damage taken adds 20. Charged bursts consume 100 Charge; Lighthouse consumes 100 collective light. Orin's burst heals all living keepers. Status duration is measured in the affected actor's actions.

All four share sparks and permanent constellation upgrades, even reserves. Nodes need a lit neighbor and the stated cost. Shops spend coins and add limited supplies. Camp restores all HP and MP before each fight. Save data is versioned and validated. Battle saves are checkpoint-only: reload or defeat restores the encounter start; victories reward once and immediately save the next chapter.

## Scope
Five locations and encounters, original dialogue and ending, four roles, seven connected nodes including the root, two statuses and three inventory supplies. Approximately 10–20 minutes depending on reading and deliberation. Authored SVG art and original opt-in synthesized motif. Node-based linear travel rather than free roaming; a compact shared constellation rather than FFX's personal Sphere Grid; one shared burst rather than a controllable summoned creature. No copied Square Enix assets or exact combat formulas.

## Verification
```sh
npm test
npm run simulate
npm run typecheck
npm run build
npm audit --audit-level=moderate
```
See [specification](docs/SPEC.md), [glossary](GLOSSARY.md), [architecture decisions](docs/adr), [research](docs/RESEARCH.md), [review](docs/REVIEW.md), and [browser evidence](docs/QA.md). Desktop Chrome on this Mac and a 390×844 viewport were exercised. Responsive viewport testing does not establish physical mobile-device or screen-reader compatibility.
