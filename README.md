# 🌍 LANDVISTA AI
### *“From Unused Land → Intelligent Future”*
#### **Smart India Hackathon (SIH) — Smart Land Utilisation & Intelligent Decision Platform**

> **“Don’t just map the land. Map its future.”**

---

## 📁 Project Structure

The project is cleanly divided into standalone **`frontend/`** and **`backend/`** folders:

```
LANDVISTA AI/
├── frontend/                     # React 18 + TypeScript + Vite + Tailwind CSS v3.4
│   ├── src/
│   │   ├── components/           # 3D Digital Twin, Leaflet GIS Map, Chat Assistant, Action Plan
│   │   ├── pages/                # Overview, Dashboard, Onboarding, Schemes, Agri, Soil/Water, Gov
│   │   ├── data/                 # Seeded Indian parcels (Solapur Hero Demo), Schemes, Crops
│   │   ├── context/              # LandContext state provider
│   │   └── utils/                # Explainable AI recommendation engine, OCR parser
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                      # Node.js + Express + Mongoose + MongoDB Atlas
│   ├── config/                   # db.js (MongoDB Atlas connection manager & fallback)
│   ├── models/                   # 12 Mongoose Schemas (User, LandParcel GeoJSON, SoilReport, etc.)
│   ├── routes/                   # REST API routes (auth, lands, analysis, soil, schemes, ai, etc.)
│   ├── seed.js                   # Idempotent MongoDB Atlas seed script
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env
│
├── package.json                  # Root workspace scripts
└── README.md
```

---

## 🛠️ Quick Start

### 1. Run Frontend (Client App)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Run Backend (API & MongoDB Server)
```bash
cd backend
npm install
npm start
```
The backend will run on **`http://localhost:5000`** with the health check at `http://localhost:5000/api/health`.

### 3. Root Workspace Commands
From the project root (`c:\LANDVISTA  AI`):
- `npm run dev` → Starts frontend development server
- `npm run dev:backend` → Starts backend development server
- `npm run build:frontend` → Builds production bundle in `frontend/dist`
- `npm run seed:backend` → Seeds MongoDB Atlas database

---

## 🎯 How to Run the SIH Demo for Judges

1. Open `http://localhost:5173` in your browser.
2. Click the prominent **“🎯 RUN SIH DEMO”** button in the top navigation bar or hero banner.
3. The platform will guide the judges through an automated 9-scene walkthrough showcasing:
   - 📍 **Locating Solapur 10-Acre Hero Parcel**
   - 🗺️ **GIS Multi-Layer Scans** (Soil, 33kV Grid, Water, Solar Irradiance)
   - ☀️ **Explainable AI Decision Engine** (Solar Farm 94/100)
   - 🎮 **3D Digital Twin Visual Morphing & Land Evolution Slider**
   - 📊 **“What-If” Economic & Resource Simulation**
   - 🏛️ **Government Scheme Matcher** (PM-KUSUM 30% CFA Subsidy)
   - 🔮 **Future Development Forecast** (Expressway & Grid expansion)
   - 📜 **Print-Ready 7-Step Land Action Plan** with celebratory confetti.
