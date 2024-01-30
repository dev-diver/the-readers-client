import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { baseURL } from "config/config";
import { logger } from "logger";

const Profilecard = ({ user }) => {
	const navigate = useNavigate();

	useEffect(function () {
		document.getElementById("logout").addEventListener("onClick", handleLogout);
	}, []);

	function handleLogout(event) {
		event.preventDefault();
		navigate("/auth/logout", { replace: true });
	}

	return (
		<div>
			<div className="user-name">안녕하세요! {user.nick}님</div>
			<div className="half">
				<div>팔로잉</div>
				<div className="count following-count">{user.followingCount}</div>
			</div>
			<div className="half">
				<div>팔로워</div>
				<div className="count follower-count">{user.followerCount}</div>
			</div>
			<input id="my-id" type="hidden" value={user.id} />
			<button id="logout" className="btn">
				로그아웃
			</button>
			<form id="login-form" action="/auth/login" method="post" />
		</div>
	);
};

const Profile = () => {
	const [userInfo, setUserInfo] = useState(null);

	var id = userInfo.id;

	useEffect(() => {
		fetch(`${baseURL}/api/user/${userInfo?.id}`)
			.then((res) => res.json())
			.then((data) => {
				logger.log(data);
				setUserInfo(data);
			})
			.catch((err) => {
				logger.error(err);
			});
	}, [userInfo]);

	return <div className="profilepage">{userInfo && <Profilecard user={userInfo} />}</div>;
};

export default Profile;
