import React from "react";
import { useState } from "react";
import "./index.css";
import { VideoRoom } from "./VideoRoom";

function AgVideoChat2() {
	const [joined, setJoined] = useState(false);

	return (
		<div className="video-room-class">
			{!joined && <button onClick={() => setJoined(true)}>Video Start</button>}

			{joined && (
				<>
					<button onClick={() => setJoined(false)}>Exit</button>
					<VideoRoom />
				</>
			)}
		</div>
	);
}

export default AgVideoChat2;
