import React from "react";

const LogInButton = ({ handler }) => {
	return <button onClick={handler}>로그인</button>;
};

const LogOutButton = ({ onClose, setUser }) => {
	const handler = () => {
		console.log("logout");
		localStorage.removeItem("user");
		setUser(null);
		onClose();
	};

	return <button onClick={handler}>로그아웃</button>;
};

const SignControllButton = ({ setPopState, isLogin, setUser }) => {
	const closeHandler = () => {
		setPopState("none");
	};
	return isLogin ? (
		<LogOutButton onClose={closeHandler} setUser={setUser} />
	) : (
		<LogInButton handler={() => setPopState("login")} />
	);
};

export default SignControllButton;
