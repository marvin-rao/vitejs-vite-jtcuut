import { useState } from 'react';
import './App.css';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Plane, Text } from '@react-three/drei';
import * as THREE from 'three';

type BoxProps = {
  position: [number, number, number];
  text: string;
};

const Box: React.FC<BoxProps> = ({ position, text }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    setDragging(true);
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    setDragging(false);
  };

  const handlePointerMove = (event: any) => {
    if (dragging) {
      event.stopPropagation();
      const { x, y } = event.unprojectedPoint;
      setCurrentPosition([x, y, currentPosition[2]]);
    }
  };

  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.set(...currentPosition);
    }
  });

  return (
    <mesh
      position={currentPosition}
      ref={mesh}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />

      <Text
        position={[0, 0, 0.06]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.8} // ensure the text doesn't exceed the box's width
        textAlign="center"
      >
        {text}
      </Text>
    </mesh>
  );
};

const Board: React.FC = () => {
  return (
    <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Plane args={[100, 100]} rotation-x={0}>
        <meshStandardMaterial color="lightgrey" />
      </Plane>
      <Box position={[0, 0.5, 0]} text={'Here'} />
      <Box
        position={[0.8, 0, 0]}
        text={'There this is very big i have and then'}
      />
      <OrbitControls enableRotate={false} />
    </Canvas>
  );
};

export const VirtualBoard: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Board />
    </div>
  );
};

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <VirtualBoard />
    </div>
  );
}

export default App;
