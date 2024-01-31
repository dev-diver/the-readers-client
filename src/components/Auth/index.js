import React, { useState, useEffect } from "react";
import ProfileButton from "components/Buttons/ProfileButton";
import PopUp from "components/PopUp";
import LoginForm from "components/form/LogInForm";
import ProfileForm from "components/form/ProfileForm";
import SignControllButton from "components/Buttons/SignControllButton";

export default function Auth() {
	const [user, setUser] = useState(null);
	const [LogInPopState, setLogInPopState] = useState(false);
	const [ProfilePopState, setProfilePopState] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setUser(JSON.parse(user));
		}
	}, []);

	useEffect(() => {
		console.log("user", user);
	}, [user]);

	return (
		<>
			<SignControllButton setPopState={setLogInPopState} isLogin={user?.token} setUser={setUser} />
			<ProfileButton setPopState={setProfilePopState} isLogin={user?.token} setUser={setUser} />
			{user?.token ? (
				<PopUp
					isOpen={ProfilePopState}
					onClose={() => {
						setProfilePopState(false);
					}}
				>
					<ProfileForm user={user} setUser={setUser} isLogin={user?.token} />
				</PopUp>
			) : (
				<PopUp
					isOpen={LogInPopState}
					onClose={() => {
						setLogInPopState(false);
					}}
				>
					<LoginForm setUser={setUser} isLogin={user?.token} />
				</PopUp>
			)}
		</>
	);
}
