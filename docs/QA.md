# Verification evidence · 2026-10-11
## Automated
21 behavior tests at public engine seams: deterministic scheduler and action delays, pure preview and first-actor agreement, stale revision rejection, weak/resistant/armored damage, role/target/MP validation, Guard/Shelter and Slow durations, voluntary/forced swaps and invalid reserve prevention, healing/revival/caps/item costs, charged damage and Orin's group healing, shared Lighthouse, defeat/checkpoint/reward idempotence, reserve upgrade parity, graph adjacency/currency atomicity, shop limits and prototype-key rejection, malformed/versioned save validation.
Two full campaign tests solve every chapter using only `startBattle`, `act`, `purchase`, and `complete`; one with connected upgrades, one with all currency banked. No hidden autoplay API is shipped.

## Mac Chrome visible playthrough
Played all five chapters and reached the ending through action → target → confirm controls. A QA helper read only rendered DOM and clicked normal buttons; it did not access engine state, storage, debug methods, or invoke game functions. Read each camp's story and conversations.
- First two beacons: reserve Orin swap, physical/elemental attacks, Tide/Ember/Volt weakness hits, connected Bright edge purchase, supply shop Tonic purchase.
- Blue Kiln: Tavi Bind and Iona Shelter, then deliberate Guard-only defeat; living reserve was required to replace fallen Tavi. Retry returned identical departure text including supplies and chapter, with no reward. Then bought Deep breath and Inner well and won the retry.
- Starless Reach: Slow duration labels, Open horizon upgrade, modal pause, music enable/mute and reduced motion.
- Stillheart: Many as one upgrade, three weakness hits filled Lighthouse; released Lighthouse for 150 armor-ignoring damage; Orin's charged Resonance healed the party. Final boss defeated, ending visible, completed checkpoint resumed after reload.
- Selecting Bind then cancelling preserved all party HP/MP/Charge. Keyboard Enter selected Guard. Double-clicking Confirm Guard resolved exactly once (18 charge, one log entry, next actor Iona). Reload during this fight restored full party and zero charge at the same chapter.
- Explicit modal focus wrapping retained focus inside dialog for 12 successive Tab presses. Escape closes modal. Disabled unavailable abilities and disconnected/unaffordable nodes were visible.
- 390×844 responsive viewport: party stats, reserve, costs, targets and controls usable; horizontal page scrollWidth equaled clientWidth (375px excluding scrollbar). Final encounter played partly at this width. Temporary viewport reset afterward. No physical mobile hardware tested.
- No application-origin console errors observed; existing Chrome extension warnings were excluded from application findings.

Screenshots: [battle](screenshots/battle.jpg), [mobile boss](screenshots/mobile-boss.jpg), [ending](screenshots/ending.jpg), [starting title](screenshots/title.jpg). These are actual browser captures.

## Skills and adaptations
Read installed `/Users/intrepion/.agents/skills/{grill-with-docs,implement,grilling,domain-modeling,tdd,code-review}/SKILL.md` and domain format/TDD references. Verified Matt Pocock's official GitHub skill pages. Delegated recommended choices superseded interview waits and seam confirmation; the design tree, glossary and ADRs record those choices. Implement used targeted TDD at scheduler tracer and review regressions. Most content/UI and broader tests were implemented and then verified; this is not universal test-first development. Independent Standards/Spec review used separate subagents as the skill requires. No outbound main-room messaging or paid assets.
