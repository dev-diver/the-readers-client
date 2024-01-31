import React from "react";
import SignControllButton from "components/Buttons/SignControllButton";

const ProfileCard = ({ setPopState, user, setUser }) => {
	return (
		user && (
			<div className="profilepage">
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
					<SignControllButton setPopState={setPopState} isLogin={user?.token} setUser={setUser} />
				</div>
			</div>
		)
	);
};

export default ProfileCard;
