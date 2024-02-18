import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from '@react-three/fiber'
import Carousel from "./Carousel";
import AddBook from "components/Addbook";
import './index.css'
import api from 'api'
import { Room, Book } from 'interface/interface';
import { Add } from '@mui/icons-material';

interface RoomResponse {
    data: Room
}

function RoomLobby() {

    const { roomId } = useParams()
    const navigate = useNavigate();
    
    const [room, setRoom] = useState<Room>({Books: [] as Book[]});
    const [roomRefresh, setRoomRefresh] = useState(false);

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
        <>
        <Canvas>
            <OrbitControls/>

            <directionalLight position ={[1,1,1]}/>
            <Environment
                background
                blur={0}
                preset="apartment"
            />
            <Carousel numPlanes={13} radius={3} books={room.Books} bookClickHandler ={bookClickHandler}/>
        </Canvas>
        <AddBook className="add-book" room={room} refresher={setRoomRefresh} />
        </>
    )
}

export default RoomLobby;