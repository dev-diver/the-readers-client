import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Outline, Selection } from '@react-three/postprocessing';
import { Euler, Vector3 } from 'three';
import Cover from './Cover';

const defaultPlanes = 5
const defaultCovers = Array(defaultPlanes).fill('/mock/algo.png')

function Carousel({ numPlanes = defaultPlanes, radius = 5 , covers = defaultCovers}) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    // 각 프레임마다 그룹을 회전
    useFrame(() => {
        if(groupRef.current){
            groupRef.current.rotation.y += 0.002;
        }
    });

    const planes = useMemo(() :THREE.Vector3[] => {
        return Array.from({length: numPlanes} ,(_, i) => {
            const angle = (i / numPlanes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return new Vector3(x, 0, z); // Plane의 위치
        });
    }, [numPlanes, radius]);

    return (
        <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline blur edgeStrength={100} width={1000} />
        </EffectComposer>
        <group 
            ref={groupRef}
            position={[camera.position.x, camera.position.y, camera.position.z]}
        >
            {planes.map((position, idx) => (
                <Cover
                    key={idx}
                    position={position}
                    rotation={new Euler(0,-Math.PI/2 - (idx / numPlanes) * Math.PI*2,0)}
                    url={covers[idx]}
                />
            ))}
        </group>
        </Selection>
    );
}

export default Carousel;

