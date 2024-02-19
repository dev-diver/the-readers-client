import React, { useEffect, useLayoutEffect, useRef } from "react";
import { userState, userMapState } from "recoil/atom";
import { useRecoilValue } from "recoil";
import { VideoBox, NameTag } from "./style";
export const VideoPlayer = ({ user }) => {
	const ref = useRef();

	const getNickById = (uid) => {
		return userMapState[uid] || null;
	};

	useEffect(() => {
		if (!user.videoTrack || !user.audioTrack) return;
		user.videoTrack.play(ref.current);
		user.audioTrack.play(ref.current);
	}, []);

	return (
		<div>
			<VideoBox ref={ref} />
			<NameTag style={{ alignItems: "center" }}>{getNickById(user.uid)}</NameTag>
		</div>
	);
};
