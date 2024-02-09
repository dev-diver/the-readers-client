import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLeadState, isTrailState, userState, scrollerRefState } from "recoil/atom";
import socket from "socket";
import { Button } from "@mui/material";
import { smoothScrollTo } from "../PdfScroller/util";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function AttentionButton() {
	const { roomId, bookId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [isTrail, setTrail] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);

	const navigate = useNavigate();

	const sendAttention = () => {
		console.log("scrollerRef", scrollerRef);
		const scrollTop = scrollerRef.scrollTop; // 현재 스크롤 위치
		console.log("send-attention", scrollTop);
		socket.emit("request-attention", {
			userId: user.id,
			bookId: bookId,
			scrollTop: scrollTop,
		});
		setLead(true);
		setTrail(false);
	};

	useEffect(() => {
		socket.on("receive-attention", (data) => {
			setTrail(true);
			setLead(false);
			navigate(`/room/${roomId}/book/${data.bookId}`);
			smoothScrollTo(scrollerRef, data.scrollTop, 500); // 500ms 동안 목표 위치로 부드럽게 스크롤
		});

		return () => {
			socket.off("receive-attention");
		};
	}, [scrollerRef]);

	return (
		<Button
			onClick={() => sendAttention()}
			sx={{
				borderRadius: 0,
				color: "#f44336",
				borderLeft: "1px solid",
				borderColor: "divider",
			}}
		>
			<CampaignIcon />
		</Button>
	);
}
