import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "socket.js";
import PDFViewer from "./PDFViewer";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import {
	userState,
	isLeadState,
	isTrailState,
	roomState,
	isAppBarPinnedState,
	bookState,
	buttonGroupsPosState,
} from "recoil/atom";
import RoomUserList from "components/RoomUserList";
import ButtonGroups from "components/ButtonGroups";

function Room() {
	const { bookId, roomId } = useParams();
	const [isTrail, setTrail] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [user, setUser] = useRecoilState(userState);
	const [room, setRoom] = useRecoilState(roomState);
	const [book, setBook] = useRecoilState(bookState);
	const [isAppBarPinned, setIsAppBarPinned] = useRecoilState(isAppBarPinnedState);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);

	const navigate = useNavigate();

	useEffect(() => {
		if (!room) {
			return;
		}
		const findBook = room?.Books?.find((book) => book.id == bookId);
		console.log("findBook", bookId, findBook);
		setBook(findBook);
		return () => {
			console.log("set book empty");
			setBook(null);
		};
	}, [room, bookId]);

	useEffect(() => {
		if (isLead) {
			console.log("request-attention-book", user.id, book.id);
			socket.emit("request-attention-book", {
				userId: user.id,
				bookId: bookId,
			});
		}
	}, [bookId]);

	useEffect(() => {
		if (isTrail) {
			socket.on("receive-attention-book", (data) => {
				console.log("receive-attention-book", data);
				navigate(`/room/${roomId}/book/${data.bookId}`);
			});
		}
		return () => {
			socket.off("receive-attention-book");
		};
	}, [isTrail, isLead]);

	return (
		<Box sx={{ display: "flex" }}>
			<Box
				onClick={() => setButtonGroupsPos({ visible: false, x: 0, y: 0 })}
				className="room-container"
				sx={{
					maxWidth: "100vw",
					width: "100%",
					margin: "0 auto",
					overflow: "hidden",
					flex: "19",
					position: "absolute",
					top: isAppBarPinned ? "64px" : "0px",
					transition: "top 0.5s ease-in-out",
				}}
			>
				<PDFViewer />
				<ButtonGroups />
			</Box>
		</Box>
	);
}

export default Room;
