# Al Ahram Auto Spare Parts — Digital Flagship & Parts Showcase

A luxury, art-gallery-inspired digital storefront and technical parts configurator for **Al Ahram Auto Spare Parts (Al Ahram Auto Parts LLC)** in the UAE. Blending the spatial minimalism and fluid motion choreography of MG Select with precision obsidian hardware engineering, the platform turns fast-moving OEM and heavy-duty spare parts into curated mechanical specimens backed by instant vehicle fitment verification and direct WhatsApp commercial ordering.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan incorporates all selections confirmed during clarification alongside the original brand, catalog, and technical requirements. Review the key design and commercial rules below before approving execution.

- **Confirmed Palette & Materiality**: Deep obsidian/carbon canvas (`#0B0B0D`) paired with **Crimson Red** (`#DC2626`) action highlights and **Brushed Silver** (`#D4D7DD` / `#9CA3AF`) typography and hairline dividers.
- **Confirmed Pricing & Commercial Modes**: Interactive **AED / USD** currency switcher paired with **Retail / Bulk Workshop** pricing tiers (1–4 units Retail, 5–19 units Workshop Tier I, 20+ units Fleet & Export Tier II) across catalog cards, part detail pages, and the quote drawer.
- **Confirmed Vehicle Fitment Focus**: Curated GCC & Global luxury/fleet matrix prioritizing **Toyota, Nissan, Mercedes-Benz, BMW, and Lexus** across 2016–2026 model years, with instant compatibility filtering and `"Guaranteed Fit"` confirmation.
- **Confirmed Visual Storytelling Centerpiece**: An **Interactive Chassis Hotspot Part Explorer** on the homepage, allowing visitors to inspect mechanical zones directly on a studio-lit vehicle silhouette and jump straight to compatible spare parts.
- **Recommended Image Asset Strategy**: All hero, chassis explorer, and category/product studio photographs will be custom-generated on dark studio backdrops to prevent broken external links and keep lighting consistent across the obsidian canvas.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces traditional cluttered spare-parts listings with an editorial showcase and high-precision configurator. Visitors can explore seven core mechanical systems via an interactive chassis diagram or category index, lock in their vehicle (Make / Model / Year) to verify guaranteed fitment, switch between **Standard OEM** and **Heavy-Duty / Performance** hardware variants on dedicated product pages, and dispatch itemized Retail or Bulk Workshop orders directly to Al Ahram's Sharjah desk via pre-filled WhatsApp links.
- **Target Audience / Persona**:
  - *Private Luxury & SUV Owners (UAE & GCC)* seeking verified OEM or performance upgrades (e.g., Land Cruiser, Patrol, G-Class, X5, LX600) with fast local fulfillment.
  - *Independent Workshops & Fleet Managers (UAE & International Export)* ordering multi-unit batches of fast-moving consumables, braking assemblies, and engine hardware with transparent bulk tier pricing and worldwide dispatch.
- **Key Value**: Eliminates part-number guesswork and tedious RFQ emails by unifying fitment verification, variant engineering tolerances, bulk tier calculation, and 1-click WhatsApp order formatting in a single uninterrupted flow.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Zero-State Gallery Arrival & Fitment Lock-In**:
   - The visitor lands on a full-bleed obsidian hero showcasing precision automotive hardware alongside the **Vehicle Fitment Finder** toolbar (`Make` → `Model` → `Year` + `AED | USD` currency switcher).
   - Selecting a vehicle (e.g., *Toyota · Land Cruiser 300 · 2024*) immediately filters compatible catalog items and displays an inline `Guaranteed Fit` indicator next to matching assemblies.
2. **Interactive Chassis Hotspot Explorer**:
   - Directly below the hero, a studio-lit side-profile vehicle showcase displays interactive `+` mechanical hotspots mapped to the seven core systems (*Braking System*, *Suspension & Steering*, *Engine Parts*, *Electrical & Lighting*, *Cooling – AC System*, *Exhaust & Emissions*, and *Filters & Consumables*).
   - Clicking any hotspot smoothly transitions a synchronized inspection panel revealing key tolerances, fast-moving SKUs in that system, and a direct route into the category or product detail page.
3. **Catalog Filtering & Dedicated Product Detail View (PDP)**:
   - Visitors can browse by the 7 main categories or jump directly to fast-moving parts (*Starter Motors, Control Arms, Struts, Master Cylinders, Cylinder Heads, Brake Pads/Rotors, Alternators, Spark Plugs, Water Pumps, Shock Absorbers, Mufflers, Timing Belts, Pistons with Seals/Heads, Oil/Fuel/Air Filters*).
   - Clicking a part smoothly transitions (staggered fade-up) into a dedicated two-column Product Detail Page: a sticky studio gallery on the left and a contiguous purchase/spec module on the right.
