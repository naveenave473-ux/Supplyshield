import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface SupplierNodeData {
  id: string;
  name: string;
  location: string;
  component: string;
  status: 'nominal' | 'risk' | 'critical' | 'alternative';
  leadTimeVariance: string;
  color: number;
  position: [number, number, number];
}

const SUPPLIER_NODES: SupplierNodeData[] = [
  {
    id: 'tokyo-semi',
    name: 'Tokyo Semiconductor Corp',
    location: 'Yokohama, JP',
    component: 'Automotive Power MOSFETs',
    status: 'nominal',
    leadTimeVariance: 'On Schedule (SLA 98.4%)',
    color: 0x3DD598, // Nominal SLA
    position: [-3.8, 1.8, 1.2],
  },
  {
    id: 'foxconn-ind',
    name: 'Foxconn Industrial Tech',
    location: 'Zhengzhou, CN',
    component: 'STM32 Microcontrollers',
    status: 'critical',
    leadTimeVariance: '+17.4 Days Delay [PORT BACKLOG]',
    color: 0xFF6B6B, // Critical Risk
    position: [3.6, 2.2, -1.0],
  },
  {
    id: 'apex-prec',
    name: 'Apex Precision Castings',
    location: 'Monterrey, MX',
    component: 'Structural Aluminum Housings',
    status: 'critical',
    leadTimeVariance: '+14.1 Days Delay [TOOLING CHURN]',
    color: 0xFF6B6B, // Critical Risk
    position: [-2.9, -2.4, 1.5],
  },
  {
    id: 'bavaria-motor',
    name: 'Bavaria Sensorik GmbH',
    location: 'Munich, DE',
    component: 'LiDAR Optical Transceivers',
    status: 'nominal',
    leadTimeVariance: 'Normal (+0.4 Days)',
    color: 0xE5E5E5, // Chrome Silver
    position: [3.4, -1.9, 1.6],
  },
  {
    id: 'alps-alpine',
    name: 'Alps Alpine Logistics',
    location: 'Osaka, JP',
    component: 'Pre-vetted Drop-in Replacement',
    status: 'alternative',
    leadTimeVariance: 'Ready for Expedited Air (3 Days)',
    color: 0xFFFFFF, // Pure White
    position: [0.2, 3.4, -1.8],
  },
  {
    id: 'shenzhen-circ',
    name: 'Shenzhen Interconnect',
    location: 'Shenzhen, CN',
    component: 'Multi-layer Flex PCBs',
    status: 'nominal',
    leadTimeVariance: 'Dock ETA: Tomorrow 08:00',
    color: 0xCCCCCC, // Silver Metallic
    position: [-3.6, -0.2, -2.2],
  },
];

interface CinematicHeroSculptureProps {
  scrollProgress?: number;
  onNodeSelect?: (node: SupplierNodeData) => void;
  className?: string;
}

