import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Play,
  Pause,
  Eye,
  Layers,
  AlertTriangle,
  Factory,
  Truck,
  Package,
  ExternalLink,
  X,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { NeumorphicButton } from '../common/NeumorphicButton';

// Data types for 3D Supply Network
export interface SupplyNode {
  id: string;
  name: string;
  role: 'factory' | 'supplier' | 'material';
  status: 'healthy' | 'delayed' | 'critical' | 'mitigation';
  location: string;
  country: string;
  leadTime: number; // days
  riskScore: number; // 0-100
  position: [number, number, number];
  materialName?: string;
  activePoNumber?: string;
  disruptionSummary?: string;
  financialExposure?: string;
  category?: string;
}

export interface SupplyRoute {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  status: 'healthy' | 'delayed' | 'critical' | 'mitigation';
  poNumber: string;
  itemName: string;
  quantity: string;
  estimatedDelayDays: number;
  rootCause: string;
}

// 7 Representative Demo Nodes
const NETWORK_NODES: SupplyNode[] = [
  {
    id: 'factory-detroit',
    name: 'Detroit Assembly Plant Alpha',
    role: 'factory',
    status: 'critical',
    location: 'Detroit, MI',
    country: 'USA',
    leadTime: 0,
    riskScore: 76,
    position: [0, 0, 0],
    category: 'Final Assembly Facility',
    disruptionSummary: 'Line 2 at risk of shutdown in 3.2 days due to microcontroller shortage.',
    financialExposure: '$647,500 factory stoppage liability',
  },
  {
    id: 'supp-apex',
    name: 'Apex Semiconductor',
    role: 'supplier',
    status: 'critical',
    location: 'Tokyo',
    country: 'Japan',
    leadTime: 45,
    riskScore: 92,
    position: [-7.5, 3.2, 1.8],
    materialName: 'STM32 Microcontrollers',
    activePoNumber: 'PO-2026-0891',
    disruptionSummary: 'Wafer fab packaging delay + customs hold. Shipment delayed by +17 days.',
    financialExposure: '$312,000 potential downtime impact',
    category: 'Tier-1 Microelectronics',
  },
  {
    id: 'supp-rheinmetall',
    name: 'Rheinmetall Micro',
    role: 'supplier',
    status: 'critical',
    location: 'Munich',
    country: 'Germany',
    leadTime: 42,
    riskScore: 88,
    position: [-6.2, -3.8, -2.5],
    materialName: 'Power MOSFET Switches',
    activePoNumber: 'PO-2026-0895',
    disruptionSummary: 'European freight rail strike + North Sea port container backlog (+14 days).',
    financialExposure: '$185,500 production buffer loss',
    category: 'Power Electronics',
  },
  {
    id: 'supp-nippon',
    name: 'Nippon Precision Fasteners',
    role: 'supplier',
    status: 'delayed',
    location: 'Osaka',
    country: 'Japan',
    leadTime: 38,
    riskScore: 78,
    position: [3.4, 5.8, -2.2],
    materialName: 'Titanium Bolts & Bushings',
    activePoNumber: 'PO-2026-0902',
    disruptionSummary: 'Titanium ingot raw material batch quality re-inspection (+12 days).',
    financialExposure: '$76,000 safety stock depletion',
    category: 'Fasteners & Hardware',
  },
  {
    id: 'supp-seoul',
    name: 'Seoul Battery Systems',
    role: 'supplier',
    status: 'delayed',
    location: 'Seoul',
    country: 'South Korea',
    leadTime: 28,
    riskScore: 64,
    position: [7.2, -2.4, 2.6],
    materialName: 'Lithium-Ion Cell Packs',
    activePoNumber: 'PO-2026-0914',
    disruptionSummary: 'Factory running at 88% capacity utilization; dispatch queued +4 days.',
    financialExposure: '$45,000 buffer buffer delta',
    category: 'Energy Storage Systems',
  },
  {
    id: 'supp-flexlogic',
    name: 'FlexLogic Cables',
    role: 'supplier',
    status: 'healthy',
    location: 'Monterrey',
    country: 'Mexico',
    leadTime: 14,
    riskScore: 18,
    position: [-4.8, 5.2, -3.5],
    materialName: 'High-Density Wire Harnesses',
    activePoNumber: 'PO-2026-0888',
    disruptionSummary: 'Cross-border overland freight cleared Laredo border. On schedule.',
    financialExposure: '$0 (Normal Operations)',
    category: 'Wiring & Connectors',
  },
  {
    id: 'supp-shenzhen',
    name: 'Shenzhen Display Corp',
    role: 'supplier',
    status: 'healthy',
    location: 'Shenzhen',
    country: 'China',
    leadTime: 21,
    riskScore: 24,
    position: [5.2, -5.2, -1.8],
    materialName: '6.5" OLED Dash Panels',
    activePoNumber: 'PO-2026-0899',
    disruptionSummary: 'Air cargo flight CX-882 departed on schedule. Pre-cleared by customs.',
    financialExposure: '$0 (Normal Operations)',
    category: 'Optoelectronics',
  },
  {
    id: 'supp-alps',
    name: 'Alps Alpine (AI Mitigation Alt)',
    role: 'supplier',
    status: 'mitigation',
    location: 'Osaka',
    country: 'Japan',
    leadTime: 8,
    riskScore: 15,
    position: [-1.8, 6.2, 3.8],
    materialName: 'STM32 Spec-Compatible MCU',
    activePoNumber: 'PROPOSED-MIT-01',
    disruptionSummary: 'AI identified 14,000 units ready in Osaka. Expedited air transit saves 11 days.',
    financialExposure: '+$312,000 protected factory value',
    category: 'Expedited AI Alternative',
  },
  // Intermediate Material Nodes
  {
    id: 'mat-stm32',
    name: 'STM32 Microcontrollers',
    role: 'material',
    status: 'critical',
    location: 'In-Transit (Pacific)',
    country: 'Global',
    leadTime: 17,
    riskScore: 94,
    position: [-3.8, 1.6, 0.9],
    materialName: 'STM32F407VGT6',
    activePoNumber: 'PO-2026-0891',
    disruptionSummary: '3.2 days remaining inventory buffer at Detroit plant.',
    financialExposure: '$312,000 shutdown risk',
  },
  {
    id: 'mat-mosfet',
    name: 'Power MOSFET Switches',
    role: 'material',
    status: 'critical',
    location: 'In-Transit (Atlantic)',
    country: 'Global',
    leadTime: 14,
    riskScore: 86,
    position: [-3.1, -1.9, -1.2],
    materialName: 'IRFB4110PBF',
    activePoNumber: 'PO-2026-0895',
    disruptionSummary: 'Safety stock drops to 5.4 days by Friday.',
    financialExposure: '$185,500',
  },
  {
    id: 'mat-fasteners',
    name: 'Titanium Fasteners',
    role: 'material',
    status: 'delayed',
    location: 'In-Transit (Air)',
    country: 'Global',
    leadTime: 12,
    riskScore: 72,
    position: [1.8, 2.9, -1.1],
    materialName: 'TI-M6-GR5',
    activePoNumber: 'PO-2026-0902',
    disruptionSummary: 'Lead time stretched from 26 to 38 days.',
    financialExposure: '$76,000',
  },
  {
    id: 'mat-lithium',
    name: 'Lithium Cell Packs',
    role: 'material',
    status: 'delayed',
    location: 'In-Transit (Pacific Ocean)',
    country: 'Global',
    leadTime: 4,
    riskScore: 60,
    position: [3.6, -1.2, 1.3],
    materialName: 'NMC-21700-50E',
    activePoNumber: 'PO-2026-0914',
    disruptionSummary: 'Shipment tracking shows 4 days delay into Seattle Port.',
    financialExposure: '$45,000',
  },
  {
    id: 'mat-harness',
    name: 'Wire Harness Assemblies',
    role: 'material',
    status: 'healthy',
    location: 'Overland (Texas)',
    country: 'North America',
    leadTime: 0,
    riskScore: 16,
    position: [-2.4, 2.6, -1.7],
    materialName: 'WH-AUTO-HV-24',
    activePoNumber: 'PO-2026-0888',
    disruptionSummary: 'Arriving at Detroit loading bay Thursday 09:00 EST.',
    financialExposure: '$0',
  },
  {
    id: 'mat-oled',
    name: 'OLED Dash Panels',
    role: 'material',
    status: 'healthy',
    location: 'Air Cargo (Chicago ORD)',
    country: 'Global',
    leadTime: 0,
    riskScore: 20,
    position: [2.6, -2.6, -0.9],
    materialName: 'DSP-65-OLED-HD',
    activePoNumber: 'PO-2026-0899',
    disruptionSummary: 'Customs release confirmed; scheduled dock arrival Wednesday.',
    financialExposure: '$0',
  },
];

