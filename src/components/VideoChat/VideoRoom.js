import React, { useEffect, useState } from "react";
import AgoraRTC, { createClient } from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import Controls from "./Controls";
import { VideoContainer } from "./style";

const APP_ID = "76b0ac36b01048398d9b51ac87db712f";
const TOKEN =
	"007eJxTYOByPyeZrOZU/FPr75MTEVukfgRPU9LM+d+4aK2ptQTbAwYFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olDan6EJqQyAjw2bubkZGBggE8VkYchMz8xgYANc/Hek=";
const CHANNEL = "main";

AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

const createAgoraClient = ({ onVideoTrack, onUserDisconnected, tracks, users }) => {
	const client = createClient({
		mode: "rtc",
		codec: "vp8",
	});

	const waitForConnectionState = (connectionState) => {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (client.connectionState === connectionState) {
					clearInterval(interval);
					resolve();
				}
			}, 200);
		});
	};

	const connect = async () => {
		await waitForConnectionState("DISCONNECTED");

		const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);

		// client.on("user-published", (user, mediaType) => {
		// 	client.subscribe(user, mediaType).then(() => {
		// 		if (mediaType === "video") {
		// 			onVideoTrack(user);
		// 		}
		// 	});
		// });
		client.on("user-published", async (user, mediaType) => {
			await client.subscribe(user, mediaType);
			if (mediaType === "video") {
				onVideoTrack(user);
			}
			// if (mediaType === "audio") {
			// 	user.audioTrack.play();
			// }
		});

		client.on("user-left", (user) => {
			onUserDisconnected(user);
		});

		tracks = await AgoraRTC.createMicrophoneAndCameraTracks();

		await client.publish(tracks);

		return {
			tracks,
			uid,
		};
	};

	const disconnect = async () => {
		await waitForConnectionState("CONNECTED");
		client.removeAllListeners();
		for (let track of tracks) {
			track.stop();
			track.close();
		}
		await client.unpublish(tracks);
		await client.leave();
	};

	return {
		disconnect,
		connect,
	};
};

export const VideoRoom = () => {
	const [users, setUsers] = useState([]);
	const [uid, setUid] = useState(null);
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		const onVideoTrack = (user) => {
			setUsers((previousUsers) => [...previousUsers, user]);
		};

		const onUserDisconnected = (user) => {
			setUsers((previousUsers) => previousUsers.filter((u) => u.uid !== user.uid));
		};

		const { connect, disconnect } = createAgoraClient({
			onVideoTrack,
			onUserDisconnected,
			tracks,
			setTracks,
		});

		const setup = async () => {
			const { tracks, uid } = await connect();
			setUid(uid);
			setTracks(tracks);
			setUsers((previousUsers) => [
				...previousUsers,
				{
					uid,
					audioTrack: tracks[0],
					videoTrack: tracks[1],
				},
			]);
			console.warn("tracks[0]: 마이크", tracks[0]);
			console.warn("tracks[1]: 카메라", tracks[1]);
		};

		const cleanup = async () => {
			await disconnect();
			setUid(null);
			setUsers([]);
		};

		// setup();
		agoraCommandQueue = agoraCommandQueue.then(setup);

		return () => {
			// cleanup();
			agoraCommandQueue = agoraCommandQueue.then(cleanup);
		};
	}, []);

	return (
		<>
			{uid}
			<Controls tracks={tracks} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<VideoContainer>
					{/* <div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(1, 200px)",
						}}
					> */}
					{users.map((user) => (
						<VideoPlayer key={user.uid} user={user} />
					))}
					{/* </div> */}
				</VideoContainer>
			</div>
		</>
	);
};
