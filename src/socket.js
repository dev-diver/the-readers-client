import { io } from "socket.io-client";
import { baseURL } from "config/config";

const socket = io(baseURL, {
	withCredentials: true,
	path: "/socket",
});

export default socket;
