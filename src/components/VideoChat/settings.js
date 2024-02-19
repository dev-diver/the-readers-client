import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "76b0ac36b01048398d9b51ac87db712f";
const token =
	"007eJxTYKj7ffzBnf8qe2dNi/AznCRo+H//wyYvuaXT701XUrU8uLVdgcHcLMkgMdkYSBoamFgYW1qkWCaZGiYmW5inJJkbGqWVX7uY2hDIyCDBnc3EyACBID4LQ25iZh4DAwDmCiCg";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
