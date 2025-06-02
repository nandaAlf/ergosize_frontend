// import React, { Suspense, useRef, useState } from "react";
// import { Canvas, useLoader } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

// // @ts-ignore
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { Group } from "three";

// interface ManiquiProps {
//   url: string;
// }

// const Maniqui: React.FC<ManiquiProps> = ({ url }) => {
//   const fbx = useLoader(FBXLoader, url);
//   const ref = useRef<Group>(null!);

//   return <primitive ref={ref} object={fbx} scale={0.01} />;
// };
// const ManiquiViewer: React.FC = () => {
// const [pose, setPose] = useState("character");
//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <Canvas>
//         <ambientLight intensity={4} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Suspense fallback={null}>
//           <Maniqui url={`/models/${pose}.fbx`} />
//         </Suspense>
//         <OrbitControls enablePan enableZoom enableRotate />
//       </Canvas>

//       <button onClick={() => setPose("Sitting")}>Sentado</button>
//       <button onClick={() => setPose("character")}>De pie</button>
//     </div>
//   );
// };

// export default ManiquiViewer;

// import React, { Suspense } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls, useGLTF } from '@react-three/drei'
// import { GLTF } from 'three-stdlib'

// type GLTFResult = GLTF & {
//   nodes: any
//   materials: any
// }

// interface ManiquiProps {
//   url: string
// }

// const Maniqui: React.FC<ManiquiProps> = ({ url }) => {
//   const { scene } = useGLTF(url) as GLTFResult
//   return <primitive object={scene} scale={1.5} />
// }

// const ManiquiViewer: React.FC = () => {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <Canvas>
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Suspense fallback={null}>
//           <Maniqui url="/models/maniqui.glb" />
//         </Suspense>
//         <OrbitControls enablePan enableZoom enableRotate />
//       </Canvas>
//     </div>
//   )
// }
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
    // <div style={{ width: "100%", height: "100vh", backgroundColor: "#fff" }}>
    //   <Canvas
    //     camera={{
    //       position: [0, 1.5, 3],  // Posición inicial mejorada
    //       fov: 60,
    //       near: 0.1,
    //       far: 100
    //     }}
    //   >
    //     {/* <color attach="background" args={["#333"]} /> */}
    //     <ambientLight intensity={1.5} />
    //     <directionalLight
    //       position={[3, 5, 2]}
    //       intensity={1.5}
    //       castShadow
    //     />
    //     <pointLight position={[-5, 3, -5]} intensity={0.5} />

    //     <Suspense fallback={<FallbackComponent />}>
    //       <Maniqui url={`/models/${pose}.fbx`} />
    //     </Suspense>

    //     <OrbitControls
    //       enablePan={true}
    //       enableZoom={true}
    //       enableRotate={true}
    //       minDistance={1}
    //       maxDistance={10}
    //     />

    //     <gridHelper args={[10, 10, "#444", "#666"]} />
    //     <axesHelper args={[2]} />
    //   </Canvas>
    // </div>
    <div style={{ height: "100%", position: "relative" }}>
      <Canvas camera={{ position: [1, 2, 3], fov: 45 }}>
        {" "}
        //0 1.5 3 De frente
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
