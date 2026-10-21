import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Utility to check if WebGL is supported
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Graceful CSS Fallback when WebGL is unavailable
const FallbackBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#0FD3F2]/[0.07] rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#921CC0]/[0.07] rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-[#082495]/[0.06] rounded-full blur-[130px]" />
    </div>
  );
};

export const Background3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check WebGL support
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. Initialize Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1d0445, 0.038); // Swatch 4: Midnight Void

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

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

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Clean container before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup with 7-Color Palette
    const ambientLight = new THREE.AmbientLight(0x171665, 1.6); // Swatch 3: Midnight Indigo
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x0fd3f2, 3.2, 30); // Swatch 7: Neon Cyan
    cyanPointLight.position.set(10, 8, 8);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0x921cc0, 2.8, 30); // Swatch 1: Electric Violet
    violetPointLight.position.set(-10, -6, 6);
    scene.add(violetPointLight);

    const ceruleanDirLight = new THREE.DirectionalLight(0x007cb8, 1.2); // Swatch 6: Cerulean Cyan
    ceruleanDirLight.position.set(0, 12, 10);
    scene.add(ceruleanDirLight);

    // 4. Construct Signature SupplyShield 3D Emblem
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(5.5, -0.5, -2); // Positioned slightly offset to create elegant depth without obscuring center content

    // Create 2D shield outline shape
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 3.2);
    shieldShape.bezierCurveTo(1.6, 3.1, 2.5, 2.4, 2.6, 0.8);
    shieldShape.bezierCurveTo(2.7, -0.9, 1.5, -2.4, 0, -3.4);
    shieldShape.bezierCurveTo(-1.5, -2.4, -2.7, -0.9, -2.6, 0.8);
    shieldShape.bezierCurveTo(-2.5, 2.4, -1.6, 3.1, 0, 3.2);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.15,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Translucent glass-like material
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x171665, // Midnight Indigo
      emissive: 0x1d0445, // Midnight Void
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.45,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shieldGroup.add(shieldMesh);

    // Glowing edge wireframe on the shield (Neon Cyan)
    const edgesGeo = new THREE.EdgesGeometry(shieldGeometry, 25);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x0fd3f2,
      transparent: true,
      opacity: 0.65,
      linewidth: 1,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    shieldGroup.add(edgeLines);

    // Inner glowing core polyhedron (Electric Violet core)
    const coreGeo = new THREE.OctahedronGeometry(1.0, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x921cc0,
      emissive: 0x921cc0,
      emissiveIntensity: 1.1,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    shieldGroup.add(coreMesh);

    // Orbital ring 1 around the shield (Neon Cyan)
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x0fd3f2,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    shieldGroup.add(ring1);

    // Orbital ring 2 around the shield (Royal Violet)
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x4c128a,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    shieldGroup.add(ring2);

    scene.add(shieldGroup);

    // 5. Digital Supply-Chain Constellation Particles (Neon Cyan + Cerulean)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
      particleScales[i] = Math.random() * 2 + 1;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    // Particle Material (Neon Cyan)
    const particlesMat = new THREE.PointsMaterial({
      color: 0x0fd3f2,
      size: 0.14,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 6. Connected Constellation Lines (Cerulean Cyan)
    const linePositions: number[] = [];
    const maxDistance = 7;
    for (let i = 0; i < 80; i++) {
      for (let j = i + 1; j < 80; j++) {
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDistance) {
          linePositions.push(
            particlePositions[i * 3],
            particlePositions[i * 3 + 1],
            particlePositions[i * 3 + 2],
            particlePositions[j * 3],
            particlePositions[j * 3 + 1],
            particlePositions[j * 3 + 2]
          );
        }
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x007cb8,
      transparent: true,
      opacity: 0.22,
    });
    const constellationLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(constellationLines);

    // 7. Floating Low-Poly Geometric Crystals in the Background Depth
    const floatingCrystals: THREE.Mesh[] = [];
    const crystalGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x1d0445,
      emissive: 0x921cc0,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });

    const crystalPositions = [
      [-14, 6, -8],
      [-10, -7, -5],
      [12, 8, -10],
      [-6, 9, -12],
      [14, -8, -6],
    ];

    crystalPositions.forEach(([x, y, z]) => {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(x, y, z);
      crystal.scale.setScalar(0.7 + Math.random() * 0.6);
      scene.add(crystal);
      floatingCrystals.push(crystal);
    });

    // 8. Gentle Parallax on Mouse Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0006;
      mouseY = (event.clientY - windowHalfY) * 0.0006;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow continuous rotation of SupplyShield
        shieldGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.35 + 0.15;
        shieldGroup.rotation.x = Math.cos(elapsedTime * 0.2) * 0.12;
        shieldGroup.position.y = -0.5 + Math.sin(elapsedTime * 0.5) * 0.3;

        // Counter-rotating inner core and orbital rings
        coreMesh.rotation.y += 0.015;
        coreMesh.rotation.x += 0.01;
        ring1.rotation.z += 0.004;
        ring2.rotation.z -= 0.003;

        // Gentle drift of background particles
        particlesMesh.rotation.y = elapsedTime * 0.012;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;
        constellationLines.rotation.y = elapsedTime * 0.012;

        // Slow tumbling of floating background crystals
        floatingCrystals.forEach((crystal, idx) => {
          crystal.rotation.x += 0.004 * (idx % 2 === 0 ? 1 : -1);
          crystal.rotation.y += 0.006;
          crystal.position.y += Math.sin(elapsedTime * 0.6 + idx) * 0.003;
        });

        // Gentle camera parallax lerping
        targetCameraX += (mouseX * 4 - targetCameraX) * 0.04;
        targetCameraY += (-mouseY * 3 - targetCameraY) * 0.04;
        camera.position.x = targetCameraX;
        camera.position.y = targetCameraY;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // 11. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Memory disposal
      shieldGeometry.dispose();
      shieldMaterial.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return <FallbackBackground />;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  );
};
