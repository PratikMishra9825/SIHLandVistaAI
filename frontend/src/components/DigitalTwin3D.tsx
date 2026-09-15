import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  Layers, 
  Sun, 
  RotateCw, 
  Maximize2, 
  Sparkles, 
  Sliders,
  Eye,
  Camera,
  Play,
  Pause,
  Clock,
  Info
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { LandUseType } from '../types/land';

export const DigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectedParcel, activeScenario, setActiveScenario } = useLand();

  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'top' | 'isometric'>('perspective');
  const [timelineYear, setTimelineYear] = useState<number>(2033);

  // References for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activeMeshGroupRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.FogExp2(0x070b12, 0.015);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(30, 24, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d1, 2.2);
    sunLight.position.set(35, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 5. TERRAIN MESH
    const terrainGeo = new THREE.PlaneGeometry(50, 50, 48, 48);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const elevation = Math.sin(vx * 0.1) * Math.cos(vy * 0.1) * 1.2 + Math.sin(vx * 0.05) * 0.8;
      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a2634,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    scene.add(terrain);
    terrainMeshRef.current = terrain;

    // Boundary Grid Lines
    const gridHelper = new THREE.GridHelper(50, 25, 0x10b981, 0x1e293b);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // 6. DYNAMIC SCENARIO OBJECTS GROUP
    const group = new THREE.Group();
    scene.add(group);
    activeMeshGroupRef.current = group;

    populateScenarioMeshes(activeScenario, group, timelineYear);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating && group) {
        group.rotation.y += 0.002;
        terrain.rotation.z += 0.0005;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update wireframe
  useEffect(() => {
    if (terrainMeshRef.current) {
      (terrainMeshRef.current.material as THREE.MeshStandardMaterial).wireframe = wireframe;
    }
  }, [wireframe]);

  // Update camera position presets
  useEffect(() => {
    if (!cameraRef.current) return;
    if (cameraMode === 'top') {
      cameraRef.current.position.set(0, 50, 0.01);
    } else if (cameraMode === 'isometric') {
      cameraRef.current.position.set(35, 35, 35);
    } else {
      cameraRef.current.position.set(30, 24, 35);
    }
    cameraRef.current.lookAt(0, 0, 0);
  }, [cameraMode]);

  // Update scenario meshes when activeScenario or timelineYear changes
  useEffect(() => {
    if (activeMeshGroupRef.current) {
      populateScenarioMeshes(activeScenario, activeMeshGroupRef.current, timelineYear);
    }
  }, [activeScenario, timelineYear]);

  const populateScenarioMeshes = (scenario: LandUseType, group: THREE.Group, year: number) => {
    // Clear existing
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    // Scale factor based on 2026 -> 2040 evolution
    const scaleFactor = Math.max(0.1, (year - 2026) / 14);

    if (scenario === 'solar') {
      // Photovoltaic Panels
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.8,
        roughness: 0.2
      });
      const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });

      const panelCount = Math.floor(6 * scaleFactor) + 1;

      for (let r = -panelCount; r <= panelCount; r++) {
        for (let c = -4; c <= 4; c++) {
          const pGroup = new THREE.Group();
          const panelGeo = new THREE.BoxGeometry(2.4, 0.08, 1.4);
          const panel = new THREE.Mesh(panelGeo, panelMat);
          panel.rotation.x = -Math.PI / 6;
          panel.position.y = 1.1;
          panel.castShadow = true;

          const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1);
          const leg = new THREE.Mesh(legGeo, standMat);
          leg.position.y = 0.55;

          pGroup.add(panel);
          pGroup.add(leg);
          pGroup.position.set(c * 3.5, 0, r * 2.8);
          group.add(pGroup);
        }
      }

      // Central Inverter Station
      const invGeo = new THREE.BoxGeometry(4, 2.5, 3);
      const invMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
      const inverter = new THREE.Mesh(invGeo, invMat);
      inverter.position.set(0, 1.25, 0);
      inverter.castShadow = true;
      group.add(inverter);

    } else if (scenario === 'warehouse') {
      // Large Logistics Shed
      const shedGeo = new THREE.BoxGeometry(18 * scaleFactor, 6 * scaleFactor, 12 * scaleFactor);
      const shedMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const shed = new THREE.Mesh(shedGeo, shedMat);
      shed.position.set(0, (3 * scaleFactor), 0);
      shed.castShadow = true;
      group.add(shed);

      // Loading docks & Trucks
      const truckGeo = new THREE.BoxGeometry(4, 1.8, 1.6);
      const truckMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      const truck = new THREE.Mesh(truckGeo, truckMat);
      truck.position.set(8 * scaleFactor, 0.9, 0);
      group.add(truck);

    } else if (scenario === 'agriculture' || scenario === 'agro_processing') {
      // Precision Horticulture Crop Rows
      const cropMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
      for (let r = -6; r <= 6; r++) {
        for (let c = -6; c <= 6; c++) {
          const cropGeo = new THREE.ConeGeometry(0.6 * scaleFactor, 1.2 * scaleFactor, 6);
          const crop = new THREE.Mesh(cropGeo, cropMat);
          crop.position.set(c * 2.2, (0.6 * scaleFactor), r * 2.2);
          crop.castShadow = true;
          group.add(crop);
        }
      }

      // Drip lines
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      for (let r = -6; r <= 6; r++) {
        const lineGeo = new THREE.BoxGeometry(26, 0.05, 0.05);
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(0, 0.1, r * 2.2);
        group.add(line);
      }

    } else if (scenario === 'housing' || scenario === 'public_infra') {
      // Residential Blocks
      const blockMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
      for (let b = -2; b <= 2; b++) {
        const bGeo = new THREE.BoxGeometry(5, (4 + Math.abs(b) * 2) * scaleFactor, 4);
        const block = new THREE.Mesh(bGeo, blockMat);
        block.position.set(b * 7, ((4 + Math.abs(b) * 2) * scaleFactor) / 2, 0);
        block.castShadow = true;
        group.add(block);
      }
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-command-bg border border-command-border shadow-2xl flex flex-col font-sans">
      
      {/* 3D CANVAS VIEWPORT */}
      <div ref={mountRef} className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing relative" />

      {/* TOP FLOATING OVERLAY: CONTROLS & HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        
        {/* Left: Active Scenario Info */}
        <div className="pointer-events-auto hud-panel px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold uppercase">
            3D DIGITAL TWIN: {activeScenario.replace('_', ' ')}
          </span>
          <DataConfidenceBadge type="SIMULATION" label="PROCEDURAL SCENE" />
        </div>

        {/* Right: Camera & Viewport Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 hud-panel p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setCameraMode('perspective')}
            className={`px-2 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
              cameraMode === 'perspective' ? 'bg-emerald-500 text-slate-950 shadow-hud' : 'text-slate-400 hover:text-white'
            }`}
          >
            Perspective
          </button>
          <button
            onClick={() => setCameraMode('top')}
            className={`px-2 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
              cameraMode === 'top' ? 'bg-emerald-500 text-slate-950 shadow-hud' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setCameraMode('isometric')}
            className={`px-2 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
              cameraMode === 'isometric' ? 'bg-emerald-500 text-slate-950 shadow-hud' : 'text-slate-400 hover:text-white'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border ${
              isRotating ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-slate-400 border-transparent hover:text-white'
            }`}
            title="Toggle Continuous Orbit Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg border ${
              wireframe ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-slate-400 border-transparent hover:text-white'
            }`}
            title="Toggle Wireframe Terrain"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* BOTTOM FLOATING CONTROLS: SCENARIO TOGGLES & EVOLUTION TIMELINE */}
      <div className="absolute bottom-3 left-3 right-3 space-y-2 pointer-events-none">
        
        {/* Scenario Switcher Ribbon */}
        <div className="pointer-events-auto hud-panel p-1.5 rounded-xl border border-white/10 flex items-center justify-center gap-1 text-xs font-mono overflow-x-auto">
          {[
            { key: 'solar', label: '☀️ Solar Farm' },
            { key: 'warehouse', label: '📦 Logistics Shed' },
            { key: 'agriculture', label: '🌾 Precision Agri' },
            { key: 'housing', label: '🏘️ Housing Cluster' },
          ].map((sc) => (
            <button
              key={sc.key}
              onClick={() => setActiveScenario(sc.key as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
                activeScenario === sc.key
                  ? 'bg-emerald-500 text-slate-950 shadow-hud-glow scale-[1.02]'
                  : 'bg-command-surface text-slate-300 hover:text-white'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* 📅 LAND EVOLUTION TIMELINE SLIDER (2026 ──────●────── 2040) */}
        <div className="pointer-events-auto hud-panel px-4 py-2 rounded-xl border border-white/10 flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">EVOLUTION TIMELINE:</span>
            <span className="font-bold text-white text-xs">{timelineYear} ({timelineYear === 2026 ? 'Current Baseline' : timelineYear >= 2038 ? 'Mature Future' : 'Phase Growth'})</span>
          </div>

          <input
            type="range"
            min="2026"
            max="2040"
            step="1"
            value={timelineYear}
            onChange={(e) => setTimelineYear(Number(e.target.value))}
            className="w-full max-w-md accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <div className="flex items-center gap-2 text-[9px] text-slate-400 shrink-0 hidden sm:flex">
            <span>2026 Today</span>
            <span>───</span>
            <span>2040 Horizon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
