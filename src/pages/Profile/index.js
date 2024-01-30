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

//       {<div className="div">
//         <div className="overlap">
//           <div className="text-wrapper">badge 3</div>
//         </div>
//         <div className="overlap-group">
//           <div className="rectangle" />
//           <Close1 className="close" />
//           <div className="dengsmas-on-ig" />
//           <div className="rectangle-2" />
//           <div className="text-wrapper-2">edit</div>
//           <div className="ellipse" />
//         </div>
//         <div className="div-wrapper">
//           <div className="text-wrapper-3">following</div>
//         </div>
//         <div className="overlap-2">
//           <div className="text-wrapper-4">follower</div>
//         </div>
//         <div className="overlap-group-2">
//           <div className="rectangle-3" />
//           <div className="rectangle-3" />
//           <div className="text-wrapper-5">내 서재</div>
//         </div>
//         <div className="overlap-3">
//           <img className="marker-pen" alt="Marker pen" src="https://c.animaapp.com/U5MPyiHk/img/marker-pen@2x.png" />
//           <div className="overlap-4">
//             <div className="rectangle-4" />
//             <div className="rectangle-5" />
//             <div className="text-wrapper-6">상태 메세지</div>
//           </div>
//         </div>
//         <img className="img" alt="Rectangle" src="https://c.animaapp.com/U5MPyiHk/img/rectangle-9@2x.png" />
//         <div className="overlap-5">
//           <img className="rectangle-6" alt="Rectangle" src="https://c.animaapp.com/U5MPyiHk/img/rectangle-205.svg" />
//           <div className="text-wrapper-7">최근에 읽은 책</div>
//         </div>
//         <div className="overlap-6">
//           <div className="text-wrapper-8">badge 1</div>
//         </div>
//         <div className="overlap-7">
//           <div className="text-wrapper-9">badge 2</div>
//         </div>
//         <div className="overlap-8">
//           <div className="text-wrapper-10">setting</div>
//         </div>
//         <div className="overlap-9">
//           <div className="text-wrapper-11">Logout</div>
//         </div>
//       </div>
//     </div>
//   );
// };