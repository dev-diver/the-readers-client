import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "8f8d0e2bad4645fbb9d17554b76a6206";
const token =
	"007eJxTYNhqH6x5UCaw0eLDxwtF+90Sd6u2tNjdjnFWvnZ2uZDWwXwFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olHbw2qXUhkBGhorCEyyMDBAI4rMw5CZm5jEwAABHgB/7";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
