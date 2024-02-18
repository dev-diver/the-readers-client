import React, {useEffect} from 'react';
import { useLoader } from '@react-three/fiber';
import { DoubleSide, Euler, TextureLoader, Vector3, Texture} from 'three';
import { useState } from 'react';
import { Select } from '@react-three/drei';

interface CoverProps {
    clickHandler: () => void;
    position: Vector3;
    rotation: Euler;
    url: string;
}

function Cover({clickHandler, position, rotation, url} : CoverProps) {
    
    const texture = useLoaderDefault(url)
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

const DEFAULT_URL = '/room/loadingCover.png';

function useLoaderDefault(url: string, retryDelay=200, retryCount=5) {
    const defaultUrl = DEFAULT_URL;
    const defaultTexture = useLoader(TextureLoader, defaultUrl);
    const [imageUrl, setImageUrl] = useState<string>(url);
    const [texture, setTexture] = useState<Texture | null>(null);
    const [count, setCount] = useState(retryCount);
    const [hasLoadedDefault, setHasLoadedDefault] = useState(false);
  
    useEffect(() => {
      const loader = new TextureLoader();
      loader.load(imageUrl, setTexture,
      undefined, 
      (err) => {
        console.log(count, imageUrl)
        if (count > 0) { // 재시도 횟수 제한
            setTimeout(() => {
                setCount((count)=>count-1);
                setImageUrl(url); 
            }, retryDelay); // 3초 후 재시도
        }
      });
    }, [imageUrl,count]);
  
    return texture || defaultTexture;
  }