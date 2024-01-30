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

// {/* <style>
//     /* CSS 스타일링 */
//     .profile-form {
//         /* 프로필 form 스타일 설정 */
//     }

//     .profile-form .photo {
//         /* 사진 스타일 설정 */
//     }

//     .profile-form .upload-button {
//         /* 사진 업로드 버튼 스타일 설정 */
//     }

//     .profile-form .badge {
//         /* 뱃지 스타일 설정 */
//     }

//     .profile-form .followers {
//         /* 팔로워 숫자 스타일 설정 */
//     }

//     .profile-form .following {
//         /* 팔로잉 숫자 스타일 설정 */
//     }

//     .profile-form .settings-button {
//         /* 설정 버튼 스타일 설정 */
//     }

//     .profile-form .logout-button {
//         /* 로그아웃 버튼 스타일 설정 */
//     }
// </style>

// <form class="profile-form">
//     <div class="photo">
//         <!-- 사진 요소 -->
//     </div>
//     <div class="upload-button">
//         <!-- 사진 업로드 버튼 요소 -->
//     </div>
//     <div class="badge">
//         <!-- 뱃지 요소 -->
//     </div>
//     <div class="followers">
//         <!-- 팔로워 숫자 요소 -->
//     </div>
//     <div class="following">
//         <!-- 팔로잉 숫자 요소 -->
//     </div>
//     <div class="settings-button">
//         <!-- 설정 버튼 요소 -->
//     </div>
//     <div class="logout-button">
//         <!-- 로그아웃 버튼 요소 -->
//     </div>
// </form> */}
