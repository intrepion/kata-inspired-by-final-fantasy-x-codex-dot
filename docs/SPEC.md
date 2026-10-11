# Glasswake: The Last Lantern
An original 10–20 minute tactical journey across a sea suspended in glass. Four lighthouse keepers reopen five silent beacons and confront the machine that confuses safety with stillness.

## Delegated design tree
User authorized recommended decisions and no design questions. Settled frontier: TypeScript/Vite, original procedural vector illustrations, no paid services; four heroes/three slots; node travel/five chapters; fixed conditional scheduler; shared constellation upgrades with per-hero benefits; individual Charge and collective Lighthouse ability; checkpoint saves; keyboard/native buttons; synthesizer music opt-in. No unresolved prerequisites.

## Acceptance criteria
- Complete five-encounter story, camp conversations, distinct environments, final boss and ending.
- Heroes: Iona (shield), Sable (elementalist), Tavi (quick scout), Orin (healer). Three active; living reserve swap costs a short turn. Fainted slot must be replaced when reserve survives. All four receive equal shared growth.
- No real-time battle clock. Preview is a pure projection of committed action delay; cancel spends nothing. One confirmation resolves once with an expected revision token.
- Costs, targets, weaknesses/resistances, enemy intents, HP/MP/charge/status duration visible. Dead actors never act. Healing cannot target dead; revival can. Charge specials and Lighthouse consume their gauges.
- Constellation nodes require a purchased adjacent node and enough shared sparks. Purchase atomic; permanent upgrades apply equally to all four.
- Camp fully restores party. Shop/inventory constrained by coins and counts. Victory grants reward once; only victory advances campaign. Defeat/reload restores pre-battle checkpoint; retry grants no reward.
- Versioned save validation rejects malformed/inconsistent state; localStorage failures are recoverable. Battle state intentionally not saved. Reload restarts the encounter from checkpoint.
- Responsive pointer/touch/native keyboard controls, modal focus trapping, Escape cancellation/pause, mute and reduced motion.
- Public engine tests cover scheduler/preview/damage/status/resources/swaps/faint/revive/charge/grid/shop/rewards/gating/save; full campaign simulation must win using only public commands.
- Independent Standards and Spec review, browser full campaign and exceptional flows, tests/typecheck/build/audit, private push and commit CI verification.

## Agreed test seams and TDD limits
Delegated approval covers engine commands (`startBattle`, `act`, `preview`, `purchase`, `buy`, `complete`, `decodeSave`). Use red/green for first scheduler tracer and progression/save regressions. Content and visual UI are implemented then verified; no claim of universal test-first development.
