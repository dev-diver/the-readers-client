import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import { Container, OutButton, StartButton, VideoBox, VideoContainer } from "./style";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";

const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";

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
	// const mySessionId = roomId;
	// const myUserName = user.id;

	const navigate = useNavigate();
	const OV = new OpenVidu();

	useEffect(() => {
		console.log("---1---");
		joinSession();
		console.log("user", user);
		console.log("roomId", roomId);
		console.log("mySessionId", myUserName);
		console.log("myUserName", myUserName);
		console.log("session", session);
		console.log("________subscribers", subscribers);
		console.log("__________mainStreamManager", mainStreamManager);
		console.log("_________publisher", publisher);
	}, [user, roomId]);

	useEffect(() => {
		console.log("session_______", session);
		if (!session) return;
		session.on("streamCreated", (event) => {
			console.log("<-------------Stream created----------->");
			console.log("Stream created:", event.stream);
			const subscriber = session.subscribe(event.stream, undefined);
			setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
		});

		session.on("streamDestroyed", (event) => {
			console.log("<-------------StreamDestroyed----------->");
			setSubscribers((prevSubscribers) =>
				prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager)
			);
		});

		session.on("exception", (exception) => {
			console.warn(exception);
		});

		const connectToSession = async () => {
			try {
				console.log("-----------connectToSession, sesseionId----------", mySessionId);
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
	}, [session]);

	useEffect(() => {
		console.log("---2---");
		const onbeforeunload = (event) => {
			leaveSession();
		};

		window.addEventListener("beforeunload", onbeforeunload);

		return () => {
			window.removeEventListener("beforeunload", onbeforeunload);
		};
	}, []);

	const handleChangeSessionId = (e) => {
		setMySessionId({ ...mySessionId, mySessionId: e.target.value });
	};

	const handleChangeUserName = (e) => {
		setMyUserName({ ...myUserName, myUserName: e.target.value });
	};

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
		console.log("<--------------- joinSession ---------->");
		const mySession = OV.initSession();
		setSession(mySession);
	};

	const leaveSession = () => {
		// redirect to room lobby
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
					// Creating a new publisher with a specific videoSource
					const newPublisher = OV.initPublisher(undefined, {
						videoSource: newVideoDevice[0].deviceId,
						publishAudio: true,
						publishVideo: true,
						mirror: true,
					});

					// Wait for accessAllowed event before unpublishing and publishing
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

	// getToken 함수 수정
	const getToken = async (sessionId) => {
		console.log("<---------- getToken ---------->");
		try {
			// 세션 ID를 사용하여 서버로부터 토큰 요청
			console.log("------try진입----sessionId", sessionId);
			const response = await axios.post(
				`${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
				{},
				{ headers: { "Content-Type": "application/json" } }
			);
			console.log("Token", response.data);
			return response.data; // 토큰 반환
		} catch (error) {
			console.error("Error getting token:", error);
		}
	};

	return (
		<div className="container">
			{session === undefined ? (
				<div id="join">
					<div id="img-div">
						<img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
					</div>
					<div id="join-dialog" className="jumbotron vertical-center">
						<h1> Join a video session </h1>
						<form className="form-group" onSubmit={joinSession}>
							<p>
								<label>Participant: </label>
								<input
									className="form-control"
									type="text"
									id="userName"
									value={myUserName}
									onChange={handleChangeUserName}
									required
								/>
							</p>
							<p>
								<label> Session: </label>
								<input
									className="form-control"
									type="text"
									id="sessionId"
									value={mySessionId}
									onChange={handleChangeSessionId}
									required
								/>
							</p>
							<p className="text-center">
								<input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
							</p>
						</form>
					</div>
				</div>
			) : null}

			{session !== undefined ? (
				<div id="session">
					<div id="session-header">
						<h1 id="session-title">mysessionId: {mySessionId}</h1>
						<input
							className="btn btn-large btn-danger"
							type="button"
							id="buttonLeaveSession"
							onClick={leaveSession} // redirect to room lobby
							value="Leave session"
						/>
						<input
							className="btn btn-large btn-success"
							type="button"
							id="buttonSwitchCamera"
							onClick={switchCamera}
							value="Switch Camera"
						/>
					</div>

					{mainStreamManager !== undefined ? (
						<div id="main-video" className="col-md-6">
							<UserVideoComponent streamManager={mainStreamManager} />
						</div>
					) : null}
					<div id="video-container" className="col-md-6">
						{publisher !== undefined ? (
							<div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
								<UserVideoComponent streamManager={publisher} />
							</div>
						) : null}
						{subscribers.map((sub, i) => (
							<div
								key={sub.id}
								className="stream-container col-md-6 col-xs-6"
								onClick={() => handleMainVideoStream(sub)}
							>
								<span>{sub.id}</span>
								<UserVideoComponent streamManager={sub} />
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default VideoChat;
