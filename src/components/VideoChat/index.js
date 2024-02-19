import React, { useState } from "react";
import { VideoRoom } from "./VideoRoom";
import { OutButton, StartButton, VideoButtonBox } from "./style";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";

function VideoChat() {
	const [joined, setJoined] = useState(false);
	const [user, setUser] = useRecoilState(userState);

	const isJoined = () => {
		if (!user) {
			alert("비디오는 로그인이 필요합니다.");
			return;
		}
		setJoined(!joined);
	};

	return (
		<>
			<VideoButtonBox>
				{joined ? (
					<OutButton onClick={() => isJoined()}>Exit</OutButton>
				) : (
					<StartButton onClick={() => isJoined()}>Start</StartButton>
				)}
			</VideoButtonBox>
			{joined && <VideoRoom />}
		</>
	);
}

export default VideoChat;
