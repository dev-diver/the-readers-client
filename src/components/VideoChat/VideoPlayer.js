import React, { useEffect, useLayoutEffect, useRef } from "react";
import { userState } from "recoil/atom";
import { useRecoilValue } from "recoil";
import { VideoBox, NameTag } from "./style";
export const VideoPlayer = ({ user }) => {
	const ref = useRef();
	const { nick: nickName } = useRecoilValue(userState);

	useEffect(() => {
		console.warn("user", user);
		user.videoTrack.play(ref.current);
		user.audioTrack.play(ref.current);
	}, []);

	return (
		<div>
			<NameTag>{nickName}</NameTag>
			<VideoBox ref={ref}></VideoBox>
		</div>
	);
};
