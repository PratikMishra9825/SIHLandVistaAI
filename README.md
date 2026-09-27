# 🌍 LandVista AI
### **Smart Land Intelligence & Spatial Decision Platform**
*Transforming Idle & Underutilized Land into High-Value, Sustainable Development*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Simulation-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![ISRO Bhuvan](https://img.shields.io/badge/GIS-ISRO%20Bhuvan%20%7C%20ESRI-FF9933)](https://bhuvan.nrsc.gov.in/)

---

## 📌 Executive Summary

**LandVista AI** is an end-to-end geospatial land intelligence and decision platform designed for **Smart Land Utilisation**. Across India and developing economies, millions of hectares of private and public land lie idle or yield suboptimal returns due to information asymmetry, complex zoning regulations, lack of geospatial insights, and fragmented government subsidy discovery.

LandVista AI bridges this gap by unifying:
1. **Remote Sensing & Satellite GIS** (ISRO Bhuvan LULC, CartoDEM elevation, ESRI Satellite, OpenStreetMap)
2. **Ground Truth Photo Verification** (Computer vision slope and soil verification)
3. **Multi-Factor AI Recommendation Engine** (Land area, road frontage, electrical substations, water table, agro-climatic zones)
4. **Interactive 3D Digital Twin Simulation** (Three.js parcel morphological rendering)
5. **Government Policy & Subsidy Matching** (PM-KUSUM, Agriculture Infrastructure Fund, MSKVY 2.0, PMKSY)
6. **Multi-Stakeholder Workspaces** (Landowners, Government Authorities, Agronomists, Developers & Administrators)

---

## 🚀 Key Features & System Modules

### 1. 🤖 AI Land Consultant & Feasibility Engine
- **Targeted Best Recommendation:** Evaluates land size, soil composition, water depth, grid proximity, and highway connectivity to deliver a single, highest-confidence land development recommendation.
- **Economic Breakdown:** Realistic financial modeling with estimated Capex (₹ Lakhs/Cr), annual revenue yield, payback duration, and ROI projections.
- **Transparent Reasoning:** Clear "Why this recommendation?" explanations highlighting natural and infrastructural advantages without confusing jargon.

### 2. 🛰️ Geospatial GIS & Remote Sensing Integration
- **ISRO Bhuvan & ESRI Basemaps:** Real-time integration with Land Use / Land Cover (LULC 1:50,000), wasteland registries, and water body datasets.
- **Elevation & Slope Profiling:** CartoDEM terrain slope analysis with drainage direction vectors and solar irradiance modeling (kWh/m²/day).
- **Infrastructure Corridor Detection:** Proximity calculations for 33kV/11kV power substations, national/state highway road frontage, industrial corridors (MIDC), and agricultural APMC mandis.

### 3. 🎮 3D Digital Twin & Future Simulation Studio
- **Morphological Parcel Visualizer:** Three.js 3D viewport illustrating conceptual development (Ground-mounted Solar Arrays, Logistics Warehouses, Precision Horticulture, or Residential Clusters) bounded inside the survey polygon.
- **Before / After Evolution Timeline:** Smooth transition between current satellite imagery and 1-Year, 3-Year, and 5-Year operational milestones.
- **Lighting & Sun Position Simulator:** Real-time solar trajectory adjustments for daytime and golden hour raycasting.

### 4. 🏛️ Intelligent Government Scheme Matcher
- **Central & State Policy Rules:** Direct matching against Central and State programs (PM-KUSUM Component A/C, MSKVY 2.0, AIF, PMKSY, MIDH).
- **Transparent Eligibility Criteria:** Instant status badges (🟢 *Likely Eligible*, 🟡 *Requires Conditions*) with required document checklists (7/12 extract, Aadhaar, bank NOC, DISCOM permissions).
- **Exclusion Explanations ("Why Not"):** Clear reasoning when a scheme does not match due to acreage, land class, or applicant profile.

### 5. 👨‍🔬 Certified Agronomist On-Field Soil Checkup
- **End-to-End Soil Health Workflow:** Book certified field agronomists for on-site soil sampling.
- **Soil Intelligence Telemetry:** Certified parameter recording for Nitrogen (N), Phosphorus (P), Potassium (K), pH, Electrical Conductivity (EC), and Organic Carbon (OC).
- **Report Lifecycle:** Real-time booking management, lab verification, and dynamic synchronization with the AI recommendation engine.

### 6. 👥 Multi-Persona Workspaces
- **👤 Landowner / Farmer:** Plain-language land insights, soil booking, scheme matcher, and actionable 7-step roadmap.
- **🏛️ Government Authority:** Regional land bank inventory, public infrastructure prioritization (PMAY Housing, Hospitals, Schools, Solar Micro-Grids), and multi-parcel batch analysis.
- **🏗️ Developer & Investor:** Land comparison matrix, Capex/IRR feasibility modeling, and direct Expression of Interest (EOI) pipeline.
- **👨‍🔬 Soil & Land Expert:** Assigned field visits queue, GPS sampling verification, and lab report publishing.
- **🛡️ Platform Administrator:** System telemetry, 7/12 title verification queue, scheme database governance, and immutable audit logs.

### 7. 📱 Mobile-First Responsive Architecture
- Pixel-perfect alignment and zero horizontal overflow across **320px, 360px, 375px, 390px**, tablet, and ultra-wide displays.
- Sliding drawer navigation with overlay backdrops and touch-friendly controls.

---

## 🏗️ Architecture & Technology Stack

```
                       ┌─────────────────────────────────────────┐
                       │           LANDVISTA AI CLIENT           │
                       │    React 18 • TypeScript • Vite • CSS   │
                       └────────────────────┬────────────────────┘
                                            │ REST / JSON
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │          EXPRESS BACKEND ENGINE         │
                       │   Node.js • Modular Routes • JWT Auth   │
                       └───────┬─────────────┬─────────────┬─────┘
                               │             │             │
                 ┌─────────────┴──┐   ┌──────┴───────┐   ┌─┴────────────────┐
                 │ MONGODB ATLAS  │   │  ISRO BHUVAN │   │ AI ENGINE / RAG  │
                 │ 12 Collections │   │  ESRI / OSM  │   │ Decision Trees   │
                 │ GeoJSON 2dsphere│  │  GIS Layers  │   │ Multi-Criteria   │
                 └────────────────┘   └──────────────┘   └──────────────────┘
```

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite 5, Tailwind CSS v3.4 |
| **3D & Spatial Visualization** | Three.js, Canvas Confetti, Lucide Icons |
| **Mapping & GIS** | Leaflet / Mapbox GL, ESRI World Imagery, ISRO Bhuvan WMS, OpenStreetMap |
| **Backend & APIs** | Node.js, Express 4, JWT, CORS, Dotenv, Bcryptjs |
| **Database & ODM** | MongoDB Atlas, Mongoose (with GeoJSON `2dsphere` spatial indexing) |
| **AI Decision Engine** | Rule-Based Multi-Criteria Decision Analysis (MCDA), Geospatial Scoring Algorithm, Explainable RAG Knowledge Base |

---

## 📁 Repository Structure

```
SIHLandVistaAI/
├── frontend/                     # React + TypeScript + Vite Client
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── assets/               # Visual media & fallback images
│   │   ├── components/           # Reusable UI & GIS components
│   │   │   ├── AppShell.tsx      # Responsive navigation shell & drawer
│   │   │   ├── DigitalTwin3D.tsx # 3D simulation canvas
│   │   │   ├── FutureSimulationViewer.tsx # Interactive parcel simulation
│   │   │   ├── GovernmentSchemeMatcher.tsx # Subsidy evaluation engine
│   │   │   ├── MapContainer.tsx  # Interactive Leaflet/ESRI GIS map
│   │   │   ├── RecommendationDeck.tsx # AI recommendation display
│   │   │   └── *Modal.tsx        # Responsive modal dialogs
│   │   ├── context/              # AuthContext & LandContext state
│   │   ├── data/                 # Seed data (Parcels, Schemes, Crops, Experts)
│   │   ├── pages/                # Workspace views & dashboards
│   │   ├── services/             # API services & GIS connectors
│   │   ├── types/                # Strict TypeScript interfaces
│   │   └── utils/                # AI recommendation & scheme engines
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                      # Node.js + Express REST API Server
│   ├── config/                   # MongoDB connection & fallback manager
│   ├── models/                   # Mongoose Schemas (User, LandParcel, SoilReport, etc.)
│   ├── routes/                   # Modular REST endpoints (auth, lands, ai, soil, schemes, etc.)
│   ├── services/                 # Bhuvan GIS, Corridor & Spatial scoring services
│   ├── seed.js                   # Idempotent MongoDB Atlas database seeder
│   ├── server.js                 # Express application entry point
│   ├── package.json
│   └── .env.example              # Sanitized environment template
│
├── .gitignore                    # Comprehensive secrets & build artifact exclusion
├── package.json                  # Root workspace script runner
└── README.md                     # Project documentation
```

---

## ⚙️ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/PratikMishra9825/SIHLandVistaAI.git
cd SIHLandVistaAI
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration:
Create `backend/.env` based on `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/landvista
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
Bhuvan_Api_Key=your_bhuvan_api_key_optional
GEMINI_API_KEY=your_gemini_api_key_optional
```
*(Note: LandVista includes an in-memory resilient fallback if MongoDB is not connected).*

#### Frontend Configuration:
Create `frontend/.env` based on `frontend/.env.example`:
```bash
cp frontend/.env.example frontend/.env
```
Edit `frontend/.env`:
```env
VITE_MAPBOX_TOKEN=
VITE_GOOGLE_MAPS_KEY=
```

---

### Step 3: Install Dependencies

You can install dependencies for both frontend and backend from the root directory:

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

---

### Step 4: Seed Database (Optional but Recommended)
Populate the database with pre-configured parcels across Maharashtra, Rajasthan, Karnataka, and Gujarat:
```bash
cd backend
npm run seed
cd ..
```

---

### Step 5: Start Development Servers

**Option A: Running Separately**

In Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Client running at http://localhost:5173
```

**Option B: Using Root Workspace Commands**
```bash
npm run dev           # Starts Frontend (Vite)
npm run dev:backend   # Starts Backend (Nodemon)
```

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Accounts & Roles

LandVista AI provides 5 role-based personas for demonstration:

| Role | Email | Password | Access / Purpose |
|---|---|---|---|
| **Landowner / Farmer** | `farmer@landvista.ai` | `Farmer@123` | Single Land View, Soil Checkup, Scheme Matcher, Action Plan |
| **Government Authority** | `government@landvista.ai` | `Government@123` | Regional Land Bank, Public Infrastructure Allocations |
| **Soil & Land Expert** | `expert@landvista.ai` | `Expert@123` | Field Sampling Queue, Lab Telemetry, Report Issuer |
| **Developer / Investor** | `developer@landvista.ai` | `Developer@123` | Land Comparison Matrix, Financial Feasibility, EOI Pipeline |
| **Platform Administrator** | `admin@landvista.ai` | `Demo@123` | Title Verification, Scheme Governance, Audit Logs |

*(You can also use the one-click role switcher in the top navigation bar to test any persona instantly).*

---

## 🎯 9-Step SIH Demo Walkthrough

When presenting LandVista AI to judges, use the following flow:

1. **Landing Page & Cadastre Overview:** Inspect the Solapur 10.2-Acre Hero Parcel with real coordinates and survey boundaries.
2. **Satellite & GIS Remote Sensing:** View ISRO Bhuvan LULC, 33kV substation proximity, and terrain elevation analysis.
3. **AI Land Consultant Verdict:** Review the single best recommendation (**Ground-mounted Solar PV Farm**) with 94% suitability, ₹2.8 Cr Capex, and 4.2-year payback.
4. **3D Digital Twin Simulation:** Run the interactive **"VISUALIZE MY LAND"** sequence morphing satellite land into an operational facility.
5. **Government Scheme Matcher:** Inspect matched Central & State subsidies (e.g., *PM-KUSUM 30% CFA Subsidy* and *MSKVY 2.0*).
6. **On-Field Soil Checkup:** Demonstrate agronomist appointment booking and certified NPK/pH parameter updating.
7. **Government Land Bank:** Switch to Government view to review public welfare infrastructure suitability (PMAY Housing, Hospitals).
8. **Developer Investment Matrix:** Compare parcel Capex, IRR, and payback timelines side-by-side.
9. **Printable Master Action Plan:** Generate the step-by-step regulatory, technical, and execution roadmap with title verification checklist.

---

## 🔒 Security & Privacy Practices

- **Zero Secrets in Repository:** Environment variables, API keys, and connection strings are strictly ignored via [`.gitignore`](file:///.gitignore).
- **Role-Based Access Control (RBAC):** Endpoints and UI views are protected with JWT validation and role verification.
- **Landowner Privacy:** Private financial deeds and sensitive landowner documents are shielded from public queries with audit logging.
- **Clean Git History:** Sanitized commit history containing zero real credentials.

---

## 👥 Authors & Acknowledgements

- **Team:** Smart India Hackathon (SIH) Development Team
- **Project Lead & Development:** [Pratik Mishra](https://github.com/PratikMishra9825)
- **Data & Basemap Credits:** ISRO Bhuvan Geoportal, NRSC, OpenStreetMap, ESRI ArcGIS World Imagery.

---

<div align="center">
  <sub>Built with ❤️ for Smart India Hackathon (SIH) • LandVista AI © 2026</sub>
</div>
