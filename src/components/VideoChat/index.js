import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import { Container, OutButton, StartButton, VideoBox, VideoContainer } from "./style";

const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";

const VideoChat = () => {
	const [session, setSession] = useState(undefined);
	const [subscribers, setSubscribers] = useState([]);
	const [mainStreamManager, setMainStreamManager] = useState(undefined);
	const [publisher, setPublisher] = useState(undefined);
	const [mySessionId, setMySessionId] = useState("SessionA");
	const [myUserName, setMyUserName] = useState(`Participant${Math.floor(Math.random() * 100)}`);
	const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

	// const { roomId } = useParams();
	const navigate = useNavigate();

	const OV = new OpenVidu();

	useEffect(() => {
		const onbeforeunload = (event) => {
			leaveSession();
		};

		window.addEventListener("beforeunload", onbeforeunload);

		return () => {
			window.removeEventListener("beforeunload", onbeforeunload);
		};
	}, []);

	useEffect(() => {
		if (session) {
			session.on("streamCreated", (event) => {
				const subscriber = session.subscribe(event.stream, undefined);
				setSubscribers((prev) => ({
					...prev,
					subscribers: [...prev.subscribers, subscriber],
				}));
			});

			session.on("streamDestroyed", (event) => {
				deleteSubscriber(event.stream.streamManager);
			});

			session.on("exception", (exception) => {
				console.warn(exception);
			});
		}
	}, [session]);

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
		const mySession = OV.initSession();
		setSession(mySession);

		mySession.on("streamCreated", (event) => {
			const subscriber = mySession.subscribe(event.stream, undefined);
			setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
		});

		mySession.on("streamDestroyed", (event) => {
			setSubscribers((prevSubscribers) =>
				prevSubscribers.filter((subscriber) => subscriber !== event.stream.streamManager)
			);
		});

		mySession.on("exception", (exception) => {
			console.warn(exception);
		});

		try {
			const token = await getToken();
			await mySession.connect(token, { clientData: myUserName });

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

			mySession.publish(publisher);

			const devices = await OV.getDevices();
			const videoDevices = devices.filter((device) => device.kind === "videoinput");
			const videoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
			const videoDevice = videoDevices.find((device) => device.deviceId === videoDeviceId);

			setMainStreamManager(publisher);
			setPublisher(publisher);
			setCurrentVideoDevice(videoDevice);
		} catch (error) {
			console.log("There was an error connecting to the session:", error.code, error.message);
		}
	};

	const leaveSession = () => {
		if (session) {
			session.disconnect();
		}

		setSession(undefined);
		setSubscribers([]);
		setMainStreamManager(undefined);
		setPublisher(undefined);
		setMySessionId("SessionA");
		setMyUserName(`Participant${Math.floor(Math.random() * 100)}`);
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
	const createSession = async (sessionId) => {
		try {
			const response = await axios.post(
				`${APPLICATION_SERVER_URL}api/sessions`,
				{ customSessionId: sessionId },
				{ headers: { "Content-Type": "application/json" } }
			);
			return response.data; // The sessionId
		} catch (error) {
			console.error(error);
		}
	};

	const createToken = async (sessionId) => {
		try {
			const response = await axios.post(
				`${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
				{},
				{ headers: { "Content-Type": "application/json" } }
			);
			return response.data; // The token
		} catch (error) {
			console.error(error);
		}
	};

	const getToken = async () => {
		try {
			const sessionId = await createSession(mySessionId);
			return await createToken(sessionId);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container">
			{session === undefined ? (
				<div id="join">
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
						<h1 id="session-title">{mySessionId}</h1>
						<input
							className="btn btn-large btn-danger"
							type="button"
							id="buttonLeaveSession"
							onClick={leaveSession}
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
							<div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(publisher)}>
								<UserVideoComponent streamManager={publisher} />
							</div>
						) : null}
						{subscribers.map((sub, i) => (
							<div
								key={sub.id}
								className="stream-container col-md-6 col-xs-6"
								onClick={() => this.handleMainVideoStream(sub)}
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