// Connecting routes from Suppliers -> Materials -> Factory
const NETWORK_ROUTES: SupplyRoute[] = [
  {
    id: 'route-apex-stm32',
    fromNodeId: 'supp-apex',
    toNodeId: 'mat-stm32',
    status: 'critical',
    poNumber: 'PO-2026-0891',
    itemName: 'STM32 Microcontrollers',
    quantity: '10,000 units',
    estimatedDelayDays: 17,
    rootCause: 'Foundry testing yield drop & air-cargo backlog in Narita',
  },
  {
    id: 'route-stm32-factory',
    fromNodeId: 'mat-stm32',
    toNodeId: 'factory-detroit',
    status: 'critical',
    poNumber: 'PO-2026-0891',
    itemName: 'STM32 Microcontrollers',
    quantity: '10,000 units',
    estimatedDelayDays: 17,
    rootCause: 'Plant buffer exhaustion countdown: 3.2 days',
  },
  {
    id: 'route-rheinmetall-mosfet',
    fromNodeId: 'supp-rheinmetall',
    toNodeId: 'mat-mosfet',
    status: 'critical',
    poNumber: 'PO-2026-0895',
    itemName: 'Power MOSFET Switches',
    quantity: '25,000 units',
    estimatedDelayDays: 14,
    rootCause: 'Hamburg port crane strike & rail transport disruption',
  },
  {
    id: 'route-mosfet-factory',
    fromNodeId: 'mat-mosfet',
    toNodeId: 'factory-detroit',
    status: 'critical',
    poNumber: 'PO-2026-0895',
    itemName: 'Power MOSFET Switches',
    quantity: '25,000 units',
    estimatedDelayDays: 14,
    rootCause: 'Impacts Hybrid Inverter line assembly starting next week',
  },
  {
    id: 'route-nippon-fasteners',
    fromNodeId: 'supp-nippon',
    toNodeId: 'mat-fasteners',
    status: 'delayed',
    poNumber: 'PO-2026-0902',
    itemName: 'Titanium Fasteners',
    quantity: '50,000 pcs',
    estimatedDelayDays: 12,
    rootCause: 'Raw ingot metallurgical certificate verification delay',
  },
  {
    id: 'route-fasteners-factory',
    fromNodeId: 'mat-fasteners',
    toNodeId: 'factory-detroit',
    status: 'delayed',
    poNumber: 'PO-2026-0902',
    itemName: 'Titanium Fasteners',
    quantity: '50,000 pcs',
    estimatedDelayDays: 12,
    rootCause: 'Moderate safety buffer remains (11 days)',
  },
  {
    id: 'route-seoul-lithium',
    fromNodeId: 'supp-seoul',
    toNodeId: 'mat-lithium',
    status: 'delayed',
    poNumber: 'PO-2026-0914',
    itemName: 'Lithium-Ion Cell Packs',
    quantity: '3,500 modules',
    estimatedDelayDays: 4,
    rootCause: 'Cell assembly queue overload at Incheon facility',
  },
  {
    id: 'route-lithium-factory',
    fromNodeId: 'mat-lithium',
    toNodeId: 'factory-detroit',
    status: 'delayed',
    poNumber: 'PO-2026-0914',
    itemName: 'Lithium-Ion Cell Packs',
    quantity: '3,500 modules',
    estimatedDelayDays: 4,
    rootCause: 'Estimated dock arrival delayed by 96 hours',
  },
  {
    id: 'route-flexlogic-harness',
    fromNodeId: 'supp-flexlogic',
    toNodeId: 'mat-harness',
    status: 'healthy',
    poNumber: 'PO-2026-0888',
    itemName: 'Wire Harness Assemblies',
    quantity: '4,200 sets',
    estimatedDelayDays: 0,
    rootCause: 'On track: Passed customs check at Laredo freight terminal',
  },
  {
    id: 'route-harness-factory',
    fromNodeId: 'mat-harness',
    toNodeId: 'factory-detroit',
    status: 'healthy',
    poNumber: 'PO-2026-0888',
    itemName: 'Wire Harness Assemblies',
    quantity: '4,200 sets',
    estimatedDelayDays: 0,
    rootCause: 'Estimated dock delivery on schedule',
  },
  {
    id: 'route-shenzhen-oled',
    fromNodeId: 'supp-shenzhen',
    toNodeId: 'mat-oled',
    status: 'healthy',
    poNumber: 'PO-2026-0899',
    itemName: 'OLED Dash Panels',
    quantity: '6,000 units',
    estimatedDelayDays: 0,
    rootCause: 'Air transit confirmed; cleared Chicago O’Hare processing',
  },
  {
    id: 'route-oled-factory',
    fromNodeId: 'mat-oled',
    toNodeId: 'factory-detroit',
    status: 'healthy',
    poNumber: 'PO-2026-0899',
    itemName: 'OLED Dash Panels',
    quantity: '6,000 units',
    estimatedDelayDays: 0,
    rootCause: 'Dock delivery within 24 hours',
  },
  {
    id: 'route-alps-stm32',
    fromNodeId: 'supp-alps',
    toNodeId: 'mat-stm32',
    status: 'mitigation',
    poNumber: 'PROPOSED-MIT-01',
    itemName: 'STM32 Compatible MCU',
    quantity: '14,000 units',
    estimatedDelayDays: -11,
    rootCause: 'AI sourcing plan: Expedited air route reduces line stop risk to 0%',
  },
];

