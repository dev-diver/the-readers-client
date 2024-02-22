import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "f8d2691813d64a529bb37a247fadba03";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
