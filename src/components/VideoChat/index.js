import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import { Container, OutButton, StartButton, VideoBox, VideoContainer, Video } from "./style";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";

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
	const [myUserName, setMyUserName] = useState(user.id);

	const navigate = useNavigate();
	const OV = new OpenVidu();

	useEffect(() => {
		joinSession();
	}, [user, roomId]);

	useEffect(() => {
		if (!session) return;
		session.on("streamCreated", (event) => {
			// console.log("Stream created:", event.stream);
			// const subscriber = session.subscribe(event.stream, undefined);
			// setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
			const existingStream = subscribers.find((subscriber) => subscriber.stream.streamId === event.stream.streamId);
			if (existingStream) {
				// 기존 스트림이 존재한다면 중복으로 간주하고 추가 동작을 수행하지 않습니다.
				console.log("Stream already published");
				return;
			}

			// 중복되지 않는 스트림의 경우 구독자 목록에 추가
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
	}, [session, subscribers]);

	useEffect(() => {
		const onbeforeunload = (event) => {
			leaveSession();
		};

		window.addEventListener("beforeunload", onbeforeunload);

		return () => {
			window.removeEventListener("beforeunload", onbeforeunload);
		};
	}, []);

	// const handleChangeSessionId = (e) => {
	// 	setMySessionId({ ...mySessionId, mySessionId: e.target.value });
	// };

	// const handleChangeUserName = (e) => {
	// 	setMyUserName({ ...myUserName, myUserName: e.target.value });
	// };

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

	const leaveSession = () => {
		if (session) {
			session.disconnect();
		}

		setSession(undefined);
		setSubscribers([]);
		setMainStreamManager(undefined);
		setPublisher(undefined);
		// setMySessionId(roomId);
		// setMyUserName(user.id);
	};

	const switchCamera = async () => {
		try {
			const devices = await OV.getDevices();
			const videoDevices = devices.filter((device) => device.kind === "videoinput");

			if (videoDevices && videoDevices.length > 1) {
				const newVideoDevice = videoDevices.filter((device) => device.deviceId !== currentVideoDevice.deviceId);

				if (newVideoDevice.length > 0) {
					const newPublisher = OV.initPublisher(undefined, {
						videoSource: newVideoDevice[0].deviceId,
						publishAudio: true,
						publishVideo: true,
						mirror: true,
					});

					newPublisher.once("accessAllowed", async () => {
						await session.unpublish(mainStreamManager);
						await session.publish(newPublisher);

						setCurrentVideoDevice(newVideoDevice[0]);
						setMainStreamManager(newPublisher);
						setPublisher(newPublisher);
					});
				}
			}
		} catch (e) {
			console.error(e);
		}
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
		<div className="container">
			<VideoContainer>
				{session !== undefined ? (
					<div id="session">
						<div id="session-header">
							<h1 id="session-title">mysessionId: {mySessionId}</h1>
							{/* <input
							className="btn btn-large btn-danger"
							type="button"
							id="buttonLeaveSession"
							onClick={leaveSession}
							value="Leave session"
						/> */}
							<input
								className="btn btn-large btn-success"
								type="button"
								id="buttonSwitchCamera"
								onClick={switchCamera}
								value="Switch Camera"
							/>
							<a href={`/room/${roomId}`}>
								<OutButton onClick={leaveSession}>Exit!</OutButton>
							</a>
						</div>

						{mainStreamManager !== undefined ? (
							<VideoBox>
								<div id="main-video" className="col-md-6">
									<UserVideoComponent streamManager={mainStreamManager} />
								</div>
							</VideoBox>
						) : null}
						<div id="video-container" className="col-md-6">
							{subscribers.map((sub, i) => (
								<div
									key={sub.id}
									className="stream-container col-md-6 col-xs-6"
									onClick={() => handleMainVideoStream(sub)}
								>
									<span>{sub.id}</span>
									<VideoBox>
										<UserVideoComponent streamManager={sub} />
									</VideoBox>
								</div>
							))}
						</div>
					</div>
				) : null}
			</VideoContainer>
		</div>
	);
};

export default VideoChat;
