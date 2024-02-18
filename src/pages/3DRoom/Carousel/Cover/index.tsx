import React from 'react';
import { useLoader } from '@react-three/fiber';
import { DoubleSide, Euler, TextureLoader, Vector3} from 'three';
import { useState } from 'react';
import { Select } from '@react-three/drei';
import { Book } from 'interface/interface';

interface CoverProps {
    clickHandler: () => void;
    position: Vector3;
    rotation: Euler;
    url: string;
}

function Cover({clickHandler, position, rotation, url} : CoverProps) {

    const texture = useLoader(TextureLoader, url);
    const [scale, setScale] = useState<number>(0.05);

    return (
        <Select>
            <mesh
                scale={[scale,scale,scale]}
                position={position}
                rotation={rotation}
                onPointerOver={() => setScale(0.06)}
                onPointerOut={() => setScale(0.05)}
                onClick={clickHandler}
            >
                <planeGeometry
                    args={[21, 30]} />
                <meshStandardMaterial 
                    side = {DoubleSide}
                    attach="material"
                    map={texture}
                />
            </mesh>
        </Select>
    );
}

export default Cover;
