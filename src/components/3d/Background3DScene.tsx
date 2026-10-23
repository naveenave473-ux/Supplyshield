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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030305]">
      <img
        src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/f1631235-0a76-464d-8f1d-2c4b48a997d5.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center sm:object-bottom opacity-100"
      />
    </div>
  );
};

export const Background3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoReady(true))
          .catch(() => setIsVideoReady(true));
      }
    }
  }, []);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Three.js Scene with Deep Black Atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

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
    renderer.toneMappingExposure = 1.05;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Volumetric Industrial Lighting with Feather Chromatic Aura
    const ambientLight = new THREE.AmbientLight(0x171665, 2.0);
    scene.add(ambientLight);

    const keyWhiteLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyWhiteLight.position.set(10, 12, 10);
    scene.add(keyWhiteLight);

    // Cyan Feather Rim Light (#0FD3F2)
    const cyanRimLight = new THREE.PointLight(0x0FD3F2, 3.2, 40);
    cyanRimLight.position.set(-10, -8, 8);
    scene.add(cyanRimLight);

    // Magenta Feather Rim Light (#921CC0)
    const magentaRimLight = new THREE.PointLight(0x921CC0, 3.0, 40);
    magentaRimLight.position.set(10, 8, 8);
    scene.add(magentaRimLight);

    const softFillLight = new THREE.DirectionalLight(0x082495, 1.2);
    softFillLight.position.set(0, -10, -5);
    scene.add(softFillLight);

    // 3. Construct 3D Shield Sculpture
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(5.2, -0.4, -2.5);

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

    // Metallic liquid-glass material in Midnight Void (#1D0445)
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1D0445,
      emissive: 0x082495,
      emissiveIntensity: 0.35,
      roughness: 0.18,
      metalness: 0.85,
      transparent: true,
      opacity: 0.65,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shieldGroup.add(shieldMesh);

    // Glowing edge wireframe on shield in Neon Cyan (#0FD3F2)
    const edgesGeo = new THREE.EdgesGeometry(shieldGeometry, 25);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x0FD3F2,
      transparent: true,
      opacity: 0.70,
      linewidth: 1,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    shieldGroup.add(edgeLines);

    // Inner glowing core polyhedron with Magenta & Cyan (#921CC0 / #0FD3F2)
    const coreGeo = new THREE.OctahedronGeometry(1.0, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0FD3F2,
      emissive: 0x921CC0,
      emissiveIntensity: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    shieldGroup.add(coreMesh);

    // Orbital ring 1 in Neon Cyan (#0FD3F2)
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x0FD3F2,
      transparent: true,
      opacity: 0.55,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    shieldGroup.add(ring1);

    // Orbital ring 2 in Electric Magenta (#921CC0)
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x921CC0,
      transparent: true,
      opacity: 0.50,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    shieldGroup.add(ring2);

    scene.add(shieldGroup);

    // 4. Digital Supply-Chain Constellation Particles (Neon Cyan)
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

    const particlesMat = new THREE.PointsMaterial({
      color: 0x0FD3F2,
      size: 0.14,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 5. Connected Constellation Lines (Cerulean Cyan)
    const linePositions: number[] = [];
    const maxDistance = 7;
    for (let i = 0; i < 75; i++) {
      for (let j = i + 1; j < 75; j++) {
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
      color: 0x007CB8,
      transparent: true,
      opacity: 0.22,
    });
    const constellationLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(constellationLines);

    // 6. Floating Low-Poly Metallic Polyhedrons in Spatial Depth (Amethyst & Void)
    const floatingCrystals: THREE.Mesh[] = [];
    const crystalGeo = new THREE.IcosahedronGeometry(0.8, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x1D0445,
      emissive: 0x4C128A,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
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

    // 7. Pointer Responsive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (prefersReducedMotion) return;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) * 0.0005;
      mouseY = (event.clientY - windowHalfY) * 0.0005;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Tab Visibility Performance Optimization
    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow continuous rotation of SupplyShield
        shieldGroup.rotation.y = Math.sin(elapsedTime * 0.22) * 0.3 + 0.15;
        shieldGroup.rotation.x = Math.cos(elapsedTime * 0.18) * 0.1;
        shieldGroup.position.y = -0.4 + Math.sin(elapsedTime * 0.45) * 0.25;

        // Counter-rotating inner core and orbital rings
        coreMesh.rotation.y += 0.012;
        coreMesh.rotation.x += 0.008;
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.0025;

        // Gentle drift of background particles
        particlesMesh.rotation.y = elapsedTime * 0.01;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.008) * 0.04;
        constellationLines.rotation.y = elapsedTime * 0.01;

        // Slow tumbling of floating background polyhedrons
        floatingCrystals.forEach((crystal, idx) => {
          crystal.rotation.x += 0.003 * (idx % 2 === 0 ? 1 : -1);
          crystal.rotation.y += 0.005;
          crystal.position.y += Math.sin(elapsedTime * 0.5 + idx) * 0.0025;
        });

        // Gentle camera parallax lerping
        targetCameraX += (mouseX * 3.5 - targetCameraX) * 0.035;
        targetCameraY += (-mouseY * 2.5 - targetCameraY) * 0.035;
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);

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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030305]"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden="true"
    >
      {/* 3D Spinning Dotted Particle Globe Media Plate */}
      <div id="globe-bg-media" className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-500">
        {/* Still layer: immediate baseline poster with identical geometry */}
        <img
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/f1631235-0a76-464d-8f1d-2c4b48a997d5.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-bottom opacity-100"
        />

        {/* Video layer: 4s loop rotating steadily left to right with glowing rim and sliding particle rings */}
        <video
          ref={videoRef}
          src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e71aea27-a808-4ae3-8231-a469d49285d4.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center sm:object-bottom transition-opacity duration-700 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Glass Coin Chips along the background light lines */}
        <div className="hidden md:flex absolute left-[7%] top-[36%] w-10 h-10 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md items-center justify-center text-sm font-semibold text-white/90 shadow-lg">
          ₿
        </div>
        <div className="hidden md:flex absolute right-[8%] top-[30%] w-10 h-10 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md items-center justify-center text-sm font-semibold text-white/90 shadow-lg">
          Ξ
        </div>
        <div className="hidden md:flex absolute left-[10%] bottom-[20%] w-10 h-10 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md items-center justify-center text-sm font-semibold text-white/90 shadow-lg">
          ₮
        </div>
        <div className="hidden md:flex absolute right-[9%] bottom-[24%] w-10 h-10 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md items-center justify-center text-sm font-semibold text-white/90 shadow-lg">
          ⬡
        </div>

        {/* Soft edge feathering that preserves full center globe vibrancy */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 65%, rgba(3, 3, 5, 0.75) 100%)',
          }}
        />
      </div>

      {/* Three.js Canvas container for metallic orbital elements & particles */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
