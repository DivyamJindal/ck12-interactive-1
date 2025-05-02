'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeVisualizationProps {
  isEnabled: boolean;
  material: {
    name: string;
    resistivity: number;
    color: string;
  };
  radius: number;
  length: number;
}

const WireSystem = ({ isEnabled, material, radius, length }: ThreeVisualizationProps) => {
  const wireRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Mesh[]>([]);
  const speeds = useRef<number[]>([]);
  const glowRef = useRef<THREE.Mesh>(null);
  const frameCount = useRef(0);

  // Calculate brightness based on resistance
  const area = Math.PI * Math.pow(radius / 1000, 2);
  const resistance = (material.resistivity * length) / area;
  const brightness = isEnabled ? Math.min(1, 2 / resistance) : 0;
  const glowIntensity = isEnabled ? Math.min(5, 10 / resistance) : 0;

  useEffect(() => {
    // Cleanup function
    return () => {
      // Dispose of geometries and materials
      particles.current.forEach(particle => {
        if (particle.geometry) particle.geometry.dispose();
        if (particle.material instanceof THREE.Material) particle.material.dispose();
      });
      
      if (wireRef.current) {
        if (wireRef.current.geometry) wireRef.current.geometry.dispose();
        if (wireRef.current.material instanceof THREE.Material) wireRef.current.material.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!particlesRef.current) return;

    // Clear existing particles
    particles.current.forEach(particle => {
      if (particlesRef.current) {
        particlesRef.current.remove(particle);
      }
    });
    particles.current = [];
    speeds.current = [];

    if (!isEnabled) return;

    // Create new particles
    const particleCount = 20;
    const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particles.current.push(particle);
      speeds.current.push(0.5 + Math.random() * 0.5);
      if (particlesRef.current) {
        particlesRef.current.add(particle);
      }
    }
  }, [isEnabled]);

  useFrame(({ clock }) => {
    frameCount.current += 1;
    if (frameCount.current > 1000) return; // Limit animation frames

    if (!isEnabled || !particlesRef.current) return;

    particles.current.forEach((particle, i) => {
      const time = clock.getElapsedTime() * speeds.current[i];
      const t = (time % 1);
      const angle = t * Math.PI * 2;

      particle.position.x = Math.cos(angle) * (radius * 0.15);
      particle.position.y = (t - 0.5) * length * 2;
      particle.position.z = Math.sin(angle) * (radius * 0.15);
    });

    if (wireRef.current) {
      const emissiveIntensity = isEnabled ? 0.2 : 0;
      (wireRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
    }

    if (glowRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 5) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Wire */}
      <mesh ref={wireRef} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.1, radius * 0.1, length * 2, 16, 1]} />
        <meshStandardMaterial
          color={material.color}
          metalness={0.9}
          roughness={0.1}
          emissive={material.color}
          emissiveIntensity={0}
        />
      </mesh>

      {/* End Caps */}
      <mesh position={[0, length, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -length, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Battery */}
      <group position={[0, -length - 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.15, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[-0.15, 0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      </group>

      {/* Bulb */}
      <group position={[0, length + 0.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={isEnabled ? "#ffff88" : "#fff"}
            metalness={0.1}
            roughness={0.2}
            emissive={isEnabled ? "#ffff00" : "#000"}
            emissiveIntensity={glowIntensity}
          />
        </mesh>
        
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
        </mesh>

        {isEnabled && (
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={brightness * 0.8}
            />
          </mesh>
        )}

        {isEnabled && (
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={brightness * 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Circuit Board */}
      <group position={[0, -2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[4, 0.1, 3]} />
          <meshStandardMaterial color="#4CAF50" roughness={0.8} />
        </mesh>

        {/* Circuit traces */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[1, 0.03, 8, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Component indicators */}
        {[0, Math.PI/2, Math.PI, Math.PI*3/2].map((angle, i) => (
          <group key={i} position={[Math.cos(angle), 0.06, Math.sin(angle)]}>
            <mesh>
              <boxGeometry args={[0.2, 0.02, 0.2]} />
              <meshStandardMaterial color="#2196F3" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Current Particles */}
      <group ref={particlesRef} />

      {/* Spotlights */}
      <spotLight
        position={[2, 2, 2]}
        angle={0.6}
        penumbra={0.5}
        intensity={isEnabled ? brightness * 3 : 0.5}
        color="#ffff88"
        distance={10}
        castShadow
      />
      <spotLight
        position={[-2, 2, -2]}
        angle={0.6}
        penumbra={0.5}
        intensity={isEnabled ? brightness * 3 : 0.5}
        color="#ffff88"
        distance={10}
        castShadow
      />

      {isEnabled && (
        <pointLight
          position={[0, length + 0.5, 0]}
          intensity={brightness * 2}
          color="#ffff88"
          distance={3}
        />
      )}
    </group>
  );
};

const Scene = (props: ThreeVisualizationProps) => {
  return (
    <>
      <color attach="background" args={['#111']} />
      <fog attach="fog" args={['#111', 8, 30]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} castShadow />
      
      <Grid
        args={[10, 10]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        position={[0, -2.1, 0]}
      />
      
      <WireSystem {...props} />
      
      <ContactShadows
        position={[0, -2.05, 0]}
        scale={4}
        blur={2}
        far={4}
        opacity={0.5}
      />
      
      <Environment preset="city" />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const ThreeVisualization: React.FC<ThreeVisualizationProps> = (props) => {
  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <Suspense fallback={
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="mb-2">Loading 3D Scene...</div>
              <div className="text-sm text-gray-400">This may take a few seconds</div>
            </div>
          </div>
        }>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [4, 2, 4], fov: 50 }}
            gl={{ antialias: false }}
            performance={{ min: 0.5 }}
          >
            <Scene {...props} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-xl mb-2">3D Visualization Error</h2>
            <p>Please refresh the page to try again.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ThreeVisualization;
