import React, { useEffect } from "react";

function Input() {
	useEffect(() => {
		// socket.io 추가
		const socketIoScript = document.createElement("script");
		socketIoScript.src = "http:localhost:3000/socket.io/socket.io.js";
		socketIoScript.async = true;
		document.body.appendChild(socketIoScript);

		// 컴포넌트 언마운트시 스크립트 제거
		return () => {
			document.body.removeChild(socketIoScript);
		};
	}, []);

	return <Input />;
}

export default Input;
