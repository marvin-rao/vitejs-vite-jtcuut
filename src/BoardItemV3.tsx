import { useRef, useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React from 'react';

type BoxProps = {
  position: [number, number, number];
  text: string;
  onPositionChange: (index: number, position: [number, number, number]) => void;
  index: number;
};

export const BoardItemV3 = ({ position, text, onPositionChange, index }: BoxProps) => {
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
      const newPosition: [number, number, number] = [x, y, currentPosition[2]];
      setCurrentPosition(newPosition);
      onPositionChange(index, newPosition);
    }
  };

  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.set(...currentPosition);
    }
  });

  return (
    <mesh
      ref={mesh}
      position={currentPosition}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
     // onPointerOver={() => setHover(true)}
   //   onPointerOut={() => setHover(false)}
      onClick={() => setActive(!active)}
    >
      <RoundedBox args={[1, 1, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={active ? 'hotpink' : 'orange'} />
      </RoundedBox>
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

type ConnectorProps = {
  start: [number, number, number];
  end: [number, number, number];
};

export const Connector = ({ start, end }: ConnectorProps) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="black" linewidth={2} />
    </line>
  );
};
