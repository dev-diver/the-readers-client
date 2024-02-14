import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";

import {
	Container,
	OutButton,
	StartButton,
	VideoBox,
	VideoContainer,
	Video,
	VideoButtonBox,
	Session,
	NameTag,
	Header,
} from "./style";
import { useRecoilState } from "recoil";
import { userState, isVideoExitState } from "recoil/atom";
import { ReactiveDraggable } from "components/DragNDrop/ReactiveDraggable";

const APPLICATION_SERVER_URL = "https://demos.openvidu.io/";

const VideoChat = () => {
	const [session, setSession] = useState(undefined);
	const [subscribers, setSubscribers] = useState([]);
	const [mainStreamManager, setMainStreamManager] = useState(undefined);
	const [publisher, setPublisher] = useState(undefined);
	const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
	const [user, setUser] = useRecoilState(userState);
	const { roomId } = useParams();
	const [mySessionId, setMySessionId] = useState(roomId);
	const [myUserName, setMyUserName] = useState(user.nick);
	const [isVideoExit, setIsVideoExit] = useRecoilState(isVideoExitState);

	const navigate = useNavigate();
	const OV = new OpenVidu();

	const startToSession = async () => {
		await joinSession();
		startToSubscriber();
	};

	const startToSubscriber = () => {
		console.log("+++++++startToSubscriber");
		console.log("session", session);
		if (!session) return;
		session.on("streamCreated", (event) => {
			console.log("Stream created:", event.stream);
			const subscriber = session.subscribe(event.stream, undefined);
			setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
		});

		session.on("streamDestroyed", (event) => {
			setSubscribers((prevSubscribers) =>
				prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager)
			);
		});

		session.on("exception", (exception) => {
			console.warn(exception);
		});

		const connectToSession = async () => {
			try {
				const token = await getToken(mySessionId);
				await session.connect(token, { clientData: myUserName });

				const publisher = await OV.initPublisherAsync(undefined, {
					audioSource: undefined,
					videoSource: undefined,
					publishAudio: true,
					publishVideo: true,
					resolution: "640x480",
					frameRate: 30,
					insertMode: "APPEND",
					mirror: false,
				});

				session.publish(publisher);

				const devices = await OV.getDevices();
				const videoDevices = devices.filter((device) => device.kind === "videoinput");
				const videoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
				const videoDevice = videoDevices.find((device) => device.deviceId === videoDeviceId);

				setMainStreamManager(publisher);
				setPublisher(publisher);
				setCurrentVideoDevice(videoDevice);
				console.log("-----------videoDevice----------");
				console.log("1111111111subscribers", subscribers);
			} catch (error) {
				console.log("There was an error connecting to the session:", error.code, error.message);
			}
		};

		connectToSession();

		return () => {
			session.off("streamCreated");
			session.off("streamDestroyed");
			session.off("exception");
		};
	};

	useEffect(() => {
		const onbeforeunload = (event) => {
			leaveSession();
		};

		window.addEventListener("beforeunload", onbeforeunload);

		return () => {
			window.removeEventListener("beforeunload", onbeforeunload);
		};
	}, []);

	const handleMainVideoStream = (stream) => {
		if (mainStreamManager !== stream) {
			setMainStreamManager({ ...mainStreamManager, mainStreamManager: stream });
		}
	};

	const deleteSubscriber = (streamManager) => {
		const index = subscribers.indexOf(streamManager, 0);
		if (index > -1) {
			const newSubscribers = subscribers.slice();
			newSubscribers.splice(index, 1);
			setSubscribers({ ...subscribers, subscribers: newSubscribers });
		}
	};

	const joinSession = async () => {
		const mySession = OV.initSession();
		setSession(mySession);
	};

	const onbeforeunload = () => {
		leaveSession();
	};

	useEffect(() => {
		window.addEventListener("beforeunload", onbeforeunload);
		window.removeEventListener("beforeunload", onbeforeunload);
	}, [subscribers]);

	const leaveSession = () => {
		if (session) {
			session.disconnect();
			console.log("========session disconnect");
		}
		deleteSubscriber(mainStreamManager);

		setSession(undefined);
		setSubscribers([]);
		setMainStreamManager(undefined);
		setPublisher(undefined);
	};

	const getToken = async () => {
		const sessionId = await createSession(mySessionId);
		return await createToken(sessionId);
	};

	const createSession = async (sessionId) => {
		console.log("createSession", APPLICATION_SERVER_URL);
		const response = await axios.post(
			APPLICATION_SERVER_URL + "api/sessions",
			{ customSessionId: sessionId },
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		return response.data; // The sessionId
	};

	const createToken = async (sessionId) => {
		console.log("create Token", APPLICATION_SERVER_URL);
		const response = await axios.post(
			APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
			{},
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		return response.data; // The token
	};

	return (
		<div className="container" style={{ backgroundColor: "gray" }}>
			<ReactiveDraggable startX={window.innerWidth - 300} startY={60}>
				<VideoContainer style={{ zIndex: 100 }}>
					<Header>
						<NameTag id="session-title">방 이름: {mySessionId}</NameTag>
					</Header>
					<VideoButtonBox>
						{mainStreamManager === undefined ? (
							<a>
								<StartButton
									onClick={() => {
										startToSession();
										setIsVideoExit(true);
									}}
								>
									Start
								</StartButton>
							</a>
						) : (
							// <a href={`/room/${roomId}/book`}>
							<a>
								<OutButton
									onClick={() => {
										leaveSession();
										setIsVideoExit(false);
									}}
								>
									Exit!
								</OutButton>
							</a>
						)}
					</VideoButtonBox>
					{/* <Session> */}
					{isVideoExit !== false ? (
						<p>
							<VideoBox>
								<div id="main-video" className="col-md-6">
									<UserVideoComponent streamManager={mainStreamManager} />
								</div>
							</VideoBox>
							<div id="video-container" className="col-md-6">
								{subscribers.map((sub, i) => (
									<div
										key={sub.id}
										className="stream-container col-md-6 col-xs-6"
										onClick={() => handleMainVideoStream(sub)}
									>
										<VideoBox>
											<UserVideoComponent streamManager={sub} />
										</VideoBox>
									</div>
								))}
							</div>
						</p>
					) : null}
					{/* </Session> */}
				</VideoContainer>
			</ReactiveDraggable>
		</div>
	);
};

export default VideoChat;
