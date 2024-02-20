import React from "react";
import { useState } from "react";
import VideoCall from "./VideoCall";
// import AgoraUIKit from "agora-react-uikit";

function AgVideoChat() {
	const [inCall, setInCall] = useState(false);
	// const [videoCall, setVideoCall] = useState(true);
	// const callbacks = {
	// 	EndCall: () => setVideoCall(false),
	// };

	// const rtcProps = {
	// 	appId: "76b0ac36b01048398d9b51ac87db712f",
	// 	channel: "main",
	// 	token:
	// 		"007eJxTYHAW6PmT11+9bp1SiFOojZXEdI6mlzk7Jy4/lN38NNvn7TcFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olLZf43xqQyAjw6/jB5kYGSAQxGdhyE3MzGNgAABXZiCe",
	// };

	// return videoCall ? (
	// 	<div style={{ display: "flex", width: "100vw", height: "100vh" }}>
	// 		<AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
	// 	</div>
	// ) : (
	// 	<h3 onClick={() => setVideoCall(true)}>Join</h3>
	// );

	return (
		<div className="agvideochat" style={{ height: "100%" }}>
			{inCall ? (
				<VideoCall setInCall={setInCall} />
			) : (
				<>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<h1>App</h1>
					<button onClick={() => setInCall(true)}>Join Call</button>
				</>
			)}
		</div>
	);
}

export default AgVideoChat;
