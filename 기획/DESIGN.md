---
name: Strategic Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4e5e81'
  primary: '#031635'
  on-primary: '#ffffff'
  primary-container: '#1a2b4b'
  on-primary-container: '#8293b8'
  inverse-primary: '#b6c6ef'
  secondary: '#0040e0'
  on-secondary: '#ffffff'
  secondary-container: '#2e5bff'
  on-secondary-container: '#efefff'
  tertiary: '#06172a'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c2c40'
  on-tertiary-container: '#8393ac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#b6c6ef'
  on-primary-fixed: '#081b3a'
  on-primary-fixed-variant: '#364768'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001356'
  on-secondary-fixed-variant: '#0035be'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

This design system is engineered for high-performance agency environments. The brand personality is rooted in **Reliability, Efficiency, and Authority**. It targets power users—designers and marketing managers—who require a tool that disappears behind their work while providing absolute clarity and structural confidence.

The visual style is a sophisticated **Modern Corporate** aesthetic. It avoids decorative trends in favor of utilitarian minimalism. The interface communicates "workhorse" reliability through a monochromatic foundation, using a high-density layout to minimize scroll fatigue and maximize the visibility of complex project data. 

Key attributes:
- **Architectural Rigor:** Every element is aligned to a strict grid.
- **Unobtrusive Utility:** The UI provides context only when needed.
- **Instrumental Clarity:** Visual hierarchy prioritizes data and content over the interface itself.

## Colors

The palette is designed to instill confidence and focus. 

- **Primary (Deep Navy):** Reserved for global navigation, structural headers, and primary branding. It acts as the anchor for the entire platform.
- **Action (Electric Blue):** A high-vibrancy accent used exclusively for interactive elements, CTA buttons, and active states. This ensures that in a complex dashboard, the "next step" is always visually immediate.
- **Surface (Slate & White):** We use a tiered neutral system. The background is a crisp white (#FFFFFF), while secondary containers and sidebars use a soft Slate Grey (#F1F5F9) to define functional zones without using heavy borders.
- **Semantic Colors:** Status indicators (Success, Warning, Error) follow standard conventions but are desaturated slightly to maintain the professional tone.

## Typography

The typography system uses **Inter** for its exceptional legibility at small sizes and its neutral, systematic character. 

- **Scale:** A tight typographic scale is used to accommodate information density. The base body size is 14px, which allows for complex table views and property panels to remain readable.
- **Hierarchy:** We utilize font weight rather than massive size increases to distinguish hierarchy. Labels for metadata and secondary inputs use uppercase styling with slight letter spacing to differentiate from editable content.
- **Numbers:** Tabular lining figures are preferred for dashboard metrics to ensure vertical alignment in data grids.

## Layout & Spacing

This design system employs a **Fluid Grid** with fixed-width sidebars. The layout is optimized for 1440px displays, frequently used by agency professionals.

- **The 4px System:** All spacing and component heights are multiples of 4px. This ensures mathematical harmony and ease of hand-off.
- **Information Density:** Gutters are kept at a lean 16px. In builder viewports, the sidebars for "layers" and "properties" are collapsible to maximize the central canvas area.
- **Zonal Definition:** Content is organized into clear "cards" or "panels" with 16px of internal padding. Grouped controls use 8px spacing, while distinct sections use 24px.

## Elevation & Depth

To maintain a clean, "Modern Professional" look, this design system relies on **Low-Contrast Outlines** and **Tonal Layers** rather than heavy shadows.

- **Layer 0 (Background):** Slate 50 (#F8FAFC).
- **Layer 1 (Cards/Panels):** Pure White (#FFFFFF) with a 1px border in Slate 200 (#E2E8F0).
- **Layer 2 (Dropdowns/Modals):** Pure White with a subtle "Ambient Shadow" (0px 4px 12px rgba(26, 43, 75, 0.08)).
- **Depth Strategy:** Depth is used to indicate interactivity. A subtle 1px inset shadow may be used for pressed button states, but generally, the UI remains flat to minimize visual noise during the landing page building process.

## Shapes

The shape language is **Soft (Level 1)**. 

- **Radius (4px):** Standard for buttons, input fields, and small UI components. This provides a modern touch without sacrificing the precision associated with professional tools.
- **Radius (8px):** Used for cards and larger containers to create a clear container-child relationship.
- **Consistency:** Rounding is never used for the main browser-level panels or sidebars—these remain sharp (0px) where they meet the screen edge to maximize screen real estate and maintain a rigid, structural feel.

## Components

- **Buttons:** 
  - *Primary:* Electric Blue background, white text. No gradient. 
  - *Secondary:* Deep Navy outline with navy text. 
  - *Tertiary:* Ghost style (text only) for low-priority actions.
- **Input Fields:** Use 1px Slate borders. Upon focus, the border transitions to Electric Blue with a subtle 2px outer glow.
- **Chips:** Used for project tags and status filters. Low-saturation backgrounds with high-contrast text. Rectangular with a 2px radius to match the technical aesthetic.
- **Cards:** Used for project previews. They feature a 1px border and no shadow unless hovered.
- **The Builder Canvas:** A distinct "workspace" background (light grey grid pattern) to separate the interface from the landing page content being designed.
- **Property Panels:** High-density vertical lists with 8px spacing between control groups. Use "Inter-label" typography for field names.
- **Tree View:** For landing page layers, using 16px indentation per level and 12px icons for element types (Text, Image, Section).