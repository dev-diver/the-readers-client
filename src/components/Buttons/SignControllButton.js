import React from "react";

const LogInButton = ({ setPopState }) => {
	const handler = () => {
		setPopState(true);
	};

	return <button onClick={handler}>로그인</button>;
};

const LogOutButton = ({ setUser }) => {
	const handler = () => {
		console.log("logout");
		localStorage.removeItem("user");
		setUser(null);
	};

	return <button onClick={handler}>로그아웃</button>;
};

const SignControllButton = ({ setPopState, isLogin, setUser }) => {
	return isLogin ? <LogOutButton setUser={setUser} /> : <LogInButton setPopState={setPopState} />;
};

export default SignControllButton;
