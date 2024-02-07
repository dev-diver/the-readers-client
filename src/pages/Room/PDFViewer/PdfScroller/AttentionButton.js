import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { isTrailState, userState, scrollerRefState } from "recoil/atom";
import socket from "socket";
import { Button } from "@mui/material";
import { smoothScrollTo } from "./util";

export default function AttentionButton() {
	const [user, setUser] = useRecoilState(userState);
	const [isTrail, setTrail] = useRecoilState(isTrailState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);

	const sendAttention = () => {
		console.log("scrollerRef", scrollerRef);
		const scrollTop = scrollerRef.scrollTop; // 현재 스크롤 위치
		console.log("sendAttention", scrollTop);
		socket.emit("requestAttention", {
			userId: user.id,
			scrollTop: scrollTop,
		});
	};

	useEffect(() => {
		socket.on("receiveAttention", (data) => {
			setTrail(true);
			smoothScrollTo(scrollerRef, data.scrollTop, 500); // 500ms 동안 목표 위치로 부드럽게 스크롤
		});

		return () => {
			socket.off("receiveAttention");
		};
	}, [scrollerRef]);

	return <Button onClick={() => sendAttention()}>집중</Button>;
}
