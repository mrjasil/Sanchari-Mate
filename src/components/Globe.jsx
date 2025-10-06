"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function SpinningGlobe() {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color={new THREE.Color("#3bb3f6")}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.83, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color("#ffffff")}
          wireframe
          opacity={0.08}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function Globe() {
  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <SpinningGlobe />
        <Stars
          radius={50}
          depth={40}
          count={2500}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
