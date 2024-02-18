import React, { useState } from "react";
import { useClient } from "./settings";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

export default function Controls(props) {
	const client = useClient();
	const { tracks } = props;
	const [trackState, setTrackState] = useState({ video: true, audio: true });

	console.warn("tracks", tracks);

	const mute = async (type) => {
		if (type === "audio") {
			await tracks[0].setEnabled(!trackState.audio);
			setTrackState((ps) => {
				return { ...ps, audio: !ps.audio };
			});
		} else if (type === "video") {
			await tracks[1].setEnabled(!trackState.video);
			setTrackState((ps) => {
				return { ...ps, video: !ps.video };
			});
		}
	};

	return (
		<div container spacing={2} alignItems="center">
			<div item>
				<button variant="contained" color={trackState.audio ? "primary" : "secondary"} onClick={() => mute("audio")}>
					{trackState.audio ? <MicIcon /> : <MicOffIcon />}
				</button>
			</div>
			<div item>
				<button variant="contained" color={trackState.video ? "primary" : "secondary"} onClick={() => mute("video")}>
					{trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
				</button>
			</div>
		</div>
	);
}
