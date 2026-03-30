# Design System Document: The Architectural Editorial

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Architectural Editorial**. We are moving away from the rigid, "boxed-in" nature of standard SaaS templates and toward a layout strategy that feels like a premium digital monograph.

This system prioritizes intentional asymmetry, high-impact typography scales, and a sense of "breathable gravity." We break the grid by allowing elements—like high-scale display type and glassmorphic cards—to overlap slightly, creating a three-dimensional depth that feels curated rather than generated. The goal is to convey authority and innovation through sophisticated restraint.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a high-contrast foundation of deep crimson, forest emerald, and a sophisticated grayscale.

### The Color Palette
- **Primary (`#b70011` / `#dc2626`):** The "Pulse." Use this for high-impact CTAs and critical brand moments.
- **Secondary (`#006e2d` / `#16a34a`):** The "Signal." Use for growth-oriented data, success states, and secondary accents.
- **Neutral/Surface:** A tiered system from `surface_container_lowest` (#ffffff) to `surface_dim` (#d9dadb).

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for defining sections. Boundaries must be defined solely through:
1. **Background Color Shifts:** Use `surface_container_low` sections sitting on a `surface` background to define scope.
2. **Tonal Transitions:** A subtle shift from `surface` to `surface_container` creates a cleaner, more modern break than a hard line.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper.
- Use `surface_container_low` for the main canvas.
- Nest `surface_container_lowest` (Pure White) cards on top to create a "lifted" feel.
- Use `surface_container_high` for inset elements like search bars or code blocks to create "recessed" depth.

### The "Glass & Gradient" Rule
To move beyond "out-of-the-box" aesthetics, floating navigation or overlay modals should utilize **Glassmorphism**.
- **Backdrop-blur:** 12px–20px.
- **Background:** `surface` at 70% opacity.
- **Signature Texture:** For primary CTAs, use a subtle linear gradient from `primary` (#b70011) to `primary_container` (#dc2626) at a 135-degree angle. This adds "soul" and prevents the flat-color fatigue of standard systems.

---

## 3. Typography
The typography uses a dual-font strategy to balance editorial flair with technical precision.

- **Display & Headline (Manrope):** This is our "Statement" face. Use the larger scales (`display-lg` at 3.5rem) with tighter letter spacing (-0.02em) to create a bold, authoritative presence.
- **Body, Title, & Label (Inter):** This is our "Functional" face. It provides high legibility.

**Typography as Identity:**
- **Asymmetric Headers:** Pair a `display-sm` headline with a `label-md` uppercase sub-header positioned offset to the left.
- **Breathable Scale:** Never crowd the type. If a headline is `headline-lg`, ensure it has at least `spacing-12` (3rem) of clearance from the body text below.

---

## 4. Elevation & Depth
We reject traditional drop shadows in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural elevation.
- **Ambient Shadows:** Only use shadows for floating components (e.g., Modals). Shadows must be diffused: `box-shadow: 0 20px 40px rgba(25, 28, 29, 0.05)`. Note the 5% opacity; it should feel like ambient light, not a dark glow.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. Never use 100% opaque borders.
- **Glassmorphism Depth:** When using glass elements, the `outline_variant` (at 10% opacity) should act as a "highlight" on the top edge only, simulating the edge of a glass pane.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `rounded-md` (0.75rem), `spacing-3` vertical / `spacing-6` horizontal padding.
- **Secondary:** `surface_container_high` background with `on_surface` text. No border.
- **Tertiary:** Pure text with `on_primary_fixed_variant` color. On hover, apply a `surface_container_low` background.

### Cards & Lists
- **Rule:** Forbid the use of divider lines.
- **Separation:** Use `spacing-8` (2rem) of vertical white space or a subtle shift to `surface_container_lowest` to separate content blocks.
- **Interaction:** Cards should have a "lift" on hover—transition from `surface` to `surface_container_lowest` with a subtle `ambient shadow`.

### Input Fields
- **Style:** "Soft Inset." Use `surface_container_high` as the background with a `rounded-sm` (0.25rem) corner.
- **Focus:** No heavy outline. Transition the background to `surface_container_highest` and add a `primary` "Ghost Border" at 20% opacity.

### Chips
- Use `surface_container_highest` with `label-md` typography.
- Use `rounded-full` for a "pill" aesthetic that contrasts against the sharper `rounded-md` cards.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional white space. If you think there's enough room, add another `spacing-4`.
- **Do** overlap elements. A photo slightly overlapping a `surface_container` block adds professional "editorial" depth.
- **Do** use `on_surface_variant` for secondary text to maintain a soft visual hierarchy.

### Don't
- **Don't** use 1px solid black or gray borders. Refer to the "No-Line" Rule.
- **Don't** use standard "drop shadows" with high opacity.
- **Don't** crowd the typography. This system lives and breathes through its `display` scale.
- **Don't** use full-width sections for everything. Use the grid to create asymmetric columns (e.g., a 7-column main content area with a 5-column empty "breathing" space).

---

## 7. Spacing Scale Reference
- **Micro (1-3):** 0.25rem to 0.75rem. Use for internal component padding.
- **Macro (8-24):** 2rem to 6rem. Use for section margins and defining the "Editorial" flow.
- **The Golden Gap:** Use `spacing-16` (4rem) as the default vertical gap between major content sections.