import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "76b0ac36b01048398d9b51ac87db712f";
const token =
  "007eJxTYHAW6PmT11+9bp1SiFOojZXEdI6mlzk7Jy4/lN38NNvn7TcFBnOzJIPEZGMgaWhgYmFsaZFimWRqmJhsYZ6SZG5olLZf43xqQyAjw6/jB5kYGSAQxGdhyE3MzGNgAABXZiCe";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
