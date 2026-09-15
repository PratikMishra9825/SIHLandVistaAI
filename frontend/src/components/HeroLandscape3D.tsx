import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  Sun, 
  Compass, 
  Maximize2, 
  RotateCw, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Droplets, 
  TreePine, 
  Eye, 
  Satellite 
} from 'lucide-react';

interface IntelligenceHotspot {
  id: string;
  title: string;
  category: 'soil' | 'water' | 'grid' | 'road' | 'solar';
  value: string;
  position3D: [number, number, number];
  screenX: number;
  screenY: number;
}

export const HeroLandscape3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'ai_scan' | 'terrain_3d' | 'satellite'>('ai_scan');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [hoveredHotspot, setHoveredHotspot] = useState<IntelligenceHotspot | null>(null);
  const [activeScanStage, setActiveScanStage] = useState<'detect' | 'soil' | 'infra' | 'verdict'>('detect');

  // Animation cycle for scan stages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScanStage((prev) => {
        if (prev === 'detect') return 'soil';
        if (prev === 'soil') return 'infra';
        if (prev === 'infra') return 'verdict';
        return 'detect';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. THREE.JS SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF0F7F2); // Natural light sage sky
    scene.fog = new THREE.FogExp2(0xF0F7F2, 0.012);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
    camera.position.set(38, 28, 42);
    camera.lookAt(0, 2, 0);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. NATURAL DAYLIGHT LIGHTING
    const hemisphereLight = new THREE.HemisphereLight(0xF8FBF9, 0x8DA394, 1.2);
    scene.add(hemisphereLight);

    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 2.4);
    sunLight.position.set(45, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft Fill Sun Light for natural shadow balance
    const fillLight = new THREE.DirectionalLight(0xCFE6D6, 0.8);
    fillLight.position.set(-30, 25, -20);
    scene.add(fillLight);

    // 5. PROCEDURAL INDIAN SEMI-RURAL TERRAIN
    const terrainGroup = new THREE.Group();
    scene.add(terrainGroup);

    const terrainWidth = 70;
    const terrainHeight = 70;
    const terrainSegments = 64;
    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, terrainSegments, terrainSegments);
    const pos = terrainGeo.attributes.position;
    
    // Custom heightmap: gentle Deccan plateau slopes, flat agricultural center
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Flat central area for parcel
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      let elevation = 0;
      if (distFromCenter > 14) {
        elevation = Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 2.8 + Math.sin(vx * 0.03) * 1.5;
      } else {
        elevation = (Math.sin(vx * 0.05) + Math.cos(vy * 0.05)) * 0.4;
      }
      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    // Natural Soil & Vegetation Colors
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x829A78, // Semi-arid green sage
      roughness: 0.88,
      metalness: 0.05,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.receiveShadow = true;
    terrainGroup.add(terrainMesh);

    // 6. SURROUNDING AGRICULTURAL PATCHES (Striped Fields)
    const fieldColors = [0x5C8051, 0x96A268, 0x8C7451, 0x6E8C5A, 0xA89B6D];
    const fields = [
      { x: -20, z: -18, w: 16, h: 14, rot: 0.1, color: fieldColors[0] },
      { x: 18, z: -20, w: 18, h: 12, rot: -0.15, color: fieldColors[1] },
      { x: -22, z: 16, w: 15, h: 16, rot: 0.08, color: fieldColors[2] },
      { x: 20, z: 18, w: 16, h: 14, rot: -0.05, color: fieldColors[3] },
    ];

    fields.forEach((f) => {
      const fieldGeo = new THREE.PlaneGeometry(f.w, f.h);
      const fieldMat = new THREE.MeshStandardMaterial({
        color: f.color,
        roughness: 0.9,
        metalness: 0.02
      });
      const field = new THREE.Mesh(fieldGeo, fieldMat);
      field.rotation.x = -Math.PI / 2;
      field.rotation.z = f.rot;
      field.position.set(f.x, 0.08, f.z);
      field.receiveShadow = true;
      terrainGroup.add(field);
    });

    // 7. WATER CANAL / POND
    const waterGeo = new THREE.PlaneGeometry(38, 4);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2A6F97,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.rotation.z = 0.4;
    water.position.set(-16, 0.12, 10);
    terrainGroup.add(water);

    // 8. PAVED ASPHALT ACCESS ROAD WITH MARKINGS
    const roadGroup = new THREE.Group();
    const roadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-34, 0.14, -14),
      new THREE.Vector3(-15, 0.14, -8),
      new THREE.Vector3(0, 0.14, -7),
      new THREE.Vector3(18, 0.14, -10),
      new THREE.Vector3(34, 0.14, -16)
    ]);
    const roadPoints = roadCurve.getPoints(50);
    const roadShape = new THREE.Shape();
    roadShape.moveTo(-1.6, 0);
    roadShape.lineTo(1.6, 0);
    roadShape.lineTo(1.6, 0.08);
    roadShape.lineTo(-1.6, 0.08);
    roadShape.closePath();

    const roadGeo = new THREE.ExtrudeGeometry(roadShape, {
      extrudePath: roadCurve,
      steps: 50,
      bevelEnabled: false
    });
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x3D4540,
      roughness: 0.8,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);
    terrainGroup.add(roadGroup);

    // 9. HERO 10.2-ACRE PARCEL BOUNDARY (HIGHLIGHTED CENTER)
    const parcelGroup = new THREE.Group();
    terrainGroup.add(parcelGroup);

    // Highlighted Parcel Surface
    const parcelShapeGeo = new THREE.BufferGeometry();
    const parcelCorners = [
      new THREE.Vector3(-9, 0.18, -4),
      new THREE.Vector3(9, 0.18, -4),
      new THREE.Vector3(8, 0.18, 12),
      new THREE.Vector3(-8.5, 0.18, 11)
    ];

    // Parcel Boundary Glowing Line
    const boundaryPoints = [...parcelCorners, parcelCorners[0]];
    const boundaryLineGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryLineMat = new THREE.LineBasicMaterial({
      color: 0x15803D, // Forest Green
      linewidth: 3
    });
    const boundaryLine = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(boundaryPoints), 64, 0.12, 8, true),
      new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.3, emissive: 0x15803D, emissiveIntensity: 0.4 })
    );
    parcelGroup.add(boundaryLine);

    // Parcel Topsoil Fill
    const parcelFillGeo = new THREE.PlaneGeometry(17.5, 15.5);
    const parcelFillMat = new THREE.MeshStandardMaterial({
      color: 0x6E8565,
      roughness: 0.8,
      metalness: 0.05
    });
    const parcelFill = new THREE.Mesh(parcelFillGeo, parcelFillMat);
    parcelFill.rotation.x = -Math.PI / 2;
    parcelFill.position.set(0, 0.12, 3.8);
    parcelFill.receiveShadow = true;
    parcelGroup.add(parcelFill);

    // Sweeping AI Scan Laser Line
    const scanBarGeo = new THREE.BoxGeometry(18, 0.08, 0.3);
    const scanBarMat = new THREE.MeshStandardMaterial({
      color: 0x22C55E,
      emissive: 0x22C55E,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const scanBar = new THREE.Mesh(scanBarGeo, scanBarMat);
    scanBar.position.set(0, 0.35, 3.8);
    parcelGroup.add(scanBar);

    // 10. TREES & NATURAL VEGETATION (Neem, Banyan, Acacia style)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 1.6, 6);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.9 });
    const foliageGeo = new THREE.DodecahedronGeometry(1.3, 1);
    const foliageColors = [0x2E6F40, 0x3E8E41, 0x4B7C59, 0x688F4E];

    const treePositions = [
      // Boundary row along parcel and road
      { x: -9.5, z: -3.5 }, { x: -9.5, z: 2 }, { x: -9, z: 7 }, { x: -8.8, z: 11.5 },
      { x: 9.5, z: -3.5 }, { x: 9.2, z: 2 }, { x: 8.8, z: 7 }, { x: 8.5, z: 11.5 },
      // Roadside scattered
      { x: -16, z: -9.5 }, { x: -7, z: -8.8 }, { x: 6, z: -8.5 }, { x: 15, z: -11.5 }, { x: 24, z: -14 },
      // Distant groves
      { x: -24, z: -12 }, { x: -26, z: 8 }, { x: 26, z: 6 }, { x: 22, z: -16 }
    ];

    treePositions.forEach((pos, idx) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 0.8;
      trunk.castShadow = true;
      tree.add(trunk);

      const fMat = new THREE.MeshStandardMaterial({
        color: foliageColors[idx % foliageColors.length],
        roughness: 0.85
      });
      const foliage = new THREE.Mesh(foliageGeo, fMat);
      foliage.position.y = 1.9;
      foliage.scale.set(0.9 + (idx % 3) * 0.15, 1.0 + (idx % 2) * 0.2, 0.9 + (idx % 3) * 0.15);
      foliage.castShadow = true;
      tree.add(foliage);

      tree.position.set(pos.x, 0.1, pos.z);
      terrainGroup.add(tree);
    });

    // 11. NEARBY HOUSES / FARMSTEAD BUILDINGS
    const houseConfigs = [
      { x: -14, z: -4, w: 3.2, h: 2.2, d: 2.6, rot: 0.2 },
      { x: 14, z: -3, w: 3.8, h: 2.4, d: 2.8, rot: -0.15 },
      { x: 15, z: 6, w: 2.8, h: 1.8, d: 2.2, rot: 0.3 }
    ];

    houseConfigs.forEach((h) => {
      const house = new THREE.Group();
      // Wall
      const wallGeo = new THREE.BoxGeometry(h.w, h.h, h.d);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.8 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.y = h.h / 2;
      wall.castShadow = true;
      house.add(wall);

      // Terracotta Roof
      const roofGeo = new THREE.ConeGeometry(h.w * 0.75, 1.2, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0xB85A38, roughness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = h.h + 0.6;
      roof.castShadow = true;
      house.add(roof);

      house.position.set(h.x, 0.15, h.z);
      house.rotation.y = h.rot;
      terrainGroup.add(house);
    });

    // 12. DISTANT TRANSMISSION LINE PYLONS (ELECTRICITY GRID)
    const pylonGeo = new THREE.CylinderGeometry(0.12, 0.4, 7.5, 4);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x52605B, metalness: 0.6, roughness: 0.4 });
    const pylonPositions = [
      { x: -28, z: -25 },
      { x: -6, z: -27 },
      { x: 16, z: -28 },
      { x: 32, z: -26 }
    ];

    pylonPositions.forEach((pos) => {
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(pos.x, 3.75, pos.z);
      pylon.castShadow = true;
      terrainGroup.add(pylon);
    });

    // 13. DISTANT SOLAR ARRAYS (HORIZON)
    const solarGroup = new THREE.Group();
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1E3A8A, metalness: 0.85, roughness: 0.2 });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 1.2), solarMat);
        panel.rotation.x = -Math.PI / 6;
        panel.position.set(c * 2.4 - 5, 0.4, r * 2.0 - 2);
        solarGroup.add(panel);
      }
    }
    solarGroup.position.set(22, 0.15, -22);
    terrainGroup.add(solarGroup);

    // 14. INTERACTION & MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 38;
    let targetCameraY = 28;
    let targetCameraZ = 42;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // 15. ANIMATION LOOP
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Sweeping scan bar movement over parcel
      if (scanBar) {
        scanBar.position.z = 3.8 + Math.sin(elapsedTime * 1.5) * 6.5;
      }

      // Gentle continuous terrain rotation or mouse tilt
      if (isRotating) {
        terrainGroup.rotation.y += 0.0015;
      }

      // Camera parallax interpolation
      targetCameraX = 38 + mouseX * 6;
      targetCameraY = 28 - mouseY * 4;
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isRotating]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden bg-[#F0F7F2] border border-[#D5E1D9] shadow-sm flex flex-col font-sans select-none min-h-[500px] lg:min-h-[580px]">
      
      {/* 3D WEBGL VIEWPORT */}
      <div ref={mountRef} className="w-full h-full min-h-[500px] lg:min-h-[580px] cursor-grab active:cursor-grabbing relative" />

      {/* TOP FLOATING INTELLIGENCE HEADER */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Active Land Identity Pill */}
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#D5E1D9] shadow-sm flex items-center gap-2.5 text-xs text-[#17211B]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-ping" />
          <div>
            <span className="text-[10px] font-bold text-[#166534] block uppercase">AUTONOMOUS GIS RECONNAISSANCE</span>
            <span className="font-bold text-xs text-[#17211B]">Solapur Hero Parcel • 10.2 Acres</span>
          </div>
        </div>

        {/* Right: Controls & Layer Switcher */}
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-2xl border border-[#D5E1D9] shadow-sm flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveLayer('ai_scan')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeLayer === 'ai_scan' ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#17211B] hover:bg-[#E8F5EC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Scan</span>
          </button>

          <button
            onClick={() => setActiveLayer('terrain_3d')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeLayer === 'terrain_3d' ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#17211B] hover:bg-[#E8F5EC]'
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>3D Landscape</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl transition-all border ${
              isRotating ? 'bg-[#E8F5EC] text-[#166534] border-[#BDE3CC]' : 'bg-[#FFFFFF] text-[#64736A] border-[#D5E1D9]'
            }`}
            title="Toggle Slow Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FLOATING CONTEXTUAL INTELLIGENCE BADGES (Realistic Multi-Modal Scan) */}
      <div className="absolute top-20 left-4 space-y-2 pointer-events-none max-w-xs font-sans text-xs">
        
        {/* Step 1: Land Detected */}
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-3 rounded-2xl border border-[#D5E1D9] shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#64736A] font-bold uppercase block">BOUNDARY STATUS</span>
            <p className="font-bold text-[#17211B] text-xs">Land Detected: 10.2 Acres</p>
          </div>
        </div>

        {/* Step 2: Soil Health */}
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-3 rounded-2xl border border-[#D5E1D9] shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#166534] font-bold uppercase block">SOIL INTELLIGENCE</span>
            <p className="font-bold text-[#17211B] text-xs">Clay-Loam • pH 7.2 Optimal</p>
          </div>
        </div>

        {/* Step 3: Infrastructure & Grid */}
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-3 rounded-2xl border border-[#D5E1D9] shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#92400E] font-bold uppercase block">GRID EVACUATION</span>
            <p className="font-bold text-[#17211B] text-xs">33kV Substation • 1.2 km</p>
          </div>
        </div>
      </div>

      {/* BOTTOM INTELLIGENCE VERDICT STRIP */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-2xl border border-[#D5E1D9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#166534] uppercase font-mono">TOP AI OPPORTUNITY</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#166534] font-bold text-[10px]">94/100 Index</span>
              </div>
              <p className="font-bold text-sm text-[#17211B]">Utility Solar Park + PM-KUSUM Component A</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-[#405048] border-t sm:border-t-0 border-[#D5E1D9] pt-2 sm:pt-0">
            <div>
              <span className="text-[10px] text-[#64736A] block uppercase font-bold">WATER</span>
              <span className="font-bold text-[#17211B]">Canal 600m</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64736A] block uppercase font-bold">ROAD ACCESS</span>
              <span className="font-bold text-[#17211B]">State Highway</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64736A] block uppercase font-bold">SOLAR YIELD</span>
              <span className="font-bold text-[#15803D]">5.85 kWh/m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
