import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// @ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

interface ManiquiProps {
  url: string;
}

const Maniqui: React.FC<ManiquiProps> = ({ url }) => {
  const fbx = useLoader(FBXLoader, url);
  const ref = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!ref.current || !fbx) return;

    // Solución alternativa: escala fija basada en nombre de archivo
    const scaleFactor = 0.01;
    ref.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Centrar manualmente
    ref.current.position.set(0, -1, 0);

    scene.updateMatrixWorld(true);
  }, [fbx, scene, "character"]);

  return <primitive ref={ref} object={fbx} />;
};

const ManiquiViewer: React.FC = () => {
  const [pose] = useState("character");

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Canvas camera={{ position: [1, 2, 3], fov: 45 }}>
        {" "}
        <ambientLight intensity={4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Suspense fallback={null}>
          <Maniqui url="/models/character.fbx" />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <gridHelper args={[4, 10, "#444", "#666"]} />
        <axesHelper args={[2]} />
      </Canvas>
    </div>
  );
};

// Componente de carga mejorado
const FallbackComponent = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="red" wireframe />
  </mesh>
);

export default ManiquiViewer;
