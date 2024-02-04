import React, { useEffect, useRef, useState } from "react";
// import Input from "components/VideoChat/Input";
import socket from "socket.js";

function VideoChat() {
	console.log("-------------<  VideoChat  >-------------");
	// useRef를 사용한 DOM 요소에 대한 참조
	const myFace = useRef(null);
	const camerasSelect = useRef(null);
	const call = useRef(null);
	const welcome = useRef(null);
	const welcomeForm = useRef(null);

	// 상태 관리를 위한 useState 사용
	const [muted, setMuted] = useState(false);
	const [cameraOff, setCameraOff] = useState(false);
	const [isCallHidden, setIsCallHidden] = useState(true);
	const [isWelcomeHidden, setIsWelcomeHidden] = useState(false);
	const [myStream, setMyStream] = useState(null);
	const [peerConnection, setPeerConnection] = useState(null);

	// 기타 필요한 상태 및 변수 선언
	let roomName;
	let myPeerConnection;
	let myDataChannel;

	async function getCameras() {
		if (!myStream || !camerasSelect.current) return;
		const devices = await navigator.mediaDevices.enumerateDevices();
		const cameras = devices.filter((device) => device.kind === "videoinput");
		const currentCamera = myStream.getVideoTracks()[0];

		cameras.forEach((camera) => {
			const option = document.createElement("option");
			option.value = camera.deviceId;
			option.innerText = camera.label;
			if (currentCamera && currentCamera.label === camera.label) {
				option.selected = true;
			}
			camerasSelect.current.appendChild(option);
		});
	}

	useEffect(() => {
		if (myStream && camerasSelect.current) {
			getCameras();
		}
	}, []);

	// 미디어 스트림을 가져오는 함수
	async function getMedia(deviceId) {
		const initialConstrains = {
			audio: true,
			video: { facingMode: "user" },
		};
		const cameraConstraints = {
			audio: true,
			video: { deviceId: { exact: deviceId } },
		};

		try {
			const stream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstrains);
			setMyStream(stream);
			if (myFace.current) {
				myFace.current.srcObject = stream;
			}
			getCameras();
		} catch (error) {
			console.error("Error getting media:", error);
		}
	}

	useEffect(() => {
		getMedia();
	}, []);

	function handleMuteClick() {
		const audioTracks = myStream.getAudioTracks();
		audioTracks.forEach((track) => (track.enabled = !track.enabled));
		setMuted(!muted);
	}

	function handleCameraClick() {
		myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
		setCameraOff(!cameraOff);
	}

	async function handleCameraChange() {
		await getMedia(camerasSelect.value);
		if (myPeerConnection) {
			const videoTrack = myStream.getVideoTracks()[0];
			const videoSender = myPeerConnection.getSenders().find((sender) => sender.track.kind === "video");
			videoSender.replaceTrack(videoTrack);
		}
	}
	useEffect(() => {
		// 이벤트 리스너를 추가하기 전에 camerasSelect.current가 존재하는지 확인합니다.
		const selectElement = camerasSelect.current;
		if (selectElement) {
			selectElement.addEventListener("input", handleCameraChange);

			// 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
			return () => {
				selectElement.removeEventListener("input", handleCameraChange);
			};
		}
	}, [handleCameraChange]); // handleCameraChange 함수가 변경될 때마다 이 useEffect를 다시 실행합니다.
	// Welcome Form (join a room)

	async function initCall() {
		setIsWelcomeHidden(true);
		setIsCallHidden(false);
		makeConnection();
		await getMedia();

		// 상태 관리를 위한 useState 사용
	}
	// 기타 필요한 상태 및 변수 선언
	async function handleWelcomeSubmit(event) {
		event.preventDefault();
		await initCall();
		// const input = welcomeForm.current.querySelector("input");
		// socket.emit("join_room", input.value);
		// 기타 필요한 상태 및 변수 선언	roomName = input.value;
		// input.value = "";
		setIsWelcomeHidden(true);
	}

	// Socket Code

	socket.on("welcome", async () => {
		myDataChannel = myPeerConnection.createDataChannel("chat");
		myDataChannel.addEventListener("message", (event) => console.log(event.data));
		console.log("made data channel");
		const offer = await myPeerConnection.createOffer();
		myPeerConnection.setLocalDescription(offer);
		console.log("sent the offer");
		socket.emit("offer", offer, roomName);
	});

	socket.on("offer", async (offer) => {
		myPeerConnection.addEventListener("datachannel", (event) => {
			myDataChannel = event.channel;
			myDataChannel.addEventListener("message", (event) => console.log(event.data));
		});
		console.log("received the offer");
		myPeerConnection.setRemoteDescription(offer);
		const answer = await myPeerConnection.createAnswer();
		myPeerConnection.setLocalDescription(answer);
		socket.emit("answer", answer, roomName);
		console.log("sent the answer");
	});

	socket.on("answer", (answer) => {
		console.log("received the answer");
		myPeerConnection.setRemoteDescription(answer);
	});

	socket.on("ice", (ice) => {
		console.log("received candidate");
		myPeerConnection.addIceCandidate(ice);
	});

	// RTC Code

	function makeConnection() {
		if (!myStream || peerConnection) return;

		const pc = new RTCPeerConnection({
			iceServers: [
				{
					urls: [
						"stun:stun.l.google.com:19302",
						"stun:stun1.l.google.com:19302",
						"stun:stun2.l.google.com:19302",
						"stun:stun3.l.google.com:19302",
						"stun:stun4.l.google.com:19302",
					],
				},
			],
		});
		pc.addEventListener("icecandidate", (event) => {
			if (event.candidate) {
				socket.emit("ice", event.candidate, roomName);
			}
		});
		pc.addEventListener("addstream", handleAddStream);
		myStream.getTracks().forEach((track) => pc.addTrack(track, myStream));

		setPeerConnection(pc); // 상태 업데이트
	}

	useEffect(() => {
		if (myStream && !peerConnection) {
			makeConnection();
		}

		return () => {
			if (peerConnection) {
				peerConnection.close(); // 컴포넌트 언마운트 시 연결 닫기
				setPeerConnection(null); // 상태를 null로 설정하여 참조 제거
			}
		};
	}, [myStream]); // myStream 변경 시에만 실행

	const handleIce = (data) => {
		console.log("sent candidate");
		socket.emit("ice", data.candidate, roomName);
	};

	const handleAddStream = (data) => {
		const peerFace = document.getElementById("peerFace");
		// const peerFace = useRef(null);
		peerFace.current.srcObject = data.stream;
	};

	return (
		<div>
			<h1>The Reader</h1>
			{/* <Input /> */}
			{/* <div ref={welcome} hidden={isWelcomeHidden}>
				<form ref={welcomeForm} onSubmit={handleWelcomeSubmit}>
					<input type="text" placeholder="room name" required />
					<button type="submit">Enter room</button>
				</form>
			</div> */}
			<div ref={call} hidden={isCallHidden}>
				<video ref={myFace} autoPlay playsInline width="400" height="400"></video>
				<button onClick={handleMuteClick}>{muted ? "Unmute" : "Mute"}</button>
				<button onClick={handleCameraClick}>{cameraOff ? "Turn Camera On" : "Turn Camera Off"}</button>
				<select ref={camerasSelect}>
					<option>Face Camera</option>
				</select>
			</div>
		</div>
	);
}

export default VideoChat;
