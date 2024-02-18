import React, { useEffect, useLayoutEffect, useRef } from "react";
import { userState } from "recoil/atom";
import { useRecoilValue } from "recoil";
import { VideoBox, NameTag } from "./style";
export const VideoPlayer = ({ user }) => {
	const ref = useRef();
	const userStateData = useRecoilValue(userState);

	const userMap = {};
	userMap[user.uid] = userStateData.nick;

	const getNickById = (uid) => {
		return userMap[uid] || "누구세요";
	};

	useEffect(() => {
		user.videoTrack.play(ref.current);
		user.audioTrack.play(ref.current);
	}, []);

	return (
		<div>
			<VideoBox ref={ref}></VideoBox>
			<NameTag style={{ alignItems: "center" }}>{getNickById(user.uid)}</NameTag>
		</div>
	);
};
