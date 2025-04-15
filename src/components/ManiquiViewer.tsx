import React, { Suspense, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// @ts-ignore
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group } from "three";

interface ManiquiProps {
  url: string;
}

const Maniqui: React.FC<ManiquiProps> = ({ url }) => {
  const fbx = useLoader(FBXLoader, url);
  const ref = useRef<Group>(null!);

  return <primitive ref={ref} object={fbx} scale={0.01} />;
};
const ManiquiViewer: React.FC = () => {
const [pose, setPose] = useState("character");
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Maniqui url={`/models/${pose}.fbx`} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>

   

      <button onClick={() => setPose("Sitting")}>Sentado</button>
      <button onClick={() => setPose("character")}>De pie</button>
    </div>
  );
};

export default ManiquiViewer;

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

// export default ManiquiViewer
