# Browser verification — 2026-11-03

Environment: Chromium, Codex in-app browser. Responsive viewport checks, not physical-device tests.

| Viewport | Map and details render | Page horizontal overflow |
| --- | --- | --- |
| 320 × 740 | Pass | None |
| 390 × 844 | Pass | None |
| 768 × 1024 | Pass | None |
| 1024 × 768 | Pass | None |
| 1440 × 1000 | Pass | None |

Verified through browser interactions:

- All 22 map concepts select correctly and show complete details.
- Only the selected concept and its direct relationships are emphasized.
- Korean search, English search, relationship previews, Enter, Escape, and empty results.
- Review save/remove, review list navigation, and persistence after reload on desktop and mobile.
- Home → continue learning returns to the last selected concept.
- Three example problem cards, the machine-learning example and its understanding check.
- Six roadmap stages and the existing tutor availability dialog.
- Mobile concept select, automatic centering, and detail shortcut.
- Related concept navigation keeps keyboard focus and brings the explanation into view.
- No browser console errors during verification.

Automated checks: `node --test tests/concept-map.test.mjs` — 4 passed.
JavaScript syntax checks and `git diff --check` passed.
