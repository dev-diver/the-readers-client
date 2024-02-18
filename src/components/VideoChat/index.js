import React, { useState } from "react";
import { VideoRoom } from "./VideoRoom";
import { OutButton, StartButton, VideoButtonBox } from "./style";

function VideoChat() {
	const [joined, setJoined] = useState(false);

	return (
		<>
			<VideoButtonBox>
				{joined ? (
					<OutButton onClick={() => setJoined(false)}>Exit</OutButton>
				) : (
					<StartButton onClick={() => setJoined(true)}>Start</StartButton>
				)}
			</VideoButtonBox>
			{joined && <VideoRoom />}
		</>
	);
}

export default VideoChat;
