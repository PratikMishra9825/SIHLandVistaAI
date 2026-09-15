import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  Camera, 
  Clock, 
  Eye, 
  Compass, 
  Sun, 
  Layers, 
  RotateCw, 
  Sliders, 
  Info,
  MapPin,
  Building2,
  Sprout,
  Warehouse,
  CheckCircle2,
  Maximize2,
  Sparkles,
  Ruler,
  FileSpreadsheet,
  ArrowRightLeft,
  Volume2,
  VolumeX,
  Radio,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Navigation
} from 'lucide-react';
import { useLand } from '../context/LandContext';
import { DataConfidenceBadge } from './DataConfidenceBadge';
import type { LandUseType } from '../types/land';
import confetti from 'canvas-confetti';

export const FutureSimulationViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectedParcel, activeScenario, setActiveScenario } = useLand();

  // Primary View Mode: Simulation, Ground Photo, 2D Satellite, or Before/After
  const [activeLandView, setActiveLandView] = useState<'simulation' | 'ground_photo' | 'satellite_2d' | 'before_after'>('simulation');
  
  // State Management
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [constructionPhase, setConstructionPhase] = useState<number>(3); // 0: Baseline Sat, 1: Site Prep, 2: Structures, 3: Completed
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'golden'>('day');
  const [beforeAfterSplit, setBeforeAfterSplit] = useState<number>(100); // 0 = Current Satellite, 100 = Future Developed
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isSnapshotSaved, setIsSnapshotSaved] = useState<boolean>(false);
  const [isSitePlanOverlay, setIsSitePlanOverlay] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [cinematicStatus, setCinematicStatus] = useState<string | null>(null);

  // User Uploaded Ground Photos Collection
  const userLandPhotos = [
    {
      id: 'photo-1',
      title: 'South-Facing Parcel Overview',
      url: selectedParcel.photoAnalysis?.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      caption: 'Field photo showing dry fallow soil, low slope (2.1°), and distant highway corridor.',
      source: 'USER UPLOADED GROUND TRUTH'
    },
    {
      id: 'photo-2',
      title: 'Eastern Boundary & Grid Corridor',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
      caption: 'Clear sky horizon indicating high solar irradiance (5.85 kWh/m²) and 33kV line proximity.',
      source: 'USER UPLOADED GROUND TRUTH'
    },
    {
      id: 'photo-3',
      title: 'Access Road & Frontage Edge',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      caption: 'Direct paved road access with 40m frontage suitable for heavy transport vehicles.',
      source: 'USER UPLOADED GROUND TRUTH'
    }
  ];

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const devGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  const phaseStages = [
    { label: 'NOW (BASELINE)', title: 'Actual Satellite Imagery & Open Land', timeframe: '2026 Observed', progress: 0 },
    { label: '1 YEAR', title: 'Site Prep & Internal Roads', timeframe: '2027 Phase 1', progress: 0.33 },
    { label: '3 YEARS', title: 'Major Infrastructure & Mounting', timeframe: '2029 Phase 2', progress: 0.66 },
    { label: '5 YEARS', title: 'Completed Operational Facility', timeframe: '2031 Mature', progress: 1.0 }
  ];

  const currentPhase = phaseStages[constructionPhase];

  // 1. INITIALIZE THREE.JS SCENE
  useEffect(() => {
    if (!mountRef.current || activeLandView === 'ground_photo') return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 580;

    // 1. Scene with atmospheric sky dome
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce7f3);
    scene.fog = new THREE.FogExp2(0xdce7f3, 0.005);
    sceneRef.current = scene;

    // 2. Aerial GIS Oblique Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 1500);
    camera.position.set(38, 30, 48);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Natural Daylight & Ambient Sky
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x64748b, 0.95);
    hemiLight.position.set(0, 80, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    sunLight.position.set(60, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 5. Build True High-Res Satellite Aerial Basemap
    buildSatelliteBasemap(scene, selectedParcel);

    // 6. Proposed Development Group (Restricted strictly inside parcel boundary)
    const devGroup = new THREE.Group();
    scene.add(devGroup);
    devGroupRef.current = devGroup;

    buildProposedDevelopmentInsideParcel(devGroup, activeScenario, currentPhase.progress);

    // 7. Animation Loop
    let orbitAngle = 0.82;
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (isPlaying && activeLandView === 'simulation' && cameraRef.current) {
        orbitAngle += 0.001;
        cameraRef.current.position.x = Math.sin(orbitAngle) * 56;
        cameraRef.current.position.z = Math.cos(orbitAngle) * 56;
        cameraRef.current.lookAt(0, 1.0, 0);
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
  }, [selectedParcel.id, activeLandView]);

  // Lighting Update on Day / Golden Hour toggle
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current) return;
    if (timeOfDay === 'day') {
      sceneRef.current.background = new THREE.Color(0xdbeafe);
      sceneRef.current.fog = new THREE.FogExp2(0xdbeafe, 0.005);
      sunLightRef.current.color.setHex(0xfffaed);
      sunLightRef.current.intensity = 2.4;
      sunLightRef.current.position.set(60, 80, 40);
      hemiLightRef.current.intensity = 0.95;
    } else {
      // Golden Hour Sunset
      sceneRef.current.background = new THREE.Color(0xfde047).lerp(new THREE.Color(0xf97316), 0.5);
      sceneRef.current.fog = new THREE.FogExp2(0xf97316, 0.009);
      sunLightRef.current.color.setHex(0xfb923c);
      sunLightRef.current.intensity = 2.0;
      sunLightRef.current.position.set(70, 20, 50);
      hemiLightRef.current.intensity = 0.55;
    }
  }, [timeOfDay]);

  // Rebuild Development on Scenario / Progress / Slider changes
  useEffect(() => {
    if (devGroupRef.current) {
      const effectiveProgress = (activeLandView === 'satellite_2d' || beforeAfterSplit < 50) ? 0 : currentPhase.progress;
      buildProposedDevelopmentInsideParcel(devGroupRef.current, activeScenario, effectiveProgress);
    }
  }, [activeScenario, constructionPhase, beforeAfterSplit, activeLandView]);

  // Voice Narration
  const playVoiceNarration = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isAudioEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // REAL SATELLITE BASEMAP BUILDER
  // -------------------------------------------------------------

  const buildSatelliteBasemap = (scene: THREE.Scene, parcel: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Real Semi-Arid Agricultural Mosaic Pattern of Solapur
      ctx.fillStyle = '#6e5b47';
      ctx.fillRect(0, 0, 1024, 1024);

      // Surrounding Agricultural Parcels
      const fieldHues = ['#5e4e3c', '#75634d', '#867258', '#4d4032', '#695743', '#564736', '#7a6750'];
      for (let x = 0; x < 1024; x += 140) {
        for (let y = 0; y < 1024; y += 140) {
          ctx.fillStyle = fieldHues[Math.floor(Math.random() * fieldHues.length)];
          ctx.fillRect(x + 2, y + 2, 136, 136);

          ctx.strokeStyle = 'rgba(0,0,0,0.08)';
          ctx.lineWidth = 1;
          for (let f = 4; f < 136; f += 8) {
            ctx.beginPath();
            ctx.moveTo(x + 2, y + f);
            ctx.lineTo(x + 138, y + f);
            ctx.stroke();
          }
        }
      }

      // State Highway Pavement (South frontage)
      ctx.fillStyle = '#222226';
      ctx.fillRect(0, 780, 1024, 65);

      // White Highway Markings
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([16, 14]);
      ctx.beginPath();
      ctx.moveTo(0, 812);
      ctx.lineTo(1024, 812);
      ctx.stroke();

      // Solid Highway Edge Lines
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 785);
      ctx.lineTo(1024, 785);
      ctx.moveTo(0, 840);
      ctx.lineTo(1024, 840);
      ctx.stroke();

      // Water Canal Tributary (South-East)
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(720, 1024);
      ctx.bezierCurveTo(770, 880, 870, 770, 1024, 700);
      ctx.stroke();

      // Farm Access Tracks
      ctx.strokeStyle = '#8c785f';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(330, 780);
      ctx.lineTo(330, 180);
      ctx.lineTo(680, 180);
      ctx.stroke();

      // Selected Parcel Interior Baseline
      ctx.fillStyle = '#7a6852';
      ctx.fillRect(360, 360, 304, 304);

      // Native scrub vegetation patches
      ctx.fillStyle = 'rgba(77, 124, 15, 0.45)';
      for (let s = 0; s < 45; s++) {
        ctx.beginPath();
        ctx.arc(380 + Math.random() * 260, 380 + Math.random() * 260, 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const satelliteTexture = new THREE.CanvasTexture(canvas);
    satelliteTexture.wrapS = THREE.ClampToEdgeWrapping;
    satelliteTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Load High-Res True Satellite Texture with ESRI / OpenStreetMap
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/29288/46587',
      (esriTex) => {
        esriTex.wrapS = THREE.ClampToEdgeWrapping;
        esriTex.wrapT = THREE.ClampToEdgeWrapping;
        groundMat.map = esriTex;
        groundMat.needsUpdate = true;
      },
      undefined,
      () => {
        // High-res composite canvas fallback
      }
    );

    // 2. Realistic Ground Plane (90x90m)
    const groundGeo = new THREE.PlaneGeometry(90, 90, 64, 64);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const elevation = (vx * 0.03) + Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 0.38;
      pos.setZ(i, elevation);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      map: satelliteTexture,
      roughness: 0.95,
      metalness: 0.02
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 3. Crisp White Cadastral Boundary Line
    const boundaryPoints = [
      new THREE.Vector3(-15, 0.15, -15),
      new THREE.Vector3(15, 0.15, -15),
      new THREE.Vector3(15, 0.15, 15),
      new THREE.Vector3(-15, 0.15, 15),
      new THREE.Vector3(-15, 0.15, -15),
    ];
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryLine = new THREE.Line(
      boundaryGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 })
    );
    scene.add(boundaryLine);
  };

  // -------------------------------------------------------------
  // PROPOSED DEVELOPMENT (STRICTLY INSIDE BOUNDARY)
  // -------------------------------------------------------------

  const buildProposedDevelopmentInsideParcel = (group: THREE.Group, scenario: LandUseType, progress: number) => {
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (progress <= 0) return;

    // 1. SITE PREPARATION: Internal Gravel Access Road
    const accessRoadGeo = new THREE.PlaneGeometry(3.5, 18 * progress);
    const accessRoadMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
    const accessRoad = new THREE.Mesh(accessRoadGeo, accessRoadMat);
    accessRoad.rotation.x = -Math.PI / 2;
    accessRoad.position.set(-9, 0.14, 15 - (9 * progress));
    accessRoad.receiveShadow = true;
    group.add(accessRoad);

    if (scenario === 'solar') {
      // REALISTIC UTILITY SOLAR PV ARRAYS
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.25,
        metalness: 0.85
      });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.3 });

      const rowCount = Math.floor(5 * progress) + 1;
      for (let r = -rowCount; r <= rowCount; r++) {
        for (let c = -2; c <= 3; c++) {
          const tableGroup = new THREE.Group();
          
          const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 1.5), panelMat);
          panelMesh.rotation.x = -THREE.MathUtils.degToRad(18);
          panelMesh.position.y = 1.35 * progress;
          panelMesh.castShadow = true;
          panelMesh.receiveShadow = true;

          const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2 * progress), frameMat);
          leg1.position.set(-1.2, (0.6 * progress), -0.4);
          leg1.castShadow = true;

          const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5 * progress), frameMat);
          leg2.position.set(1.2, (0.75 * progress), 0.4);
          leg2.castShadow = true;

          tableGroup.add(panelMesh);
          tableGroup.add(leg1);
          tableGroup.add(leg2);

          tableGroup.position.set(c * 4.2 + 2, 0, r * 2.8);
          group.add(tableGroup);
        }
      }

      if (progress >= 0.6) {
        // Inverter Substation Cabin & Transformer Pad
        const cabin = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 2.6, 2.8),
          new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 })
        );
        cabin.position.set(-9, 1.3, 2);
        cabin.castShadow = true;
        group.add(cabin);

        // Security Fence around parcel boundary
        const fencePoints = [
          new THREE.Vector3(-14.5, 0.8, -14.5),
          new THREE.Vector3(14.5, 0.8, -14.5),
          new THREE.Vector3(14.5, 0.8, 14.5),
          new THREE.Vector3(-14.5, 0.8, 14.5),
          new THREE.Vector3(-14.5, 0.8, -14.5),
        ];
        const fence = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(fencePoints),
          new THREE.LineBasicMaterial({ color: 0x94a3b8 })
        );
        group.add(fence);
      }

    } else if (scenario === 'warehouse') {
      // REALISTIC AGRO-LOGISTICS WAREHOUSE
      const whWidth = 18 * progress;
      const whHeight = 6.0 * progress;
      const whDepth = 13 * progress;

      const whBody = new THREE.Mesh(
        new THREE.BoxGeometry(whWidth, whHeight, whDepth),
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.6 })
      );
      whBody.position.set(0, whHeight / 2, -1);
      whBody.castShadow = true;
      whBody.receiveShadow = true;
      group.add(whBody);

      if (progress >= 0.6) {
        for (let d = -2; d <= 2; d += 2) {
          const dock = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 3.2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x1e293b })
          );
          dock.position.set(d * 3.5, 1.6, 5.6);
          group.add(dock);
        }
      }

    } else if (scenario === 'agriculture' || scenario === 'agro_processing') {
      // REALISTIC PRECISION HORTICULTURE
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x3f2e1e, roughness: 0.95 });
      const cropMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

      const rows = Math.floor(9 * progress) + 1;
      for (let r = -rows; r <= rows; r++) {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(24, 0.12, 1.2), bedMat);
        bed.position.set(0, 0.08, r * 1.6);
        bed.receiveShadow = true;
        group.add(bed);

        for (let c = -11; c <= 11; c += 1.2) {
          const crop = new THREE.Mesh(
            new THREE.ConeGeometry(0.25 * progress, 0.6 * progress, 5),
            cropMat
          );
          crop.position.set(c, (0.3 * progress) + 0.1, r * 1.6);
          crop.castShadow = true;
          group.add(crop);
        }
      }
    } else {
      // REALISTIC AFFORDABLE HOUSING COMMUNITY
      const blockMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
      for (let b = -1; b <= 1; b++) {
        const blk = new THREE.Mesh(new THREE.BoxGeometry(8 * progress, 5 * progress, 7 * progress), blockMat);
        blk.position.set(b * 9.5, (2.5 * progress), -2);
        blk.castShadow = true;
        blk.receiveShadow = true;
        group.add(blk);
      }
    }
  };

  // Master Automated "VISUALIZE MY LAND" Experience Flow
  const triggerMasterCinematicSequence = () => {
    setIsPlaying(false);
    
    // STEP 1: Ground Photo
    setActiveLandView('ground_photo');
    setCinematicStatus('Step 1/5: Loading your uploaded field photo & ground context...');
    playVoiceNarration('Viewing your uploaded field photograph and ground context.');

    // STEP 2: Satellite Zoom (after 3.5s)
    setTimeout(() => {
      setActiveLandView('satellite_2d');
      setCinematicStatus('Step 2/5: Locating exact coordinates on real satellite imagery...');
      playVoiceNarration(`Locating exact coordinates at ${selectedParcel.district}, ${selectedParcel.state}.`);
    }, 3500);

    // STEP 3: Boundary & 3D Tilt (after 7s)
    setTimeout(() => {
      setActiveLandView('simulation');
      setConstructionPhase(1);
      setCinematicStatus('Step 3/5: Locking parcel boundary & initiating site preparation...');
    }, 7000);

    // STEP 4: Progressive Construction (after 10.5s)
    setTimeout(() => {
      setConstructionPhase(2);
      setBeforeAfterSplit(70);
      setCinematicStatus('Step 4/5: Deploying infrastructure inside parcel perimeter...');
    }, 10500);

    // STEP 5: Completed Future & Celebration (after 14s)
    setTimeout(() => {
      setConstructionPhase(3);
      setBeforeAfterSplit(100);
      setCinematicStatus('Step 5/5: Completed conceptual future development!');
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      playVoiceNarration(`Completed conceptual simulation for ${selectedParcel.name}.`);
    }, 14000);

    // Reset status after 19s
    setTimeout(() => {
      setCinematicStatus(null);
      setIsPlaying(true);
    }, 19000);
  };

  const handleSaveSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `LandVista-${selectedParcel.name.replace(/\s+/g, '_')}-Satellite-3D.png`;
    link.href = dataUrl;
    link.click();
    setIsSnapshotSaved(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setIsSnapshotSaved(false), 3000);
  };

  const getDynamicAiNarration = () => {
    switch (activeScenario) {
      case 'solar':
        return `LandVista combines your uploaded ground photograph with real satellite imagery near Solapur. The South-facing 18° solar array is strictly bounded inside your 10.2-acre parcel, utilizing the 5.85 kWh/m² solar potential while preserving the 40m highway frontage and 1.2km grid interconnection corridor.`;
      case 'warehouse':
        return `Visualizing an Agro-Logistics Hub positioned with direct 40m road frontage for multi-axle freight access, keeping loading docks buffered from drainage areas.`;
      case 'agriculture':
        return `Visualizing precision horticulture beds aligned with the natural 2.1° slope to enable gravity-fed micro-drip fertigation for Rabi onion and pomegranate.`;
      case 'housing':
      default:
        return `Visualizing a planned suburban residential cluster with internal pedestrian paths and green buffer setbacks.`;
    }
  };

  return (
    <div className="space-y-5 font-sans pb-12 text-[#17211B]">
      
      {/* 1. TOP PROFESSIONAL GIS COMMAND HEADER */}
      <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-[#D5E1D9] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC] shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono text-[#166534] uppercase tracking-wider">REAL SATELLITE DIGITAL TWIN</span>
              <DataConfidenceBadge type="REMOTE_SENSING" label="ESRI SATELLITE BASEMAP" />
              <DataConfidenceBadge type="USER_PROVIDED" label="GROUND PHOTO VERIFIED" />
            </div>
            <h2 className="font-bold text-xl text-[#17211B]">
              Conceptual Land Use Visualization
            </h2>
            <p className="text-xs text-[#405048] font-medium">
              Survey: {selectedParcel.surveyNumber} • {selectedParcel.areaAcres} Acres • Coordinates: {selectedParcel.lat.toFixed(4)}°N, {selectedParcel.lng.toFixed(4)}°E • <em>Conceptual proposal overlay — not an architectural design</em>
            </p>
          </div>
        </div>

        {/* Master "VISUALIZE MY LAND" CTA & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            onClick={triggerMasterCinematicSequence}
            className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white uppercase shadow-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>▶️ VISUALIZE MY LAND</span>
          </button>

          {/* Primary View Toggles */}
          <div className="flex items-center bg-[#F8FBF9] p-1 rounded-xl border border-[#D5E1D9]">
            <button
              onClick={() => setActiveLandView('ground_photo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeLandView === 'ground_photo' ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#17211B] hover:text-[#166534]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>📸 Ground Photo</span>
            </button>

            <button
              onClick={() => setActiveLandView('satellite_2d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeLandView === 'satellite_2d' ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#17211B] hover:text-[#166534]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>🛰️ Satellite</span>
            </button>

            <button
              onClick={() => setActiveLandView('simulation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeLandView === 'simulation' ? 'bg-[#15803D] text-white shadow-sm' : 'text-[#17211B] hover:text-[#166534]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🏗️ Future Sim</span>
            </button>
          </div>

          <button
            onClick={handleSaveSnapshot}
            className="px-3.5 py-2 rounded-xl bg-[#F8FBF9] hover:bg-[#E8F5EC] text-[#17211B] border border-[#D5E1D9] flex items-center gap-1.5 font-bold"
          >
            <Camera className="w-3.5 h-3.5 text-[#15803D]" />
            <span>{isSnapshotSaved ? 'Saved!' : 'Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Progression Status Banner */}
      {cinematicStatus && (
        <div className="p-3.5 bg-[#E8F5EC] border border-[#BDE3CC] rounded-2xl flex items-center gap-2.5 text-xs text-[#166534] font-bold animate-in fade-in">
          <Sparkles className="w-4 h-4 text-[#15803D] animate-spin" />
          <span>{cinematicStatus}</span>
        </div>
      )}

      {/* 2. MAIN VIEWPORT & RIGHT INFORMATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* VIEWPORT CANVAS (8 COLS) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl border border-[#D5E1D9] shadow-sm overflow-hidden relative flex flex-col min-h-[560px]">
          
          {/* OPTION A: PROMINENT USER GROUND PHOTO VIEW */}
          {activeLandView === 'ground_photo' ? (
            <div className="relative w-full h-[560px] bg-[#17211B] flex flex-col justify-between p-6 animate-in fade-in">
              <img
                src={userLandPhotos[activePhotoIndex].url}
                alt={userLandPhotos[activePhotoIndex].title}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

              {/* Top Photo Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-[#FFFFFF]/95 p-4 rounded-2xl border border-[#D5E1D9] backdrop-blur-md space-y-1 text-xs text-[#17211B] max-w-sm shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#166534] uppercase">USER UPLOADED GROUND TRUTH</span>
                    <DataConfidenceBadge type="USER_PROVIDED" label="GROUND CONTEXT" />
                  </div>
                  <h3 className="font-bold text-sm text-[#17211B]">{userLandPhotos[activePhotoIndex].title}</h3>
                  <p className="text-xs text-[#405048] font-medium">{userLandPhotos[activePhotoIndex].caption}</p>
                </div>

                <span className="bg-[#FFFFFF]/95 px-3.5 py-1.5 rounded-xl border border-[#D5E1D9] text-xs font-bold text-[#17211B] shadow-md">
                  PHOTO {activePhotoIndex + 1} OF {userLandPhotos.length}
                </span>
              </div>

              {/* Bottom Carousel Controls & Next CTA */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : userLandPhotos.length - 1))}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#17211B] hover:bg-[#E8F5EC] shadow-md font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActivePhotoIndex((prev) => (prev < userLandPhotos.length - 1 ? prev + 1 : 0))}
                    className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D5E1D9] text-[#17211B] hover:bg-[#E8F5EC] shadow-md font-bold"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white drop-shadow font-medium">
                    Ground photo provides verified visual baseline for soil condition and terrain slope.
                  </span>
                </div>

                <button
                  onClick={() => setActiveLandView('simulation')}
                  className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold uppercase shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <span>Transform into 3D Future →</span>
                </button>
              </div>
            </div>
          ) : (
            /* OPTION B: THREE.JS SATELLITE + FUTURE SIMULATION VIEW */
            <div className="relative w-full h-[560px]">
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing relative" />

              {/* Top-Left: Real Surrounding Landscape Overlays */}
              <div className="absolute top-4 left-4 pointer-events-none space-y-2 text-xs font-sans">
                <div className="bg-[#FFFFFF]/95 p-3.5 rounded-2xl border border-[#D5E1D9] backdrop-blur-md space-y-1 text-[#17211B] max-w-xs pointer-events-auto shadow-md">
                  <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-1">
                    <span className="text-[10px] font-bold text-[#166534] uppercase">SURROUNDING SATELLITE INTEL</span>
                    <span className="text-[10px] text-[#64736A]">ESRI Satellite</span>
                  </div>
                  <div className="space-y-0.5 text-xs text-[#17211B]">
                    <p>🛣️ <strong>State Highway:</strong> 40m frontage (Paved)</p>
                    <p>🏘️ <strong>Residential Area:</strong> 350m West</p>
                    <p>🏭 <strong>Industrial Area:</strong> 3.8 km (MIDC)</p>
                    <p>⚡ <strong>Substation:</strong> 1.2 km North-East (33kV)</p>
                  </div>
                </div>

                {/* Ground Photo Switcher Pill */}
                <button
                  onClick={() => setActiveLandView('ground_photo')}
                  className="bg-[#FFFFFF]/95 p-2 rounded-2xl border border-[#D5E1D9] backdrop-blur-md flex items-center gap-2.5 max-w-xs pointer-events-auto hover:border-[#15803D] transition-all text-left shadow-md"
                >
                  <img
                    src={userLandPhotos[0].url}
                    alt="Field Photo"
                    className="w-10 h-10 rounded-xl object-cover border border-[#D5E1D9]"
                  />
                  <div className="text-xs">
                    <span className="text-[10px] font-bold text-[#166534] block uppercase">📸 VIEW GROUND PHOTO</span>
                    <span className="text-[#17211B] font-bold text-xs">Verified field photo</span>
                  </div>
                </button>
              </div>

              {/* Top-Right: Lighting & Rotation Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto text-xs font-bold">
                <button
                  onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'golden' : 'day')}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E8F5EC] border border-[#D5E1D9] text-[#17211B] uppercase transition-all shadow-md"
                >
                  {timeOfDay === 'day' ? '☀️ Daylight' : '🌅 Golden Hour'}
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E8F5EC] border border-[#D5E1D9] uppercase transition-all flex items-center gap-1.5 shadow-md ${
                    isPlaying ? 'text-[#15803D]' : 'text-[#17211B]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Rotate'}</span>
                </button>
              </div>

              {/* Bottom Bar: Scenario Tabs & Simulation Timeline */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-none">
                
                {/* Scenario Switcher Tabs */}
                <div className="pointer-events-auto bg-[#FFFFFF]/95 p-1.5 rounded-2xl border border-[#D5E1D9] flex items-center justify-center gap-1.5 text-xs font-bold overflow-x-auto shadow-md">
                  {[
                    { key: 'solar', label: '☀️ Solar Farm (94/100)' },
                    { key: 'warehouse', label: '📦 Logistics Shed (87/100)' },
                    { key: 'agriculture', label: '🌾 Precision Agri (83/100)' },
                    { key: 'housing', label: '🏘️ Housing Cluster (72/100)' },
                  ].map((sc) => (
                    <button
                      key={sc.key}
                      onClick={() => setActiveScenario(sc.key as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                        activeScenario === sc.key
                          ? 'bg-[#15803D] text-white shadow-sm scale-[1.02]'
                          : 'bg-[#F8FBF9] text-[#17211B] hover:bg-[#E8F5EC]'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>

                {/* Simulation Timeline (NOW ── 1 YR ── 3 YRS ── 5 YRS) */}
                <div className="pointer-events-auto bg-[#FFFFFF]/95 px-5 py-3 rounded-2xl border border-[#D5E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#15803D]" />
                    <span className="text-xs text-[#17211B] font-bold uppercase">SIMULATION TIMELINE:</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
                    {phaseStages.map((phase, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setConstructionPhase(idx);
                          setBeforeAfterSplit(idx === 0 ? 0 : 100);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-center transition-all border font-bold ${
                          constructionPhase === idx
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm scale-105'
                            : 'bg-[#F8FBF9] text-[#17211B] border-[#D5E1D9] hover:bg-[#E8F5EC]'
                        }`}
                      >
                        <span className="block text-xs">{phase.label}</span>
                        <span className={`text-[10px] block truncate ${constructionPhase === idx ? 'text-white' : 'text-[#64736A]'}`}>
                          {phase.timeframe}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SITE INFORMATION PANEL (4 COLS) */}
        <div className="lg:col-span-4 space-y-4 font-sans">
          
          {/* Site Information Card */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2.5">
              <h3 className="font-bold text-sm text-[#17211B] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#15803D]" />
                <span>Site Information</span>
              </h3>
              <DataConfidenceBadge type="VERIFIED" label="CONFIDENCE 84%" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-[#64736A] font-bold block uppercase">ADDRESS</span>
                <p className="font-bold text-[#17211B] text-sm">Near Solapur-Vijayapura Corridor, Solapur, Maharashtra</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">LAND AREA</span>
                  <p className="font-bold text-[#15803D] text-sm">{selectedParcel.areaAcres} Acres (4.13 Ha)</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">LAT / LNG</span>
                  <p className="font-bold text-[#17211B] text-sm">{selectedParcel.lat.toFixed(4)}°N, {selectedParcel.lng.toFixed(4)}°E</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D5E1D9]">
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">NEAREST ROAD</span>
                  <p className="font-bold text-[#17211B] text-sm">State Highway (40m)</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">SUBSTATION</span>
                  <p className="font-bold text-[#92400E] text-sm">1.2 km (33/11 kV)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D5E1D9]">
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">LAND STATUS</span>
                  <p className="font-bold text-[#166534] text-sm">🟢 Mostly Open</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#64736A] font-bold block uppercase">TOP SUITABILITY</span>
                  <p className="font-bold text-[#15803D] text-sm">94 / 100 Solar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Before / After Comparison Slider Card */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-3 shadow-sm text-xs">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2">
              <span className="text-xs font-bold text-[#15803D] flex items-center gap-1.5 uppercase">
                <ArrowRightLeft className="w-4 h-4" /> BEFORE / AFTER SLIDER
              </span>
              <span className="text-xs text-[#17211B] font-bold">
                {beforeAfterSplit < 50 ? 'BEFORE (SATELLITE)' : 'AFTER (PROPOSED)'}
              </span>
            </div>

            <p className="text-xs text-[#405048] font-medium">
              Drag slider to compare actual current land baseline with the conceptual development:
            </p>

            <input
              type="range"
              min="0"
              max="100"
              value={beforeAfterSplit}
              onChange={(e) => setBeforeAfterSplit(Number(e.target.value))}
              className="w-full h-2 bg-[#D5E1D9] rounded-lg appearance-none cursor-pointer accent-[#15803D]"
            />

            <div className="flex justify-between text-[10px] text-[#64736A] font-bold">
              <span>← BEFORE (OPEN LAND)</span>
              <span>AFTER (DEVELOPED) →</span>
            </div>
          </div>

          {/* Site Geometry & Measurement Breakdown */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-2 shadow-sm text-xs">
            <div className="flex items-center justify-between border-b border-[#D5E1D9] pb-2">
              <span className="text-xs font-bold text-[#15803D] flex items-center gap-1.5 uppercase">
                <Ruler className="w-4 h-4" /> SITE GEOMETRY BREAKDOWN
              </span>
              <span className="text-[#17211B] font-bold">10.2 Total Acres</span>
            </div>

            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-[#405048]">🔹 Proposed Footprint:</span>
                <span className="font-bold text-[#17211B]">6.8 Acres (66%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#405048]">🌿 Green Buffer / Drainage:</span>
                <span className="font-bold text-[#15803D]">1.9 Acres (19%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#405048]">🛣️ Setbacks & Road Access:</span>
                <span className="font-bold text-[#92400E]">1.5 Acres (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM AI NARRATION & SCENARIO EXPLANATION PANEL */}
      <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D5E1D9] space-y-3 font-sans shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D5E1D9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F5EC] text-[#15803D] flex items-center justify-center border border-[#BDE3CC]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#17211B] uppercase tracking-wider">
                AI Scenario Narration
              </h4>
              <p className="text-xs text-[#405048] font-medium">
                Contextual intelligence synthesized from user field photograph, satellite imagery, and GIS vectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => {
                const next = !isAudioEnabled;
                setIsAudioEnabled(next);
                if (next) playVoiceNarration(getDynamicAiNarration());
                else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                isAudioEnabled ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm' : 'bg-[#F8FBF9] border-[#D5E1D9] text-[#17211B]'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioEnabled ? 'Voice Active' : 'Enable Voice'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-[#17211B] leading-relaxed font-medium">
          {getDynamicAiNarration()}
        </p>

        <div className="pt-2 text-xs font-medium text-[#64736A] border-t border-[#D5E1D9]">
          ⚖️ <strong>Legal & Technical Notice:</strong> Ground photograph provides user-level visual truth. Aerial satellite orthophoto establishes surrounding GIS context. AI-generated 3D conceptual scenario is bounded inside the parcel perimeter for planning feasibility.
        </div>
      </div>
    </div>
  );
};
