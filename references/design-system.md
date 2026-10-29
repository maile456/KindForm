# Tally-Inspired Design System

## Measured Reference

Reference: [Tally](https://tally.so/). HTML/CSS and frames from the actual product demo were inspected on 2026-10-29. This is a measured visual direction, not a pixel-parity claim. Use original brands, text, images, and characters.

- White canvas, text `#37352F`, gray `#787774`, blue `#0070D7` and hover `#005BB5`. Tiny bright magenta `#F81CE5` details. **No default green, mustard, or yellow theme.**
- Inter is the primary sans-serif reference. Bundle a licensed font or use the project font with the same visual category. No serif display type and no negative tracking.
- Main container about 1024px including 24px horizontal gutters; interior product scene around 976px. Header about 60px with 20px horizontal padding.
- Hero headline around 64px/1 on large desktop. Real reference breakpoints reduce to 50px at <=1200, 32px at <=992, and 26px at <=576. Adapt exact size to original title length without changing the bold centered composition.
- Supporting copy about 22px/1.25, weight 500, max-width 600px. Hero top spacing roughly 128px, major section gaps up to 192px.
- Main blue CTA about 36px high and radius 8px. Auxiliary text links are plain, not pills.
- A large white browser window dominates the hero. Its content is a real simple form: large black heading, small description, vertically stacked labeled fields, choices, and a black submit button. Fine gray borders, no decorative dashboard chrome.
- Hand-drawn gray-black people appear at the scene's far sides, with tiny magenta accents. Hide them on narrow screens. Do not duplicate them as decoration in every section.

## Homepage Mode

Start from `docs/index.html`. Use a centered headline rather than split text/media. The form is the product visual, not a tiny thumbnail inside a decorative hero card. Preserve hierarchy and whitespace before adding sections. Use dense product tools only inside the coherent product preview.

The supplied original transparent doodle is `docs/images/doodle.png`. Its center is transparent; keep it behind the browser scene with the two characters visible beside the sides on wide screens. Do not stretch its aspect ratio. It was generated for this project and is not a Tally asset.

Interactions must correspond to controls: edit title, switch preview state, fill name and choose an option, validate required fields, show a truthful local completion, reset, and select templates. If a publish control exists without backend publishing, its feedback must say local draft rather than live publication.

## Form And Tool Mode

Start from `docs/workspace/index.html` only for a real task-oriented flow. Use a white document-like surface, black question text, blue primary commands, simple outlined inputs, and generous question spacing. Do not copy the hero headline scale into field groups or dialogs. Multi-step forms may use a modest stepper; do not wrap every question in a separate floating card.

Inputs have associated labels and descriptions, not only placeholder text. Errors appear near the invalid field and in a summary when useful. Preserve values when moving back. Keep loading dimensions stable; distinguish local completion from real network submission. Use standard checkboxes, radio buttons, selects, numeric fields, and familiar icons rather than hand-drawn controls.

## Validation

Check 1440, 768, 390, and 360px widths. Text must fit, long title input must wrap, the browser scene must stay in the viewport, and hidden doodles must not create overflow. Mobile navigation needs explicit expanded state and keyboard support. Review on-page imagery and font loading. Keep keyboard focus visible, expose field errors, and honor reduced motion.
