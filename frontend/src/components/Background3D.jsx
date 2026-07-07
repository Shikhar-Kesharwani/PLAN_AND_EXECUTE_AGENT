import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Floating particle sphere
function ParticleSphere() {
  const ref = useRef();
  const sphere = useMemo(() => {
    const pts = new Float32Array(5000 * 3);
    random.inSphere(pts, { radius: 1.5 });
    return pts;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 12;
    ref.current.rotation.y -= delta / 16;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.003}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Floating geometric torus
function FloatingTorus({ position, color, speed }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * speed;
    ref.current.rotation.y = state.clock.getElapsedTime() * speed * 0.7;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.3, 0.08, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Rotating icosahedron
function FloatingIco({ position, color }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.4;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.getElapsedTime() * 0.7) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#8b5cf6" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ec4899" intensity={0.5} />

        <ParticleSphere />

        <FloatingTorus position={[-2.5, 1.5, -1]} color="#8b5cf6" speed={0.3} />
        <FloatingTorus position={[2.5, -1, -1]}   color="#ec4899" speed={0.4} />
        <FloatingTorus position={[0, -2, -2]}      color="#06b6d4" speed={0.2} />

        <FloatingIco position={[3, 2, -1]}  color="#8b5cf6" />
        <FloatingIco position={[-3, -2, -1]} color="#10b981" />
        <FloatingIco position={[1, 3, -2]}  color="#f97316" />
      </Canvas>
    </div>
  );
}