4. **Variant Toggle & Animated Engineering Specs**:
   - Inside the Product Detail Page, segmented variant buttons toggle between **Standard OEM** and **Heavy-Duty / Performance**. Switching variants updates the product image treatment, SKU/OE reference, price, and triggers animated tabular counters for engineering tolerances (e.g., thermal rating in `°C`, tensile strength in `MPa`, rated lifespan in `km`, machining tolerance in `µm`).
5. **Slide-Over Quote / Order Drawer & Pre-Filled WhatsApp Dispatch**:
   - Adding parts opens or updates a slide-over Quote & Order Drawer featuring a **Retail / Bulk Workshop** mode toggle. Bulk mode automatically unlocks tiered workshop quantity pricing and calculates line-item savings.
   - Clicking **Order via WhatsApp** (from the drawer, product page, or subtle floating support button) constructs a structured `https://wa.me/971552248090` message containing the selected part name(s), variant, SKU, quantity, Retail/Bulk tier, currency total, and active Make/Model/Year fitment.

### Visual Identity & Theme

- **Aesthetic Direction**: Dark Precision Hardware Gallery — sparse editorial framing, crisp hairline geometry, zero decorative clutter, and museum-grade lighting on mechanical components.
- **Color Palette & 60-30-10 Allocation**:
  - *60% Dominant Neutral Canvas*: Obsidian Carbon (`--background: #0B0B0D`) for full-bleed sections and open negative space.
  - *30% Structural Surfaces*: Machined Slate (`--surface: #131317`, `--surface-elevated: #1A1A20`) with subtle `1px` brushed-silver hairline borders (`rgba(212, 215, 221, 0.12)`) and cool silver typography (`#F4F5F7` primary, `#9CA3AF` secondary).
  - *10% Accent Budget*: Motorsport Crimson (`--accent: #DC2626`, hover `#EF4444`) strictly reserved for primary CTAs, active hotspot indicators, and selected variant/mode states.
- **Typography & Hierarchy**:
  - *Display*: `Outfit` (tight tracking `-0.02em`, balanced wrapping with `text-wrap: balance`) for architectural hero and section headings.
  - *Body Prose*: `DM Sans` (`15px–16px`, `1.6` line-height, optical dark-mode compensation).
  - *Engineering Data & Pricing*: `IBM Plex Mono` with `tabular-nums` strictly for OEM part numbers, tolerances, dimensions, and AED/USD pricing alignment.
- **Component & Layout Discipline**:
  - **Three-Zone Top Bar**: Single-line wordmark (`Al Ahram Auto Parts`), 4 concise navigation links (`Catalog`, `Chassis Explorer`, `Fitment`, `Support`), and 1 primary action (`Quote Bag` with live item counter). Currency and Retail/Bulk switches live cleanly in the catalog toolbar and drawer—keeping the header minimal.
  - **Zero-Pill Metadata**: Category names, OE codes, stock availability, and `"Guaranteed Fit"` confirmations render as clean inline typography with `·` separators rather than pill-badge clusters.
  - **Section Rhythm**: Hero + Fitment Bar → Interactive Chassis Explorer → Curated Category & Parts Catalog (or smooth view transition to Product Detail Page) → Worldwide Fulfillment & Trust Strip → Minimalist Footer with full Sharjah UAE contact details (`+971 55 224 8090`, `+971 6 539 6988`, `alahram123@outlook.com`, `Lateefa Building, Wheeling, Shop #6, Street 69, 33868, UAE`).

### Interactive Feedback & Motion

- **Signature Easing Curve**: Every page transition, drawer slide, variant switch, and staggered catalog reveal uses Framer Motion with `cubic-bezier(0.22, 1, 0.36, 1)` (`ease: [0.22, 1, 0.36, 1]`), animating only compositor-safe properties (`transform`, `opacity`).
- **Animated Spec Counters**: Engineering telemetry values smoothly count up using `tabular-nums` when entering a part view or switching between OEM and Heavy-Duty variants.
- **Routine Micro-Interactions**: Hover states and segmented control transitions settle within `150ms–200ms`, respecting `prefers-reduced-motion`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Integrated Single-Page View Switching vs. Multi-Page Routing**
  - *Chosen Approach*: Smooth animated view transitions (Gallery Home ↔ Category Catalog ↔ Dedicated Product Detail View) managed through React state and URL hash synchronization.
  - *Why*: Enables uninterrupted Framer Motion `AnimatePresence` transitions (`cubic-bezier(0.22, 1, 0.36, 1)`), preserves the user's locked-in Vehicle Fitment selection and Quote Drawer across every view, and keeps response instantaneous.
  - *Alternatives Considered*: Separate browser routes without shared state, which would cause full-page flashes and interrupt gallery-like continuity.

