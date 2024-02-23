//선우
import React, { useState, useEffect } from "react";
import {
	AgoraRTCProvider,
	useJoin,
	useLocalCameraTrack,
	useLocalMicrophoneTrack,
	usePublish,
	useRTCClient,
	useRemoteAudioTracks,
	useRemoteUsers,
	RemoteUser,
	LocalVideoTrack,
	useClientEvent,
} from "agora-rtc-react";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { Button } from "@mui/material";

const AppID = "76b0ac36b01048398d9b51ac87db712f";
const token =
	"007eJxTYNj++LuN9qotXfP3bPpvw5iyWuP23gV7dTtFqno2lOaopcYqMJibJRkkJhsDSUMDEwtjS4sUyyRTw8RkC/OUJHNDozRZvxupDYGMDD8XerIwMkAgiM/CkJuYmcfAAACr1iBM";
const channelName = "main";

function VideoRoom() {
	const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
	const [inCall, setInCall] = useState(false);
	useEffect(() => {
		setInCall(true);
	}, []);

	return (
		<>
			<div style={styles.container}>
				{!inCall ? (
					<>
						<Button onClick={setInCall(true)}>연결</Button>
					</>
				) : (
					<AgoraRTCProvider client={client}>
						<Videos channelName={channelName} AppID={AppID} token={token} />
						<br />
						<button onClick={() => setInCall(false)}>End Call</button>
					</AgoraRTCProvider>
				)}
			</div>
		</>
	);
}

function Videos({ channelName, AppID, token }) {
	const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
	const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
	const remoteUsers = useRemoteUsers();
	const { audioTracks } = useRemoteAudioTracks(remoteUsers);
	const client = useRTCClient();

	useClientEvent(client, "user-published", (user) => {
		console.log(user);
	});

	usePublish([localMicrophoneTrack, localCameraTrack]);

	useJoin({
		appid: AppID,
		channel: channelName,
		token: token === "" ? null : token,
	});

	// 사이드 이펙트 관리를 위한 useEffect
	useEffect(() => {
		// 오디오 트랙 재생
		audioTracks.forEach((track) => track.play());
	}, [client, localMicrophoneTrack, localCameraTrack, AppID, channelName, token, audioTracks]);

	// 디바이스 로딩 상태 처리
	if (isLoadingMic || isLoadingCam) {
		return <div style={styles.grid}>Loading devices...</div>;
	}

	// 디바이스 사용 불가 상태 처리
	if (!localCameraTrack || !localMicrophoneTrack) {
		console.log("localCameraTrack", localCameraTrack, "localMicrophoneTrack", localMicrophoneTrack);
		return <div style={styles.grid}>Please allow camera and microphone permissions</div>;
	}

	// 정상 상태 렌더링
	return (
		<>
			<div style={{ ...styles.grid, ...returnGrid(remoteUsers) }}>
				<LocalVideoTrack track={localCameraTrack} play={true} />
				{remoteUsers.map((user) => (
					<RemoteUser key={user.uid} user={user} />
				))}
			</div>
			<br />
			<Controls localMicrophoneTrack={localMicrophoneTrack} localCameraTrack={localCameraTrack} />
		</>
	);
}

const Controls = (localMicrophoneTrack, localCameraTrack) => {
	return (
		<div style={styles.btnContainer}>
			<button onClick={() => void localMicrophoneTrack.setMuted(!localMicrophoneTrack.muted)}>Mute Mic</button>
			<button onClick={() => void localCameraTrack.setMuted(!localCameraTrack.muted)}>Mute Cam</button>
		</div>
	);
};

export default VideoRoom;

/* Style Utils */
const returnGrid = (remoteUsers) => {
	return {
		gridTemplateColumns:
			remoteUsers.length > 8
				? unit.repeat(4)
				: remoteUsers.length > 3
					? unit.repeat(3)
					: remoteUsers.length > 0
						? unit.repeat(2)
						: unit,
	};
};
const unit = "minmax(0, 1fr) ";
const styles = {
	grid: {
		width: "100%",
		height: "100%",
		display: "grid",
	},
	gridCell: { height: "100%", width: "100%" },
	container: {
		display: "flex",
		flexDirection: "column",
		flex: 1,
		justifyContent: "center",
	},
	btnContainer: {
		display: "flex",
		flexDirection: "row",
		alignSelf: "center",
		width: "50%",
		justifyContent: "space-evenly",
	},
};
