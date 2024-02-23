import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Carousel from "./Carousel";
import AddBook from "components/Addbook";
import './index.css'
import api from 'api'
import { Room, Book } from 'interface/interface';
import { useRecoilState } from 'recoil';
import { roomRefreshState } from 'recoil/atom';

interface RoomResponse {
    data: Room
}
interface LobbyCanvasProps {
    books: Book[];
    bookClickHandler: (book: Book) => void;
    isFake: boolean;
}

export const LobbyCanvas: React.FC<LobbyCanvasProps> = ({books, bookClickHandler, isFake}) => {

    return (
        <Canvas 
        style={{ width: '100%', height: isFake?'50vh':'100vh', backgroundColor: 'black' }}>
            {/* <OrbitControls/> */}

            <directionalLight 
                position ={[4,1,10]}
                intensity={0.5}    
            />
            <Environment
                background
                blur={0}
                preset = "apartment"
                files="/room/christmas_photo_studio_07_4k.hdr"
            />
            <Carousel isFake={isFake} numPlanes={13} radius={3} books={books} bookClickHandler ={bookClickHandler}/>
        </Canvas>
    );

}

function RoomLobby() {

    const { roomId } = useParams()
    const navigate = useNavigate();

    const [room, setRoom] = useState<Room>({Books: [] as Book[]});
    const [roomRefresh, setRoomRefresh] = useRecoilState(roomRefreshState);
    
    useEffect(() => {
        api.get<RoomResponse>(`/rooms/${roomId}`).then((res) => {
            console.log(res.data)
            setRoom(res.data.data);
        });
    },[roomId, roomRefresh])

    const bookClickHandler = (book: Book)=>{
        navigate(`/room/${roomId}/book/${book.id}`);
    };

    return (
        <div>
        <LobbyCanvas books={room?.Books || []} bookClickHandler={bookClickHandler} isFake={false} />
        <AddBook className="add-book" room={room} refresher={setRoomRefresh} />
        </div>
    )
}

function SetupCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.rotation.z = THREE.MathUtils.degToRad(90);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export default RoomLobby;