- **Decision 2: Client-Side Rich Fitment & Tier Pricing Engine**
  - *Chosen Approach*: Structured TypeScript catalog containing all 7 categories, 15+ flagship spare part families, OEM vs. Heavy-Duty variant specs, GCC/Global vehicle compatibility matrices, and deterministic AED/USD + Bulk tier math.
  - *Why*: Instantaneous zero-latency filtering and tier recalculation without server round-trips, paired directly with real commercial order dispatch via WhatsApp (`wa.me`) and `mailto:` fallback.
  - *Alternatives Considered*: Requiring account login or backend checkout forms, which adds friction for workshop buyers who prefer direct WhatsApp negotiation and rapid parts confirmation.

- **Decision 3: Curated Studio Hardware Imagery + Resilient Fallbacks**
  - *Chosen Approach*: Generate high-contrast obsidian studio imagery for the hero showcase, side-profile chassis explorer, and category/hardware plates, backed by styled precision fallback containers on every image slot.
  - *Why*: Guarantees uniform dark-gallery lighting matching `#0B0B0D` and prevents any broken external image URLs.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION SHELL & STATE                         │
│  • Active View (Home / Product Detail)   • Vehicle Fitment (Make/Mod/Yr)  │
│  • Currency (AED / USD)                  • Mode (Retail / Bulk Workshop)  │
│  • Quote Bag Items & Quantities          • Drawer Open / WhatsApp Builder │
└───────────────────┬───────────────────────────────────┬───────────────────┘
                    │                                   │
        ┌───────────▼───────────┐           ┌───────────▼───────────┐
        │   PRIMARY WORKSPACE   │           │   PERSISTENT OVERLAYS │
        ├───────────────────────┤           ├───────────────────────┤
        │ • 3-Zone Top Header   │           │ • Slide-Over Quote    │
        │ • Hero & Fitment Bar  │           │   & Order Drawer      │
        │ • Interactive Chassis │           │   (Retail/Bulk Toggle │
        │   Hotspot Explorer    │           │    & Tier Calculator) │
        │ • 7-Category Filter & │           │ • Subtle Floating     │
        │   Parts Catalog Grid  │           │   WhatsApp Support    │
        │ • Dedicated Part PDP  │           │   Button (wa.me)      │
        │   (OEM vs Heavy-Duty  │           └───────────────────────┘
        │    & Spec Counters)   │
        │ • UAE / Global Trust  │
        │   & Contact Footer    │
        └───────────────────────┘
```

### Data Model & State

- **Vehicle Fitment Entity**: `{ make, model, yearRange, chassisCode }` covering Toyota (Land Cruiser 300, Prado, Camry, Hilux), Nissan (Patrol Y62/Y63, Altima, X-Trail), Mercedes-Benz (G-Class, S-Class, E-Class, GLE), BMW (X5, 5 Series, 7 Series, M3), and Lexus (LX 600, RX 350, ES 350, LS 500).
- **Spare Part Entity**: `{ id, slug, name, categoryId, oemReference, summary, compatibleMakes, compatibleModels, image, specs, variants }`.
  - Each `variant` (`standard_oem` | `heavy_duty`) carries its own `{ label, partCode, priceAED, bulkTiers, specs: { thermalRatingC, tensileMPa, lifespanKm, toleranceMicron }, warrantyMonths, stockStatus, imageVariant }`.
- **Quote Cart Item**: `{ partId, variantId, quantity, fitmentSnapshot }` allowing buyers to accumulate multiple parts for a single vehicle or workshop batch.

### Interactive Component & State Mapping

- **Fitment Selector (`Make` → `Model` → `Year`)**: Cascading dropdowns reset dependent child fields when a parent changes; updates `activeFitment` state, filters the catalog with Framer Motion layout transitions, and enables the `"Guaranteed Fit"` verification state on compatible parts and inside the Product Detail Page.
- **Chassis Hotspot Explorer**: Selecting any of the 7 coordinate pins on the vehicle profile updates `activeHotspotSystem`, animates the adjacent inspection card with staggered specs and matching parts, and offers a one-click jump to filter the catalog or inspect a flagship part.
- **Product Detail Variant Switcher**: Toggling `Standard OEM` ↔ `Heavy-Duty / Performance` updates `selectedVariantId`, smoothly cross-fades the part showcase, triggers animated `tabular-nums` counters for tolerance/durability specs, and updates the live Retail/Bulk price display.
- **Quote Drawer & WhatsApp Serializer**: Toggling `Retail` ↔ `Bulk Workshop` dynamically recalculates unit discounts (`5+` units = 12% off, `20+` units = 22% off) and formats an itemized WhatsApp order URI (`https://wa.me/971552248090?text=...`) including customer/workshop note, currency (`AED` or `USD`), part SKUs, variant names, and selected vehicle fitment.
