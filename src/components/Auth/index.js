import React, { useState, useEffect } from "react";
import ProfileButton from "components/Buttons/ProfileButton";
import PopUp from "components/PopUp";
import LoginForm from "components/form/LogInForm";
import ProfileCard from "components/form/ProfileCard";
import SignControllButton from "components/Buttons/SignControllButton";
import SignUpForm from "components/form/SignUpForm";

export default function Auth() {
	const [user, setUser] = useState(null);
	const [popState, setPopState] = useState("none");

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setUser(JSON.parse(user));
		}
	}, []);

	const closeHandler = () => {
		setPopState("none");
	};

	return (
		<>
			<SignControllButton setPopState={setPopState} isLogin={user?.token} setUser={setUser} />
			<ProfileButton clickHandler={() => setPopState("profile")} isLogin={user?.token} setUser={setUser} />
			<PopUp isOpen={popState == "login"} onClose={closeHandler}>
				<LoginForm setPopState={setPopState} setUser={setUser} isLogin={user?.token} />
			</PopUp>
			<PopUp isOpen={popState == "signup"} onClose={closeHandler}>
				<SignUpForm />
			</PopUp>
			<PopUp isOpen={popState == "profile"} onClose={closeHandler}>
				<h1>프로필</h1>
				<ProfileCard setPopState={setPopState} user={user} setUser={setUser} />
			</PopUp>
		</>
	);
}
