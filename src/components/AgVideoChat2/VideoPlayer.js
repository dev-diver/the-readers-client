import React, { useEffect, useLayoutEffect, useRef } from "react";
import { userState } from "recoil/atom";
import { useRecoilValue } from "recoil";

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
			NickName: {nickName}
			<div ref={ref} style={{ width: "200px", height: "200px" }}></div>
		</div>
	);
};
