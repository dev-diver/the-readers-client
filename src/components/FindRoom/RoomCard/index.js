import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";

const RoomCard = ({ room }) => {
	return (
		<Container
			className="card"
			style={{
				backgroundColor: "#eeeeee",
				textAlign: "center",
				color: "black",
				minHeight: `${room.usermax * 20}px`,
				padding: "0px",
			}}
		>
			<Link to={`/room/${room.id}`}>
				<h2>방 제목: {room.title}</h2>
				<h3>인원 수: {room.usermax}</h3>
			</Link>
			<p>책 제목들</p>
			<div>{room.Books?.map((book, i) => <span key={i}>{book.name}</span>) || <></>}</div>
		</Container>
	);
};

export default RoomCard;
