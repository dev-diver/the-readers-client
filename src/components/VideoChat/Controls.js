import React, { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Box, Button } from "@mui/material";

export default function Controls(props) {
	const { tracks } = props;
	const [trackState, setTrackState] = useState({ video: true, audio: true });

	console.warn("------Controls-------tracks[0]: 마이크", tracks[0]);
	console.warn("------Controls-------tracks[1]: 카메라", tracks[1]);

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
		<Box sx={{ display: "flex", flexDirection: "row" }}>
			<div style={{ flex: 1 }}>
				<Button onClick={() => mute("audio")} sx={{ width: "100%" }}>
					{trackState.audio ? <MicIcon /> : <MicOffIcon />}
				</Button>
			</div>
			<div style={{ flex: 1 }}>
				<Button onClick={() => mute("video")} sx={{ width: "100%" }}>
					{trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
				</Button>
			</div>
		</Box>
	);
}
