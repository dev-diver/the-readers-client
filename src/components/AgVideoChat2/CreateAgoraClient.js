import React, { useEffect, useState } from "react";
import AgoraRTC, { createClient } from "agora-rtc-sdk-ng";
import { useRecoilState } from "recoil";
import { connectState, disconnectState, trackState } from "recoil/atom";

const APP_ID = "76b0ac36b01048398d9b51ac87db712f";
const TOKEN =
	"007eJxTYOByPyeZrOZU/FPr75MTEVukfgRPU9LM+d+4aK2ptQTbAwYFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olDan6EJqQyAjw2bubkZGBggE8VkYchMz8xgYANc/Hek=";
const CHANNEL = "main";

AgoraRTC.setLogLevel(4);

const createAgoraClient = () => {
	const client = createClient({
		mode: "rtc",
		codec: "vp8",
	});

	let tracks;
	const [connectState, setConnectState] = useRecoilState(connectState);
	const [disconnectState, setDisconnectState] = useRecoilState(disconnectState);
	const [trackState, setTrackState] = useRecoilState(trackState);
	// let micMuted = false;

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

		client.on("user-published", (user, mediaType) => {
			client.subscribe(user, mediaType).then(() => {
				if (mediaType === "video") {
					setConnectState(user);
				}
			});
		});

		client.on("user-left", (user) => {
			setDisconnectState(user);
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

	// const toggleMic = () => {
	// 	if (micMuted) {
	// 		// e.target.src = "https://img.icons8.com/ios/452/microphone.png";
	// 		// e.target.style.backgroundColor = "ivory";
	// 		micMuted = false;
	// 	} else {
	// 		// e.target.src = "https://img.icons8.com/ios/452/microphone-off.png";
	// 		// e.target.style.backgroundColor = "indianred";
	// 		micMuted = true;
	// 	}
	// 	tracks.setMicMuted(micMuted);
	// };

	// const mute = async (type) => {
	// 	let newTrackState;
	// 	if (type === "audio") {
	// 		await tracks[0].setEnabled(!trackState.audio);
	// 		newTrackState = { ...trackState, audio: !trackState.audio };
	// 	} else if (type === "video") {
	// 		await tracks[1].setEnabled(!trackState.video);
	// 		newTrackState = { ...trackState, video: !trackState.video };
	// 	}
	// 	return newTrackState;
	// };

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

	return {
		disconnect,
		connect,
		mute,
		// toggleMic,
	};
};
