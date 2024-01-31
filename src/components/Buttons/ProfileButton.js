import React from "react";

const ProfileButton = ({ clickHandler, isLogin }) => {
	return isLogin ? <button onClick={clickHandler}>프로필 보기</button> : <></>;
};

export default ProfileButton;
