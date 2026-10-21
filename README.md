# SupplyShield AI — Predictive Procurement Intelligence

> **Immersive 3D Animated Glassmorphism + Neumorphism Frontend**

SupplyShield AI is a futuristic industrial intelligence workspace designed for monitoring manufacturing supply chains, component shortages, delivery deviations, and supplier risk mitigation in real time.

---

## 🌟 Key 3D Animated Concepts & Features

### 1. Atmospheric 3D Background Environment (`Background3DScene`)
- **Signature SupplyShield Emblem**: A slowly rotating 3D translucent geometric shield extruded with beveled edges and illuminated wireframe contours.
- **AI Core Insignia**: Nested glowing polyhedron core rotating with cyan and violet light pulses.
- **Orbital Gyroscope Rings**: Dual concentric orbital rings slowly tilting with ambient illumination.
- **Digital Constellation**: Over 280 particle nodes and dynamic connection lines representing global supply chain telemetry.
- **Gentle Parallax**: Responds smoothly to mouse movements without interfering with interactive UI controls (`pointer-events-none`).
- **WebGL Fallback**: Graceful CSS radial gradients and pulse animations if WebGL is unavailable or fails.
- **Reduced Motion Support**: Respects `prefers-reduced-motion` to conserve system resources and ensure accessibility.

### 2. Signature Feature: Supply Network Intelligence (`SupplyNetworkIntelligence3D`)
- **Central Factory Node**: Detroit Assembly Plant Alpha represented as an illuminated diamond core with active pulse rings.
- **Tier-1 & Tier-2 Suppliers**: Surrounding nodes for Apex Semiconductor (Critical), Rheinmetall Micro (Critical), Nippon Precision (Delayed), Seoul Battery Systems (Delayed), FlexLogic Cables (Healthy), Shenzhen Display (Healthy), and Alps Alpine (Expedited AI Mitigation Alternative).
- **Intermediate Material Nodes**: Monitored component buffers (STM32 MCUs, Power MOSFETs, Titanium Fasteners, Lithium Cells, Wire Harnesses, OLED Dash Panels).
- **Curved Bezier Transit Tubes**: 3D quadratic bezier splines connecting nodes with color-coded risk paths (Red = Critical, Amber = Delayed, Cyan = Healthy, Violet = AI Mitigation).
- **Animated Material Flow Packets**: Glowing energy packets traversing along transit routes towards the central factory at speeds proportional to logistics velocity.
- **Interactive 3D Controls**:
  - **Click & Drag**: Orbit and rotate the network in 3D space.
  - **Mouse Wheel / Pinch**: Smooth zoom in/out with clamp limits.
  - **Reset Camera**: Smoothly returns view to the default angle.
  - **Perspective Switch**: Toggle between 3D Perspective and Top-Down 2D Schematic view.
  - **Pause / Resume**: Toggle real-time packet flow and auto-rotation.
  - **Route Filters**: Filter by `All Routes`, `At-Risk Only`, or `Healthy Only`.
- **Raycasting & Telemetry Drawers**:
  - Hovering over a node displays a 3D HUD tooltip with node name, location, and risk metrics.
  - Clicking any node opens a detailed diagnostic flyout drawer with full vendor telemetry, lead times, and mitigation actions.
  - Clicking any route reveals root cause analysis and financial exposure.
- **Accessible Data Matrix**: Screen-reader accessible tabular summary toggleable right inside the visualization header.

### 3. 3D Perspective Tilt & Specular Glare (`Tilt3DCard`)
- Applied to top KPI metric cards and critical AI mitigation recommendation banners.
- Generates dynamic specular glare reflection sheens that track cursor coordinates across the glass surface.
- Smooth spring return with CSS transforms.
- Stable data tables, forms, and charts to prevent visual fatigue.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript & Vite
- **3D Graphics**: Three.js (WebGL 2.0)
- **Styling**: Tailwind CSS with custom glassmorphism and neumorphism tokens
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Data Visualization**: Recharts with customized dark glass tooltips
- **Animation**: Framer Motion & requestAnimationFrame WebGL render loops

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd "SUPPLYSHIELD AI"

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the local development server
npm run dev
```

The application will be available at:
`http://localhost:5173/`

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── 3d/
│   │   ├── Background3DScene.tsx            # 3D Shield, constellation & orbital environment
│   │   └── SupplyNetworkIntelligence3D.tsx  # Signature 3D interactive supply chain digital twin
│   ├── common/
│   │   ├── GlassCard.tsx                    # Glassmorphic card surface
│   │   ├── GlassPanel.tsx                   # Layered translucent panels
│   │   ├── GlassTable.tsx                   # Data tables with glass styling
│   │   ├── MetricCard.tsx                   # KPI cards with 3D tilt integration
│   │   ├── NeumorphicButton.tsx             # Raised and inset neumorphic buttons
│   │   ├── StatusBadge.tsx                  # Color & accessibility status badges
│   │   └── Tilt3DCard.tsx                   # 3D perspective tilt & specular glare engine
│   └── layout/
│       ├── AppLayout.tsx                    # Master layout with Background3DScene
│       ├── Header.tsx                       # Glass navigation header
│       └── Sidebar.tsx                      # Floating glass sidebar navigation
├── pages/
│   ├── OverviewPage.tsx                     # Command center with 3D Supply Network Intelligence
│   ├── DataImportsPage.tsx                  # Data ingestion console
│   ├── PurchaseOrdersPage.tsx               # PO tracking & logistics deviations
│   ├── InventoryRisksPage.tsx               # Safety buffer & shortage analysis
│   ├── SuppliersPage.tsx                    # Supplier performance scorecard
│   ├── RecommendationsPage.tsx              # AI mitigation action plans
│   ├── CommunicationsPage.tsx               # Supplier inquiry templates
│   └── SettingsPage.tsx                     # Workspace configuration & display settings
├── data/
│   └── mockData.ts                          # Comprehensive demonstration dataset
└── index.css                                # Design system tokens (glass, neu, dark/light themes)
```

---

## ♿ Accessibility & Reduced Motion

- Text contrasts strictly adhere to WCAG standards across dark translucent backgrounds.
- Risk levels are accompanied by text labels, distinct icons, and numeric scores—never communicated by color alone.
- Supports `prefers-reduced-motion`: 3D continuous rotations and particle flows gracefully pause or settle to static camera angles for users with motion sensitivity.
- Accessible tabular data view toggleable in the Supply Network Intelligence visualization.

---

## 📄 License

Proprietary demonstration project for SupplyShield AI.