export const CinematicHeroSculpture: React.FC<CinematicHeroSculptureProps> = ({
  scrollProgress = 0,
  onNodeSelect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<SupplierNodeData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  // References for animation coordination
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(scrollProgress);
  const nodeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNDC = useRef(new THREE.Vector2(-999, -999));
  const alarmLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current.targetX = x * 0.45;
    mouseRef.current.targetY = y * 0.35;
    mouseNDC.current.set(x, y);

    if (hoveredNode) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [hoveredNode]);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    mouseNDC.current.set(-999, -999);
    setHoveredNode(null);
    setTooltipPos(null);
  }, []);

  const handleClick = useCallback(() => {
    if (hoveredNode && onNodeSelect) {
      onNodeSelect(hoveredNode);
    }
  }, [hoveredNode, onNodeSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL
    try {
      const testCanvas = document.createElement('canvas');
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
      if (!isSupported) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x1d0445, 0.038);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 14.5);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting with 7-Color Palette
    const ambientLight = new THREE.AmbientLight(0x171665, 1.8);
    scene.add(ambientLight);

    const keyCyanLight = new THREE.DirectionalLight(0x0fd3f2, 3.8); // Swatch 7: Neon Cyan
    keyCyanLight.position.set(8, 10, 8);
    scene.add(keyCyanLight);

    const rimVioletLight = new THREE.DirectionalLight(0x921cc0, 3.4); // Swatch 1: Electric Violet
    rimVioletLight.position.set(-10, -8, 6);
    scene.add(rimVioletLight);

    const fillCobaltLight = new THREE.PointLight(0x082495, 2.2, 18); // Swatch 5: Cobalt Blue
    fillCobaltLight.position.set(0, -6, 4);
    scene.add(fillCobaltLight);

    // Dynamic Alarm/Focus PointLight
    const alarmLight = new THREE.PointLight(0x921cc0, 0, 15);
    alarmLight.position.set(0, 0, 2);
    scene.add(alarmLight);
    alarmLightRef.current = alarmLight;

    // 3. Central Master Assembly (Centerpiece Sculpture)
    const masterGroup = new THREE.Group();
    coreGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // A. Transparent Geometric Crystalline Shield
    // Outer shield shape with sleek automotive bevels
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.4);
    shieldShape.bezierCurveTo(2.4, 3.3, 3.3, 2.5, 3.3, 0.8);
    shieldShape.bezierCurveTo(3.3, -1.8, 1.6, -3.2, 0, -4.2);
    shieldShape.bezierCurveTo(-1.6, -3.2, -3.3, -1.8, -3.3, 0.8);
    shieldShape.bezierCurveTo(-3.3, 2.5, -2.4, 3.3, 0, 3.4);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.25,
      bevelThickness: 0.35,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();

    // Premium translucent crystalline glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x171665, // Swatch 3: Midnight Indigo
      transmission: 0.82,
      opacity: 0.75,
      transparent: true,
      roughness: 0.12,
      metalness: 0.1,
      ior: 1.45,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      specularColor: new THREE.Color(0x0fd3f2), // Swatch 7: Neon Cyan specular
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, glassMaterial);
    masterGroup.add(shieldMesh);

    // Glowing Neon Shield Contour Edge
    const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x0fd3f2, // Swatch 7: Neon Cyan
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const shieldEdgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    masterGroup.add(shieldEdgeLines);

    // B. Luminous Central Factory Core (Detroit Plant Alpha)
    const coreGroup = new THREE.Group();
    masterGroup.add(coreGroup);

    // Inner pulsating icosahedron core
    const coreGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0fd3f2, // Swatch 7: Bright Neon Cyan
      emissive: 0x0fd3f2,
      emissiveIntensity: 1.9,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Outer wireframe energy cage
    const cageGeo = new THREE.IcosahedronGeometry(1.4, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x921cc0, // Swatch 1: Electric Violet
      emissive: 0x921cc0,
      emissiveIntensity: 1.3,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Core point glow
    const coreLight = new THREE.PointLight(0x0fd3f2, 3.5, 9);
    coreGroup.add(coreLight);

    // C. Fine Interconnected Orbital Gyroscope Rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x0fd3f2, // Neon Cyan
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0fd3f2,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.8,
    });
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x921cc0, // Electric Violet
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x921cc0,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.65,
    });
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x007cb8, // Cerulean
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x007cb8,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.6,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.04, 16, 120), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.035, 16, 120), ringMat2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.03, 16, 120), ringMat3);

    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;

    masterGroup.add(ring1);
    masterGroup.add(ring2);
    masterGroup.add(ring3);

    // D. Floating Supplier Nodes (Interactive with Raycaster)
    const supplierGroup = new THREE.Group();
    masterGroup.add(supplierGroup);

    SUPPLIER_NODES.forEach((node) => {
      const nodeSubGroup = new THREE.Group();
      nodeSubGroup.position.set(...node.position);

      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: node.status === 'critical' ? 2.5 : 1.4,
        roughness: 0.2,
        metalness: 0.6,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.userData = { nodeData: node };
      nodeMeshesRef.current.set(node.id, sphereMesh);
      nodeSubGroup.add(sphereMesh);

      // Orbital Halo Ring around node
      const haloGeo = new THREE.RingGeometry(0.55, 0.62, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.lookAt(0, 0, 10);
      nodeSubGroup.add(haloMesh);

      // Connecting Curved Bezier Spline Tube from node to central factory core
      const pStart = new THREE.Vector3(...node.position);
      const pMid = new THREE.Vector3(
        node.position[0] * 0.45,
        node.position[1] * 0.45 + (node.position[0] > 0 ? 0.8 : -0.8),
        node.position[2] * 0.45
      );
      const pEnd = new THREE.Vector3(0, 0, 0);

      const curve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.35,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      masterGroup.add(tubeMesh);

      supplierGroup.add(nodeSubGroup);
    });

    // E. Moving Telemetry Stream Particles traveling along the curves
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);
    const particleCurves: THREE.QuadraticBezierCurve3[] = [];

    SUPPLIER_NODES.forEach((node) => {
      const pStart = new THREE.Vector3(...node.position);
      const pMid = new THREE.Vector3(
        node.position[0] * 0.45,
        node.position[1] * 0.45 + (node.position[0] > 0 ? 0.8 : -0.8),
        node.position[2] * 0.45
      );
      const pEnd = new THREE.Vector3(0, 0, 0);
      particleCurves.push(new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd));
    });

    const cCyan = new THREE.Color(0x0fd3f2); // Swatch 7: Neon Cyan
    const cMagenta = new THREE.Color(0x921cc0); // Swatch 1: Electric Violet

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = Math.random();
      const curveIndex = i % particleCurves.length;
      const pt = particleCurves[curveIndex].getPoint(particleProgress[i]);
      particlePos[i * 3] = pt.x;
      particlePos[i * 3 + 1] = pt.y;
      particlePos[i * 3 + 2] = pt.z;

      const c = i % 2 === 0 ? cCyan : cMagenta;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // 4. Background Constellation Starfield
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 35;
      starPos[i + 1] = (Math.random() - 0.5) * 35;
      starPos[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xbec7d5,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 5. Render Loop with Smooth Damping & Scroll Choreography
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax Lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Scroll choreography transform
      const scroll = scrollRef.current;
      // As user scrolls: centerpiece slowly pivots, scales slightly down, and drifts to the right
      const scrollRotationY = scroll * Math.PI * 0.8;
      const scrollRotationX = scroll * 0.35;
      const scrollOffsetX = Math.sin(scroll * Math.PI) * 1.5;

      if (masterGroup) {
        masterGroup.rotation.y = elapsedTime * 0.18 + mouseRef.current.x + scrollRotationY;
        masterGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.08 - mouseRef.current.y + scrollRotationX;
        masterGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.18;
        masterGroup.position.x = scrollOffsetX;
      }

      // Continuous Gyroscope Rings Rotation
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.x = elapsedTime * -0.28;
      ring3.rotation.y = elapsedTime * 0.42;

      // Factory Core Breathing Pulse
      const pulseScale = 1 + Math.sin(elapsedTime * 2.8) * 0.06;
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      cageMesh.rotation.y = elapsedTime * 0.5;
      cageMesh.rotation.x = elapsedTime * 0.3;

      // Update Particle Stream
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] = (particleProgress[i] + 0.004) % 1;
        const curveIndex = i % particleCurves.length;
        const pt = particleCurves[curveIndex].getPoint(particleProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Raycasting for interactive hover
      raycasterRef.current.setFromCamera(mouseNDC.current, camera);
      const interactiveMeshes = Array.from(nodeMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData.nodeData as SupplierNodeData;
        setHoveredNode(data);

        // Highlight hit node
        hit.scale.lerp(new THREE.Vector3(1.35, 1.35, 1.35), 0.2);

        // Enhance alarm light if critical
        if (alarmLightRef.current) {
          alarmLightRef.current.intensity = data.status === 'critical' ? 4.5 : 1.8;
          alarmLightRef.current.color.setHex(data.color);
        }
      } else {
        setHoveredNode(null);
        interactiveMeshes.forEach((mesh) => {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        });
        if (alarmLightRef.current) {
          alarmLightRef.current.intensity = THREE.MathUtils.lerp(
            alarmLightRef.current.intensity,
            0,
            0.05
          );
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shieldGeo.dispose();
      glassMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`relative flex items-center justify-center p-8 ${className}`}>
        <div className="w-80 h-80 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center animate-pulse">
          <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center">
            <span className="text-xs font-mono text-white/80 uppercase tracking-wider">
              3D Telemetry Active
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className={`relative w-full h-[580px] lg:h-[720px] select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 3D Atmospheric Radial Glows behind centerpiece */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-white/[0.04] rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Floating 3D Node Holographic Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-150 ease-out -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="p-3.5 rounded-2xl liquid-glass-strong border border-white/20 shadow-2xl backdrop-blur-xl min-w-[240px]">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase">
                {hoveredNode.location}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  hoveredNode.status === 'critical'
                    ? 'bg-risk-critical/20 text-risk-critical border border-risk-critical/40'
                    : hoveredNode.status === 'alternative'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-risk-low/20 text-risk-low border border-risk-low/40'
                }`}
              >
                {hoveredNode.status}
              </span>
            </div>
            <h5 className="text-xs font-semibold text-white">{hoveredNode.name}</h5>
            <p className="text-[11px] text-white/70 mt-0.5">{hoveredNode.component}</p>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-white/50">Variance:</span>
              <span
                className={`font-mono font-bold ${
                  hoveredNode.status === 'critical' ? 'text-risk-critical' : 'text-risk-low'
                }`}
              >
                {hoveredNode.leadTimeVariance}
              </span>
            </div>
            <div className="mt-1 text-[9px] text-white/70 text-right font-medium">
              Click node to isolate telemetry →
            </div>
          </div>
        </div>
      )}

      {/* Centerpiece Overlay Control Indicator */}
      <div className="absolute bottom-4 left-6 pointer-events-none flex items-center gap-2 text-[11px] font-mono text-white/70 bg-black/60 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>Interactive 3D Core • Drag to Tilt • Hover Nodes</span>
      </div>
    </div>
  );
};
