import { io } from "socket.io-client";

export const baseURL = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3000";

const socket = io(baseURL, {
	withCredentials: true,
	path: "/socket",
});

export default socket;
