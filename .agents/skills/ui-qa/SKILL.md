---
name: ui-qa
description: Perform targeted visual and interaction QA for Ruckus Party using real rendered UI when available. Use for visual QA, responsive QA, screen review, prototype approval, UI regression, or desktop/mobile review; do not invoke for ordinary frontend changes without a QA request.
---

# UI QA

## Purpose

Apply `Render what changed. Verify what matters. Report only actionable issues.`

Use `Mobile-first interaction. Desktop-native composition.` Desktop is a primary platform: responsive design may recompose the experience and must not default to a mobile column centered inside a wide viewport.

Read `AGENTS.md` and `docs/DESIGN.md`. Read `docs/UX_FLOWS.md` only for flow QA, then inspect the UI files and approved visual reference involved. Do not automatically load `ROADMAP`, full `PRODUCT`, `GAME_SYSTEM` or unrelated domain code.

If the user asks only for QA, inspect and report without editing. For QA plus fix, change only the reported scope and rerun the pertinent checks without collateral refactors.

## Workflow

Follow at most these five steps.

### 1. Scope

Identify the changed screen, component or flow; expected behavior; approved reference when one exists; relevant viewports and real states. Match depth to the task and do not expand automatically into full-app QA.

### 2. Render

When technically available, inspect the rendered UI through browser, screenshots and interaction. Never declare a visual `PASS` from JSX or CSS alone.

If real rendering is unavailable, state the limitation and restrict conclusions to what the available evidence proves.

### 3. Inspect

Use `docs/DESIGN.md` as source of truth and check only relevant areas:

- layout, overflow, hierarchy and readability;
- interaction and responsive composition;
- existing states and accessibility basics;
- motion only when present;
- content stress only where dynamic content creates concrete risk.

### 4. Compare

When an approved prototype or reference exists, report differences that materially change hierarchy, interaction, structure, responsive behavior or visual identity. Do not require pixel perfection unless explicitly requested.

### 5. Verdict

Return `PASS`, `PASS WITH ISSUES` or `FAIL` from observable evidence. Report only actionable issues and stop once evidence is sufficient to approve or reject the defined scope.

## QA depth

| Scope | Minimum useful coverage |
|---|---|
| Micro visual fix | affected element, reported viewport, adjacent breakpoint only when relevant |
| New component | mobile, desktop, real primary states |
| New screen | mobile narrow, mobile wide, desktop standard, important states |
| Major flow or visual gate | relevant end-to-end path, mobile, desktop, critical responsive transitions and states, motion when present, accessibility basics |

Do not turn a micro-fix into full-app QA. Stop when relevant viewports and states are verified, significant problems are identified and further checks no longer reveal meaningful issues.

## Mobile and desktop

For significant mobile UI, choose one narrow viewport around 360-390 px and one wide viewport around 414-430 px. Prioritize portrait, touch, readability, CTA prominence, tap targets, overflow, viewport height, relevant safe areas and absence of hover-only behavior.

For important desktop UI, inspect a standard viewport around 1366-1440 px and a wider viewport only when useful. Evaluate intentional use of space, information density, main play area, horizontal composition, relevant panels or score state and balanced negative space.

Treat `mobile UI + max-width + large side bands` as an issue when desktop space could materially improve the experience. Do not fill space without purpose and do not impose a fixed column count.

## Game-night ergonomics

For session or game screens, verify that the main state, current player or turn and primary CTA are quickly understandable by people sharing the screen. Essential information must not require leaning close. Mobile interactions should remain quick while the device passes between players; desktop should work as a shared display when relevant.

## States, accessibility, motion and content

Inspect only states that exist and matter, such as default, hover, focus, selected, disabled, loading, error, empty or success. Do not invent states to complete a checklist.

Perform a basic accessibility check, not a full WCAG audit: contrast, visible focus, touch targets, labels, keyboard use, reduced motion and no essential meaning conveyed only through color. Colored cards need a second distinguishing signal when color carries meaning.

For motion, verify trigger, reasonable duration, final state, continued interaction, `prefers-reduced-motion` and absence of functionless continuous animation.

When overflow risk is concrete, try one realistic stress case such as a long player name, game title or consequence, or the maximum supported player count. Do not stress every component indiscriminately.

## Issue classification

| Severity | Meaning |
|---|---|
| Blocker | prevents use or approval |
| Important | works but clearly compromises UX, responsive behavior, accessibility or approved design |
| Polish | secondary improvement |

Report at most 5 Important and 3 Polish issues. Group additional findings by root cause. For Blocker or Important, add `DESIGN`, `IMPLEMENTATION`, `PROTOTYPE MISMATCH` or `ACCESSIBILITY` only when the label helps route the fix.

## Output

Do not narrate the process. Use:

```text
Esito: PASS | PASS WITH ISSUES | FAIL

Blocker: <only if present>
Important: <only if present>
Polish: <only if present>

Verificato: <rendered viewports and states actually checked>
Prossimo: <one recommendation>
```

For a clean `PASS`, a few lines are enough. Apply `Compress communication, not QA.`

## Reasoning

Medium is the default. Do not recommend High for ordinary visual QA. Use the global `REASONING CHECK` only when the visual problem genuinely requires cross-system or architectural investigation.
