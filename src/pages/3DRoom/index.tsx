import React from 'react';
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from '@react-three/fiber'
import Carousel from "./Carousel";
import './index.css'

const planes = 13
const urls=['algo.png','algorithm.jpg','cleancode.jpeg','csapp.jpeg','refactor.jpg']

function Room() {
    const covers = Array.from({ length:planes },(_,i)=>{
        return '/mock/'+urls[i % urls.length]    
    })

    return (
        <Canvas>
            <OrbitControls/>

            <directionalLight position ={[1,1,1]}/>
            <Environment
                background
                blur={0}
                preset="apartment"
            />
            <Carousel numPlanes={planes} radius={3} covers={covers}/>
        </Canvas>
    )
}

export default Room;