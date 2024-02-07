import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { Container, OutButton, StartButton, VideoBox, VideoContainer } from "./style";

export default function VideoChat() {
	const { roomId } = useParams();
	// video
	const myVideoRef = useRef();
	const peerVideoRef = useRef();

	const [myMuted, setMyMuted] = useState(false);
	const [peerMuted, setPeerMuted] = useState(false);
	const [myStream, setMyStream] = useState();

	// media setup
	useEffect(() => {
		let stream;
		let dataChannel;

		let peerConnection = new RTCPeerConnection();
		const startMedia = async () => {
			const getMedia = async () => {
				const contraints = { audio: true, video: { facingMode: "user" } };
				try {
					stream = await navigator.mediaDevices.getUserMedia(contraints);
					if (myVideoRef.current) {
						myVideoRef.current.srcObject = stream;
					}
					setMyStream(stream);
				} catch (error) {
					console.error(error);
				}
			};
			const makeConnection = () => {
				if (stream) {
					stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
				}
			};
			await getMedia();
			makeConnection();
		};

		startMedia();

		peerConnection.ontrack = ({ streams }) => {
			if (peerVideoRef.current) {
				peerVideoRef.current.srcObject = streams[0];
			}
		};

		socket.on("rtc_start", async (room) => {
			// canvasClear();
			console.log("RTC Connection Start!");
			peerConnection.addEventListener("icecandidate", ({ candidate }) => {
				console.log("candidate finish");
				socket.emit("candidate", { candidate, room });
			});
			dataChannel = peerConnection.createDataChannel("canvas");

			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);
			socket.emit("offer", { offer, room });
			console.log("send the offer");
		});

		socket.on("offer", async ({ offer, room }) => {
			peerConnection.addEventListener("datachannel", (event) => {
				console.log("receive datachannel");
				dataChannel = event.channel;
				if (dataChannel) {
					dataChannel.onmessage = (event) => {
						console.log("data receiving...");
						const parsed = JSON.parse(event.data);
					};
				}
			});
			await peerConnection.setRemoteDescription(offer);
			console.log("receive offer");
			const answer = await peerConnection.createAnswer();
			await peerConnection.setLocalDescription(answer);
			socket.emit("answer", { answer, room });
			console.log("send answer!");
		});

		socket.on("answer", async ({ answer, room }) => {
			peerConnection.addEventListener("icecandidate", ({ candidate }) => {
				console.log("candidate finish");
				socket.emit("candidate", { candidate, room });
			});
			console.log("receive answer", answer);
			await peerConnection.setRemoteDescription(answer);
		});

		socket.on("candidate", async (candidate) => {
			console.log("receive candidate !", candidate);
			if (candidate) {
				await peerConnection.addIceCandidate(candidate);
				console.log("🚀 add ice candidate peer connection finish 🚀 ");
			}
		});
	}, []);

	const handleCameraOut = () => {
		if (!myStream) return;
		myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
	};

	return (
		<>
			<Container>
				<VideoContainer>
					<VideoBox>
						<video ref={myVideoRef} autoPlay muted={myMuted} onClick={handleCameraOut} />
					</VideoBox>
					<a href="/">
						<OutButton>Exit!</OutButton>
					</a>
					<a>
						<StartButton
							onClick={() => {
								socket.emit("rtc_start", roomId);
							}}
						>
							Start!
						</StartButton>
					</a>
					<VideoBox>
						<video ref={peerVideoRef} autoPlay muted={peerMuted} />
					</VideoBox>
				</VideoContainer>
			</Container>
		</>
	);
}
