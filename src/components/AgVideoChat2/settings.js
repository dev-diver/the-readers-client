import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "76b0ac36b01048398d9b51ac87db712f";
const token =
	"007eJxTYOByPyeZrOZU/FPr75MTEVukfgRPU9LM+d+4aK2ptQTbAwYFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olDan6EJqQyAjw2bubkZGBggE8VkYchMz8xgYANc/Hek=";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