export const SupplyNetworkIntelligence3D: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);

  // UI Interactive States
  const [selectedNode, setSelectedNode] = useState<SupplyNode | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<SupplyRoute | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SupplyNode | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'at-risk' | 'healthy'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [viewPerspective, setViewPerspective] = useState<'3d' | 'top'>('3d');
  const [showTableView, setShowTableView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for 3D state control
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const sceneRotation = useRef({ x: 0.35, y: -0.45 });
  const targetRotation = useRef({ x: 0.35, y: -0.45 });
  const cameraZoom = useRef(20);
  const targetCameraZoom = useRef(20);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const filterModeRef = useRef(filterMode);
  filterModeRef.current = filterMode;

  // Filtered nodes and routes
  const filteredNodes = useMemo(() => {
    if (filterMode === 'all') return NETWORK_NODES;
    if (filterMode === 'at-risk') {
      return NETWORK_NODES.filter(
        (n) => n.status === 'critical' || n.status === 'delayed' || n.role === 'factory'
      );
    }
    return NETWORK_NODES.filter(
      (n) => n.status === 'healthy' || n.status === 'mitigation' || n.role === 'factory'
    );
  }, [filterMode]);

  const filteredRoutes = useMemo(() => {
    if (filterMode === 'all') return NETWORK_ROUTES;
    if (filterMode === 'at-risk') {
      return NETWORK_ROUTES.filter((r) => r.status === 'critical' || r.status === 'delayed');
    }
    return NETWORK_ROUTES.filter((r) => r.status === 'healthy' || r.status === 'mitigation');
  }, [filterMode]);

  // Reset Camera View
  const handleResetView = () => {
    targetRotation.current = { x: 0.35, y: -0.45 };
    targetCameraZoom.current = 20;
    setViewPerspective('3d');
  };

  // Switch perspective between 3D angle and top-down orbital
  const handleTogglePerspective = () => {
    if (viewPerspective === '3d') {
      setViewPerspective('top');
      targetRotation.current = { x: Math.PI / 2 - 0.05, y: 0 };
      targetCameraZoom.current = 24;
    } else {
      setViewPerspective('3d');
      targetRotation.current = { x: 0.35, y: -0.45 };
      targetCameraZoom.current = 20;
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.025);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, cameraZoom.current);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }
    mount.appendChild(renderer.domElement);

    // 2. Lighting Setup (Monochrome Industrial Key, Rim, and Fill)
    const ambientLight = new THREE.AmbientLight(0x222222, 2.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(10, 15, 12);
    scene.add(mainLight);

    const whitePointLight = new THREE.PointLight(0xffffff, 2.8, 30);
    whitePointLight.position.set(0, 5, 8);
    scene.add(whitePointLight);

    const rimSilverLight = new THREE.PointLight(0xcccccc, 2.0, 25);
    rimSilverLight.position.set(-8, -4, 6);
    scene.add(rimSilverLight);

    // 3. Create Root Pivot Group for mouse orbital rotation
    const networkPivot = new THREE.Group();
    scene.add(networkPivot);

    // Deep Obsidian Ground Radar Grid Disk
    const radarDiskGeo = new THREE.RingGeometry(0.1, 11, 48);
    const radarDiskMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const radarDisk = new THREE.Mesh(radarDiskGeo, radarDiskMat);
    radarDisk.rotation.x = Math.PI / 2;
    radarDisk.position.y = -1.2;
    networkPivot.add(radarDisk);

    // Radar Concentric Grid Rings (Translucent Monochrome Silver/White)
    [3.5, 6.5, 9.5].forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xffffff : 0x888888,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx % 2 === 0 ? 0.2 : 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.18;
      networkPivot.add(ring);
    });

    // Monochrome Industrial Color Mapper with restrained status accents
    const statusColors = {
      critical: 0xffffff, // Luminous white-hot pulse
      delayed: 0xe5a53d,  // Muted amber variance
      healthy: 0xd4d4d4,  // Polished chrome silver
      mitigation: 0xffffff, // Pure white mitigation
    };

    // 4. Construct 3D Nodes
    const nodeMeshes = new Map<string, THREE.Mesh>();
    const nodeGlowRings = new Map<string, THREE.Mesh>();
    const nodeDataMap = new Map<string, SupplyNode>();

    NETWORK_NODES.forEach((node) => {
      nodeDataMap.set(node.id, node);
      const isFactory = node.role === 'factory';
      const isMaterial = node.role === 'material';
      const color = isFactory ? 0xffffff : statusColors[node.status];

      let geometry: THREE.BufferGeometry;
      if (isFactory) {
        // Central Factory: illuminated octahedron diamond core with metallic frame
        geometry = new THREE.OctahedronGeometry(1.2, 0);
      } else if (isMaterial) {
        // Material Node: small crisp faceted diamond
        geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
      } else {
        // Supplier Node: illuminated icosahedron sphere
        geometry = new THREE.IcosahedronGeometry(0.7, 1);
      }

      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: isFactory ? 0.8 : 0.6,
        roughness: 0.2,
        metalness: 0.5,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = { nodeId: node.id, nodeData: node };

      // Wireframe overlay for a high-tech sci-fi look
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const wireMesh = new THREE.Mesh(geometry, wireframeMat);
      mesh.add(wireMesh);

      // Pulsing indicator ring for critical & delayed nodes
      if (node.status === 'critical' || node.status === 'delayed' || isFactory) {
        const ringGeo = new THREE.RingGeometry(
          isFactory ? 1.6 : 0.9,
          isFactory ? 1.75 : 1.0,
          32
        );
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const glowRing = new THREE.Mesh(ringGeo, ringMat);
        glowRing.rotation.x = Math.PI / 2;
        mesh.add(glowRing);
        nodeGlowRings.set(node.id, glowRing);
      }

      networkPivot.add(mesh);
      nodeMeshes.set(node.id, mesh);
    });

    // 5. Construct 3D Curved Bezier Supply Route Tubes
    interface RouteObject {
      route: SupplyRoute;
      curve: THREE.QuadraticBezierCurve3;
      tubeMesh: THREE.Mesh;
      packetMesh: THREE.Mesh;
      packetProgress: number;
      speed: number;
    }

    const routeObjects: RouteObject[] = [];

    NETWORK_ROUTES.forEach((route) => {
      const fromNode = nodeDataMap.get(route.fromNodeId);
      const toNode = nodeDataMap.get(route.toNodeId);
      if (!fromNode || !toNode) return;

      const p1 = new THREE.Vector3(...fromNode.position);
      const p3 = new THREE.Vector3(...toNode.position);

      // Control point with an elegant upward curve arc
      const mid = new THREE.Vector3().addVectors(p1, p3).multiplyScalar(0.5);
      const dist = p1.distanceTo(p3);
      mid.y += Math.min(2.5, dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p3);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);

      const color = statusColors[route.status];
      const tubeMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: route.status === 'critical' ? 0.7 : 0.4,
        transparent: true,
        opacity: route.status === 'critical' ? 0.75 : 0.45,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.userData = { routeId: route.id, routeData: route };
      networkPivot.add(tubeMesh);

      // Glowing animated data packets traveling along the route
      const packetGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: route.status === 'delayed' ? 0xe5a53d : 0xffffff,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      networkPivot.add(packetMesh);

      // Speed: critical routes have staggered or slower flow; healthy routes move quickly
      const baseSpeed =
        route.status === 'healthy'
          ? 0.0065
          : route.status === 'mitigation'
          ? 0.008
          : 0.0035;

      routeObjects.push({
        route,
        curve,
        tubeMesh,
        packetMesh,
        packetProgress: Math.random(),
        speed: baseSpeed,
      });
    });

    // 6. Raycasting for Mouse Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        targetRotation.current.y += deltaX * 0.006;
        targetRotation.current.x += deltaY * 0.006;
        // Clamp vertical pitch to prevent flipping
        targetRotation.current.x = Math.max(-0.2, Math.min(Math.PI / 2 - 0.02, targetRotation.current.x));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      } else {
        // Hover Raycast detection
        raycaster.setFromCamera(mouseVector, camera);
        const intersects = raycaster.intersectObjects(Array.from(nodeMeshes.values()));

        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh;
          const nodeData = hoveredMesh.userData.nodeData as SupplyNode;
          setHoveredNode(nodeData);
          mount.style.cursor = 'pointer';
        } else {
          // Check route intersect
          const routeIntersects = raycaster.intersectObjects(
            routeObjects.map((ro) => ro.tubeMesh)
          );
          if (routeIntersects.length > 0) {
            mount.style.cursor = 'pointer';
          } else {
            setHoveredNode(null);
            mount.style.cursor = 'grab';
          }
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      // Check node intersection first
      const nodeIntersects = raycaster.intersectObjects(Array.from(nodeMeshes.values()));
      if (nodeIntersects.length > 0) {
        const clickedMesh = nodeIntersects[0].object as THREE.Mesh;
        const nodeData = clickedMesh.userData.nodeData as SupplyNode;
        setSelectedNode(nodeData);
        setSelectedRoute(null);
        return;
      }

      // Check route intersection
      const routeIntersects = raycaster.intersectObjects(
        routeObjects.map((ro) => ro.tubeMesh)
      );
      if (routeIntersects.length > 0) {
        const clickedTube = routeIntersects[0].object as THREE.Mesh;
        const routeData = clickedTube.userData.routeData as SupplyRoute;
        setSelectedRoute(routeData);
        setSelectedNode(null);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraZoom.current += e.deltaY * 0.015;
      targetCameraZoom.current = Math.max(12, Math.min(32, targetCameraZoom.current));
    };

    mount.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    mount.addEventListener('click', handleClick);
    mount.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(mount);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera orbit lerp
      sceneRotation.current.x += (targetRotation.current.x - sceneRotation.current.x) * 0.08;
      sceneRotation.current.y += (targetRotation.current.y - sceneRotation.current.y) * 0.08;
      cameraZoom.current += (targetCameraZoom.current - cameraZoom.current) * 0.08;

      camera.position.z = cameraZoom.current;

      networkPivot.rotation.x = sceneRotation.current.x;
      networkPivot.rotation.y = sceneRotation.current.y;

      // Auto rotation when not dragging and not paused
      if (!isPausedRef.current && !isDraggingRef.current && !prefersReducedMotion) {
        targetRotation.current.y += 0.0012;
      }

      // Dynamic Route & Node Filtering Visibility
      const currentFilter = filterModeRef.current;

      // Pulsing glow rings for warning nodes
      nodeGlowRings.forEach((ring) => {
        const scale = 1 + Math.sin(elapsedTime * 3) * 0.12;
        ring.scale.set(scale, scale, scale);
      });

      // Subtle bobbing of nodes
      nodeMeshes.forEach((mesh, id) => {
        const node = nodeDataMap.get(id);
        if (node && !prefersReducedMotion) {
          const offset = id.length * 0.4;
          mesh.position.y = node.position[1] + Math.sin(elapsedTime * 1.5 + offset) * 0.1;
          mesh.rotation.y += 0.008;
        }

        // Filter node visibility
        if (node) {
          const isNodeVisible =
            currentFilter === 'all' ||
            node.role === 'factory' ||
            (currentFilter === 'at-risk' && (node.status === 'critical' || node.status === 'delayed')) ||
            (currentFilter === 'healthy' && (node.status === 'healthy' || node.status === 'mitigation'));
          mesh.visible = isNodeVisible;
        }
      });

      // Animated traveling packets along supply routes with filtering
      routeObjects.forEach((ro) => {
        const isRouteVisible =
          currentFilter === 'all' ||
          (currentFilter === 'at-risk' && (ro.route.status === 'critical' || ro.route.status === 'delayed')) ||
          (currentFilter === 'healthy' && (ro.route.status === 'healthy' || ro.route.status === 'mitigation'));

        ro.tubeMesh.visible = isRouteVisible;
        ro.packetMesh.visible = isRouteVisible;

        if (isRouteVisible && !isPausedRef.current && !prefersReducedMotion) {
          ro.packetProgress += ro.speed;
          if (ro.packetProgress > 1) {
            ro.packetProgress = 0;
          }
        }
        const point = ro.curve.getPointAt(ro.packetProgress);
        ro.packetMesh.position.copy(point);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      mount.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      mount.removeEventListener('click', handleClick);
      mount.removeEventListener('wheel', handleWheel);

      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      radarDiskGeo.dispose();
      radarDiskMat.dispose();
      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      routeObjects.forEach((ro) => {
        ro.tubeMesh.geometry.dispose();
        ro.packetMesh.geometry.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`liquid-glass rounded-2xl overflow-hidden transition-all duration-300 relative ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col liquid-glass-strong' : 'p-6'
      }`}
    >
      {/* Component Header with Branding & Interactive Toolbars */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 relative z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/[0.08] text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              DIGITAL TWIN
            </span>
            <span className="text-xs text-white/55 font-mono">
              Detroit Assembly Plant Alpha • 3D Telemetry
            </span>
          </div>

          <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
            Supply Network Intelligence
            <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-white/70 font-normal border border-white/[0.08]">
              Interactive 3D Material Flow
            </span>
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Spatial digital twin of active purchase orders, component transit routes, and supplier delivery risk bottlenecks.
          </p>
        </div>

        {/* 3D Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Route Filter Segmented Control */}
          <div className="flex items-center rounded-xl p-1 bg-black/50 border border-white/10 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              All Routes ({NETWORK_ROUTES.length})
            </button>
            <button
              onClick={() => setFilterMode('at-risk')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterMode === 'at-risk'
                  ? 'bg-white/25 text-white font-semibold border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              At-Risk (4)
            </button>
            <button
              onClick={() => setFilterMode('healthy')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterMode === 'healthy'
                  ? 'bg-white/25 text-white font-semibold border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Healthy (3)
            </button>
          </div>

          {/* Perspective Switch */}
          <button
            onClick={handleTogglePerspective}
            title={viewPerspective === '3d' ? 'Switch to Top-Down 2D Schematic' : 'Switch to 3D Perspective'}
            className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline font-mono">{viewPerspective.toUpperCase()}</span>
          </button>

          {/* Pause / Play Flow */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume 3D Material Flow' : 'Pause 3D Material Flow'}
            className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-white" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetView}
            title="Reset Camera View to Default"
            className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Accessible Tabular Summary */}
          <button
            onClick={() => setShowTableView(!showTableView)}
            title="Toggle Accessible Data Table View"
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              showTableView
                ? 'bg-white/20 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                : 'bg-black/50 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Data Table</span>
          </button>

          {/* Fullscreen Expand */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area with Liquid Glass HUD Overlays */}
      <div className={`relative w-full rounded-xl overflow-hidden bg-[#070707] border border-white/[0.08] ${
        isFullscreen ? 'flex-1 min-h-0' : 'h-[500px]'
      }`}>
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left Status Legend Badge Overlay */}
        <div className="dark-hud absolute top-3 left-3 p-3 rounded-xl border border-palette-cyan/30 pointer-events-none space-y-1.5 text-[11px] shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-palette-cyan font-mono mb-1 font-semibold">
            Telemetry Key
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="text-white font-medium">Critical Delay (White-Hot Pulse)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007CB8]" />
            <span className="text-white/90">Delivery Variance (Cerulean Cyan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#921CC0]" />
            <span className="text-white/90 font-medium">High Exposure (Electric Magenta)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0FD3F2] ring-1 ring-[#0FD3F2]/50" />
            <span className="text-palette-cyan font-medium">AI Mitigation Route (Neon Cyan)</span>
          </div>
        </div>

        {/* Bottom-Left Controls Instruction Hint */}
        <div className="dark-hud absolute bottom-3 left-3 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-palette-cyan/30 pointer-events-none text-[11px] text-white/90 flex items-center gap-2 font-mono shadow-lg">
          <span>Click & Drag: <strong className="text-palette-cyan font-semibold">Rotate</strong></span>
          <span className="text-white/40">•</span>
          <span>Scroll: <strong className="text-palette-cyan font-semibold">Zoom</strong></span>
          <span className="text-white/40">•</span>
          <span className="text-palette-cyan font-bold">Click Node: Inspect Details</span>
        </div>

        {/* Hover Floating HUD Tooltip */}
        {hoveredNode && !selectedNode && !selectedRoute && (
          <div className="absolute top-3 right-3 liquid-glass-strong p-3.5 rounded-xl border border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.85)] pointer-events-none max-w-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-semibold">
                {hoveredNode.role.toUpperCase()}
              </span>
              <StatusBadge status={hoveredNode.status} size="sm" />
            </div>
            <h4 className="text-sm font-medium text-white">{hoveredNode.name}</h4>
            <p className="text-xs text-white/60 mt-0.5">{hoveredNode.location}, {hoveredNode.country}</p>

            {hoveredNode.materialName && (
              <p className="text-xs text-white mt-1.5 font-mono">
                Component: <strong className="text-white">{hoveredNode.materialName}</strong>
              </p>
            )}

            <div className="mt-2 pt-2 border-t border-white/[0.08] flex justify-between text-[11px]">
              <span className="text-white/50">Risk Score:</span>
              <span className="font-mono text-white font-medium">{hoveredNode.riskScore}/100</span>
            </div>
          </div>
        )}

        {/* Node Detail Drawer / Flyout Panel */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 w-80 sm:w-96 liquid-glass-strong p-5 rounded-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-y-auto z-30 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                {selectedNode.role === 'factory' ? (
                  <Factory className="w-5 h-5 text-white" />
                ) : (
                  <Truck className="w-5 h-5 text-white" />
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                    {selectedNode.role === 'factory' ? 'Central Production Node' : 'Tier Sourcing Node'}
                  </span>
                  <h3 className="text-sm font-medium text-white leading-tight">
                    {selectedNode.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-white/50 block text-[11px]">Status Telemetry</span>
                <div className="flex items-center justify-between mt-1">
                  <StatusBadge status={selectedNode.status} size="md" />
                  <span className="font-mono font-medium text-white">
                    Risk Score: {selectedNode.riskScore}/100
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white/60">Location:</span>
                  <span className="font-mono text-white font-medium">{selectedNode.location}, {selectedNode.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Lead Time:</span>
                  <span className="font-mono text-white font-medium">{selectedNode.leadTime} days</span>
                </div>
                {selectedNode.activePoNumber && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Active PO:</span>
                    <span className="font-mono text-white font-medium">{selectedNode.activePoNumber}</span>
                  </div>
                )}
                {selectedNode.materialName && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Monitored Material:</span>
                    <span className="font-mono text-white">{selectedNode.materialName}</span>
                  </div>
                )}
              </div>

              {selectedNode.disruptionSummary && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
                    <span>Disruption Telemetry</span>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    {selectedNode.disruptionSummary}
                  </p>
                </div>
              )}

              {selectedNode.financialExposure && (
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <span className="text-white/60 block text-[11px]">Calculated Exposure</span>
                  <span className="font-mono font-medium text-sm text-white block mt-0.5">
                    {selectedNode.financialExposure}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {selectedNode.role === 'supplier' && (
                  <NeumorphicButton
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigate('/suppliers')}
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    View Vendor Telemetry
                  </NeumorphicButton>
                )}

                {selectedNode.status === 'critical' && (
                  <NeumorphicButton
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs text-white"
                    onClick={() => navigate('/recommendations')}
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Generate AI Mitigation Plan
                  </NeumorphicButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Route Detail Drawer / Flyout Panel */}
        {selectedRoute && (
          <div className="absolute top-3 right-3 bottom-3 w-80 sm:w-96 liquid-glass-strong p-5 rounded-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-y-auto z-30 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-white" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                    Transit Route Telemetry
                  </span>
                  <h3 className="text-sm font-medium text-white leading-tight">
                    {selectedRoute.poNumber} • {selectedRoute.itemName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedRoute.status} size="md" />
                <span className="font-mono text-white">
                  Batch: <strong>{selectedRoute.quantity}</strong>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white/60">Estimated Deviation:</span>
                  <span className="font-mono font-medium text-white">
                    {selectedRoute.estimatedDelayDays > 0
                      ? `+${selectedRoute.estimatedDelayDays} days slip`
                      : selectedRoute.estimatedDelayDays < 0
                      ? `${selectedRoute.estimatedDelayDays} days expedited`
                      : 'On schedule'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/15 space-y-1">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-white/70" /> Root Cause Diagnosis
                </span>
                <p className="text-white/90 leading-relaxed">{selectedRoute.rootCause}</p>
              </div>

              <div className="pt-2">
                <NeumorphicButton
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/purchase-orders')}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open in Purchase Orders
                </NeumorphicButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accessible Alternative Data View (For screen readers and high-contrast table users) */}
      {showTableView && (
        <div className="mt-4 p-4 rounded-xl liquid-glass border border-white/15 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" />
              Accessible Supply Network Data Matrix
            </h4>
            <span className="text-xs text-white/60 font-mono">
              7 Active Monitored Nodes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/50 font-mono">
                  <th className="py-2 px-3">Node / Partner</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3">Lead Time</th>
                  <th className="py-2 px-3">Risk Score</th>
                  <th className="py-2 px-3">Disruption / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredNodes.map((n) => (
                  <tr
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-white">{n.name}</td>
                    <td className="py-2.5 px-3 font-mono text-white/80 uppercase">{n.role}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={n.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-white/70">{n.location}, {n.country}</td>
                    <td className="py-2.5 px-3 font-mono text-white/80">{n.leadTime}d</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-white">{n.riskScore}/100</td>
                    <td className="py-2.5 px-3 text-white/70 max-w-xs truncate">
                      {n.disruptionSummary || 'Nominal operational status'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Monitored Transit Routes Matrix */}
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <h5 className="text-xs font-medium text-white mb-2 font-mono uppercase tracking-wider">
              Monitored Transit Paths & Purchase Orders ({filteredRoutes.length})
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-white/50 font-mono">
                    <th className="py-2 px-3">Route PO</th>
                    <th className="py-2 px-3">Material Item</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Quantity</th>
                    <th className="py-2 px-3">Deviation</th>
                    <th className="py-2 px-3">Diagnosis / Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRoutes.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRoute(r)}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3 font-mono text-white font-medium">{r.poNumber}</td>
                      <td className="py-2 px-3 text-white/90">{r.itemName}</td>
                      <td className="py-2 px-3">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="py-2 px-3 font-mono text-white/70">{r.quantity}</td>
                      <td className="py-2 px-3 font-mono font-medium">
                        {r.estimatedDelayDays > 0 ? (
                          <span className="text-[#FF6B6B]">+{r.estimatedDelayDays}d delay</span>
                        ) : r.estimatedDelayDays < 0 ? (
                          <span className="text-white font-semibold">{r.estimatedDelayDays}d expedited</span>
                        ) : (
                          <span className="text-[#3DD598]">On Schedule</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-white/70 max-w-sm truncate">{r.rootCause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Demo Simulation Disclaimer Footer */}
      <div className="canvas-disclaimer mt-3 flex items-center justify-between text-[11px] text-white/85 border-t border-white/[0.08] pt-2">
        <span className="flex items-center gap-1.5 text-white/90">
          <Info className="w-3.5 h-3.5 text-palette-cyan flex-shrink-0" />
          <span>Demonstration Simulation Data: Synthetic topology representing manufacturing intake for Detroit Assembly Plant Alpha.</span>
        </span>
        <span className="font-mono text-palette-cyan/90 bg-palette-void/70 px-2.5 py-0.5 rounded-md border border-palette-cyan/30 shadow-glow-cyan/10">WebGL 2.0 • 60 FPS Engine</span>
      </div>
    </div>
  );
};
