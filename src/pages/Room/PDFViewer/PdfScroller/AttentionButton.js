import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { isTrailState, userState } from "recoil/atom";
import socket from "socket";
import { Button } from "@mui/material";
import { smoothScrollTo } from "./util";

export default function AttentionButton({ containerRef }) {
	const [user, setUser] = useRecoilState(userState);
	const [isTrail, setTrail] = useRecoilState(isTrailState);

	const sendAttention = () => {
		const scrollTop = containerRef.current.scrollTop; // 현재 스크롤 위치
		console.log("sendAttention", scrollTop);
		socket.emit("requestAttention", {
			userId: user.id,
			scrollTop: scrollTop,
		});
	};

	useEffect(() => {
		socket.on("receiveAttention", (data) => {
			setTrail(true);
			smoothScrollTo(containerRef.current, data.scrollTop, 500); // 500ms 동안 목표 위치로 부드럽게 스크롤
		});

		return () => {
			socket.off("receiveAttention");
		};
	}, [containerRef.current]);

	return <Button onClick={() => sendAttention()}>집중</Button>;
}
