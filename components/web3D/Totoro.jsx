import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const group = useRef();
  const { nodes, materials } = useGLTF("./glb/Totoro.glb");
  const mesh = useRef();

  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <group ref={group} dispose={null}>
      <mesh
        ref={mesh}
        castShadow
        receiveShadow
        geometry={nodes.Body.geometry}
        material={nodes.Body.material}
        position={[0, 0, 0]}
        scale={1}
      >
        {/* <Html
          scale={1}
          rotation={[0, 0, 0]}
          position={[0, 1, 0]}
          transform
          occlude
        >
          <div className="annotation">토토로닷</div>
        </Html> */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Arms.geometry}
          material={nodes.Arms.material}
          position={[0.89, -0.2, -0.12]}
          rotation={[0, 0, 0.19]}
          scale={0.34}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Claws_arms.geometry}
            material={nodes.Claws_arms.material}
            position={[-0.04, -2.46, -0.48]}
            rotation={[0.05, 0.25, 0.06]}
            scale={0.28}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Belly.geometry}
          material={materials.belly}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Marks_belly.geometry}
            material={nodes.Marks_belly.material}
            position={[0, -0.11, 0.88]}
            rotation={[-0.52, 0, 0]}
            scale={[0.11, 0.04, 0.01]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Marks_belly001.geometry}
            material={nodes.Marks_belly001.material}
            position={[0.43, -0.3, 0.86]}
            rotation={[-0.42, 0.43, 0.18]}
            scale={[0.11, 0.04, 0.01]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Ears.geometry}
          material={nodes.Ears.material}
          position={[0.44, 0.93, 0]}
          rotation={[0, 0, -0.27]}
          scale={[0.05, 0.05, 0.05]}
        />
        <group
          position={[0.46, 0.32, 0.78]}
          rotation={[-0.24, 0.63, -0.11]}
          scale={[0.11, 0.11, 0.05]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere.geometry}
            material={materials["eyes | sclera"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere_1.geometry}
            material={materials["eyes | pupil"]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Feet.geometry}
          material={nodes.Feet.material}
          position={[0.26, -1.5, -0.12]}
          rotation={[0, -1.19, 1.63]}
          scale={[0.24, 0.18, 0.24]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Claws_feet.geometry}
            material={nodes.Claws_feet.material}
            position={[-0.72, -2.4, -0.04]}
            rotation={[0.12, 0.19, -0.22]}
            scale={[0.36, 0.58, 0.32]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Leaf_hat.geometry}
          material={materials["leaf | body"]}
          position={[0, 0.92, 0]}
          scale={0.41}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Stalk.geometry}
            material={materials["leaf | stalk"]}
            position={[0.01, 0.41, -1.3]}
            rotation={[0.08, 0, 0]}
            scale={[0.15, 0.08, 0.59]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Nose.geometry}
          material={materials.nose}
          position={[0, 0.38, 0.8]}
          rotation={[1.01, 0, 0]}
          scale={[0.13, 0.12, 0.09]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Tail.geometry}
          material={nodes.Tail.material}
          position={[0, -1.34, -0.86]}
          scale={[0.31, 0.31, 0.4]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Whiskers.geometry}
          material={materials.whiskers}
          position={[0.42, 0.2, 0.4]}
          rotation={[0, 0.35, -0.05]}
          scale={[0.04, 0.04, 0.04]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("./glb/Totoro.glb");

export const Totoro = () => {
  return (
    // <div style={{ height: "100vh" }}>
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ height: "300px" }}
    >
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-mapSize={[512, 512]}
        castShadow
      />

      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
    // </div>
  );
};
