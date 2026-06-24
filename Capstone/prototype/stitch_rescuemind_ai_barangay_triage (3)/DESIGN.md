---
name: RescueMind AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#175ead'
  on-secondary: '#ffffff'
  secondary-container: '#72aafe'
  on-secondary-container: '#003d79'
  tertiary: '#4a000b'
  on-tertiary: '#ffffff'
  tertiary-container: '#720016'
  on-tertiary-container: '#ff7176'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a8c8ff'
  on-secondary-fixed: '#001b3c'
  on-secondary-fixed-variant: '#004689'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b2'
  on-tertiary-fixed: '#410008'
  on-tertiary-fixed-variant: '#92001f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for **RescueMind AI**, a critical infrastructure platform for Philippine Barangay governance. The brand personality is **Authoritative, Responsive, and Compassionate**. It balances the stoic reliability of a government institution with the forward-thinking intelligence of an AI-driven triage system.

The visual style is **Modern Corporate with a High-Contrast Accessibility focus**. It draws inspiration from international government design standards (like GOV.UK and USWDS) but injects a "Tech-Forward" layer through the use of precise geometry and subtle data-visualization cues. The goal is to evoke a sense of immediate trust and calm during emergency situations while remaining approachable for daily community complaints.

**Design Principles:**
- **Clarity over Decoration:** Every element must serve a functional purpose.
- **Bilingual Balance:** Layouts are optimized for the varying lengths of English and Filipino terminology.
- **Urgency Tiering:** Visual cues clearly distinguish between a "General Complaint" (Routine) and a "Disaster Alert" (Critical).

## Colors

The palette is rooted in the "Professional Navy" (#1B365D) to establish institutional authority. This is supported by "Trustworthy Blue" (#0055A4) for interactive elements and primary actions.

**Color Usage:**
- **Primary Navy:** Used for headers, navigation, and core branding. It represents the stability of the government.
- **Emergency Red (#D7263D):** Reserved exclusively for high-priority triage, disaster alerts, and critical errors. It must be used sparingly to maintain its psychological impact.
- **Trustworthy Blue:** The primary action color for buttons, links, and active states.
- **Neutral Grays:** A slate-based gray scale provides the scaffolding for the dashboard, ensuring a soft contrast that reduces eye strain for long-shift dispatchers.
- **Success Green:** Used for resolved cases and "Safe" status updates.

The default mode is **Light**, ensuring maximum legibility under various lighting conditions (e.g., outdoor tablets or brightly lit command centers).

## Typography

The design system utilizes **Geist** for its exceptional clarity and technical precision. Its monospaced-adjacent metrics make it ideal for a dashboard where data, timestamps, and coordinates are frequently displayed.

**Implementation Rules:**
- **Bilingual Display:** When displaying English and Filipino simultaneously, the Filipino translation should appear directly below the English text in `body-md` with a slightly lower opacity (70%) or as a secondary label.
- **Hierarchy:** Use `label-sm` (Uppercase) for category tags like "LOCATION" or "TIME RECEIVED" to create clear scanning paths.
- **Readability:** Body text never drops below 16px to accommodate users of all ages and literacy levels within the Barangay.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. The sidebar/navigation remains fixed, while the main dashboard content utilizes a 12-column fluid grid system.

**Breakpoints:**
- **Mobile (up to 768px):** 4-column layout. Margins: 16px. Sidebars collapse into a bottom navigation bar or a top-level burger menu.
- **Tablet (769px - 1024px):** 8-column layout. Margins: 24px.
- **Desktop (1025px+):** 12-column layout. Max container width: 1440px.

Spacing is based on a 4px baseline, but the primary rhythm is established through 8px increments. Data-heavy tables and triage lists use `sm` (16px) padding to maximize information density without sacrificing touch-target safety.

## Elevation & Depth

This design system uses **Tonal Layers and Low-Contrast Outlines** to create hierarchy. Since this is an official tool, we avoid heavy drop shadows in favor of structural clarity.

- **Level 0 (Background):** #F8FAFC. The canvas.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border of #E2E8F0. This is the primary container for complaints and reports.
- **Level 2 (Active/Hover):** A subtle tint of primary blue (5% opacity) or a 2px stroke to indicate focus.
- **Emergency Elevation:** Critical alerts use a subtle "Emergency Red" outer glow (4px blur, 10% opacity) to draw immediate visual attention without breaking the flat aesthetic.

## Shapes

The shape language is **Professional and Structured**. We use a "Soft" (0.25rem/4px) corner radius to ensure the interface feels modern and accessible while maintaining a serious, institutional character.

- **Buttons & Inputs:** 4px radius (`rounded`).
- **Cards & Modals:** 8px radius (`rounded-lg`).
- **Status Badges:** 2px radius or sharp to maintain a "tag" aesthetic.
- **AI Action Elements:** Icons or AI-generated insight panels may use a slightly more generous 12px radius (`rounded-xl`) to subtly distinguish "intelligent" features from static data.

## Components

### Buttons
- **Primary:** Solid #0055A4. White text. Used for "Submit Report" or "Confirm Triage."
- **Emergency:** Solid #D7263D. White text. Used for "Dispatch Rescue" or "Alert Barangay Captain."
- **Secondary:** Ghost style with #1B365D border and text.

### Triage Cards
Modular units that contain:
- **Header:** Priority level (Badge) and Time Elapsed.
- **Body:** Complaint description in English/Filipino.
- **Footer:** Location (Map link) and AI-suggested action (e.g., "Dispatch Medical").

### Status Chips
High-contrast labels with background tints:
- **Low Priority:** Gray background, Dark Gray text.
- **Medium Priority:** Yellow/Orange tint (Caution).
- **High Priority:** Red tint, White text.

### Input Fields
Strictly defined boxes with 1px #CBD5E1 borders. Focus states use a 2px #0055A4 ring. Labels are always visible above the field (never just placeholders) to ensure accessibility.

### AI Insights Panel
A distinct component with a light #F1F5F9 background and a "sparkle" icon prefix. It uses `body-md` text to provide automated summaries of complaints to help dispatchers make faster decisions.