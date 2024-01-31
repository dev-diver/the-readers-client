import React from "react";
import api from "api";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { baseURL } from "config/config";
import { logger } from "logger";
import LogInForm from "./LogInForm";
import SignControllButton from "components/Buttons/SignControllButton";

const ProfileForm = ({ user, setUser, isLogin }) => {
	return <div className="profilepage">{user && <Profilecard user={user} setUser={setUser} />}</div>;
};

const Profilecard = ({ user, setUser, isLogin }) => {
	const navigate = useNavigate();

	// useEffect(function () {
	//     document.getElementById("logout").addEventListener("onClick", handleLogout);
	// }, []);

	function handleLogout(event) {
		event.preventDefault();
		navigate("/auth/logout", { replace: true });
	}

	return isLogin ? (
		<LogInForm />
	) : (
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
			<SignControllButton isLogin={user?.token} setUser={setUser} />
		</div>
	);
};

export default ProfileForm;
