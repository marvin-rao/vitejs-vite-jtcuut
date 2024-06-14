import { useCallback, useState } from 'react';
import { OrbitControls, Plane } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BoardItemV3, Connector } from './BoardItemV3';
import React from 'react';

export const BoardV3 = () => {
  const [boxPositions, setBoxPositions] = useState<[[number, number, number], [number, number, number]]>([
    [0, 0.5, 0],
    [0.8, 0, 0],
  ]);

  const handlePositionChange = useCallback((index: number, position: [number, number, number]) => {
    setBoxPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[index] = position;
      return newPositions as [[number, number, number], [number, number, number]];
    });
  }, []);

  return (
    <div style={{ height: '100vh', width:"100vw" }}>
    <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 100 }} shadows>
      <ambientLight intensity={1} />
      <Plane args={[100, 100]} rotation-x={0} receiveShadow>
        <meshStandardMaterial color="white" />
      </Plane>
      {boxPositions.map((position, index) => (
        <BoardItemV3 key={index} position={position} text={`Box ${index + 1}`} onPositionChange={handlePositionChange} index={index} />
      ))}
      <Connector start={boxPositions[0]} end={boxPositions[1]} />
      <OrbitControls enableRotate={false} />
    </Canvas>
    </div>
  );
};