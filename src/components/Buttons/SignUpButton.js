import React from "react";

const SignUpButton = ({ setPopState, isLogin }) => {
	const handleClick = () => {
		setPopState(true);
	};

	return isLogin ? null : (
		<button style={{ backgroundColor: "blue", color: "white" }} onClick={handleClick}>
			회원 가입
		</button>
	);
};

export default SignUpButton;
