import React from "react";

import { Button } from "@mui/material";
import { useRecoilState } from "recoil";

import { userState } from "recoil/atom";

export const LogInButton = ({ handler }) => {
	return (
		<Button variant="contained" onClick={handler}>
			로그인
		</Button>
	);
};

export const LogOutButton = ({ onClose }) => {
	const [user, setUser] = useRecoilState(userState);

	const handler = () => {
		localStorage.removeItem("user");
		onClose();
		setUser(null);
	};

	return (
		<Button variant="contained" onClick={handler}>
			로그아웃
		</Button>
	);
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
