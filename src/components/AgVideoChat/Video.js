import React from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import styled from "styled-components";
// import { StyledAgoraVideoPlayer } from "./Video.styles";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";

export const StyledAgoraVideoPlayer = styled(AgoraVideoPlayer)`
	position: relative !important;
`;

export default function Video(props) {
	const { users, tracks } = props;
	const [gridSpacing, setGridSpacing] = useState(12);

	useEffect(() => {
		// setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
		setGridSpacing(12);
	}, [users, tracks]);

	return (
		<Grid container style={{ height: "100%" }}>
			<Grid item xs={gridSpacing}>
				<StyledAgoraVideoPlayer videoTrack={tracks[1]} />
			</Grid>
			{users.length > 0 &&
				users.map((user) => {
					if (user.videoTrack) {
						return (
							<Grid item xs={gridSpacing} key={user.uid}>
								<StyledAgoraVideoPlayer
									videoTrack={user.videoTrack}
									style={{ height: "100%", width: "100%", position: "relative !important" }}
								/>
							</Grid>
						);
					} else return null;
				})}
		</Grid>
	);
}
