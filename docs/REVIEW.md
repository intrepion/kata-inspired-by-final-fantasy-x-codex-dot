# Independent reviews
Fixed baseline: `3203b4f` (initial acceptance criteria and architecture). Initial implementation: `53bb86a`. Code-review skill applied with separate Standards and Spec reviewers.

## Standards
P2: `buy` used `item in prices`, admitting inherited runtime keys. Fixed with `Object.hasOwn`; regression red before fix and green after, including constructor, __proto__ and unknown keys.
Advisory: action classifications repeat between engine and UI (Repeated Switches / Shotgun Surgery heuristic). Accepted for this compact fixed action catalog; adding future actions must audit target classification, costs, recovery and presentation. This is not a current correctness failure.

## Spec
P2: Shelter promised two subsequent actions but decremented the caster's newly applied duration immediately. Fixed by preserving the application-turn duration; red/green regression covers caster and ally.
P2: Reserve statuses were absent. Fixed by displaying Slow and Guard durations alongside reserve HP/MP/Charge; browser verified a fallen reserve with retained Guard.

## Browser findings
- Constellation SVG default aspect preservation displaced connecting lines from percent-positioned node buttons. Fixed `preserveAspectRatio="none"`, preserving the actual connectivity rules.
- Native dialog tab cycling briefly focused the document. Explicit boundary wrapping now keeps 12 consecutive Tab cycles inside the modal. Background controls remain inert.

No unresolved correctness findings. The classification advisory remains a documented maintenance tradeoff.
