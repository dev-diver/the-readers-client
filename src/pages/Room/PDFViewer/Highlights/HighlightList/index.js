import { useParams } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import HighlightListItem from "./HighlightListItem";
import api from "api";
import { logger } from "logger";
import { eraseHighlight } from "../util";
import socket from "socket.js";
import { Box } from "@mui/material";

export default function HighlightList({ highlights, deleteHandler }) {
	const { roomId } = useParams();
	const listContainer = useRef(null);
	const [items, setItems] = useState([]);

	useEffect(() => {
		const newHighlights = highlights?.map(
			(hl, i) => <HighlightListItem key={i} hlInfo={hl} deleteHandler={() => deleteHandler(hl)} /> || []
		);
		setItems(newHighlights);
	}, [highlights]);

	return (
		<Box
			id="highlights-list"
			ref={listContainer}
			sx={{
				border: "black 1px solid",
				maxWidth: "100%", // Grid 아이템의 너비에 맞춰 최대 너비를 제한합니다.
				height: "100%", // Grid 아이템의 높이에 맞춰 최대 높이를 제한합니다.
				overflow: "auto",
			}}
		>
			<Box>하이라이트</Box>
			{items}
		</Box>
	);
}
