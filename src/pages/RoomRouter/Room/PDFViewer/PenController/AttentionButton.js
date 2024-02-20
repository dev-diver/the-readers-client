import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { viewerScaleState, isLeadState, isTrailState, userState, scrollerRefState } from "recoil/atom";
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
	const [scale, setScale] = useRecoilState(viewerScaleState);

	const navigate = useNavigate();

	const sendAttention = () => {
		if (!user) return;
		if (isTrail) {
			setTrail(false);
			return;
		}
		console.log("scrollerRef", scrollerRef);
		const scrollTop = scrollerRef.scrollTop; // 현재 스크롤 위치
		console.log("send-attention", scrollTop);
		socket.emit("request-attention", {
			userId: user.id,
			bookId: bookId,
			scale: scale,
			scrollTop: scrollTop,
		});
		setLead(true);
	};

	useEffect(() => {
		socket.on("receive-attention", (data) => {
			setTrail(true);
			setLead(false);
			navigate(`/room/${roomId}/book/${data.bookId}`);
			if (data.scale !== scale) setScale(data.scale);
			smoothScrollTo(scrollerRef, data.scrollTop, 500); // 500ms 동안 목표 위치로 부드럽게 스크롤
		});

		return () => {
			socket.off("receive-attention");
		};
	}, [scrollerRef, scale]);

	return (
		<Button
			value="attention"
			aria-label="attention"
			color={isLead ? "error" : isTrail ? "primary" : "inherit"}
			onClick={() => sendAttention()}
			sx={{ width: "50px", height: "50px", overflow: "hidden" }}
		>
			<CampaignIcon sx={{ width: "30px", height: "30px" }} />
		</Button>
	);
}
