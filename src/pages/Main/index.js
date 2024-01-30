import React, { useState, useEffect } from "react";
import Book from "components/Book";
import RoomCard from "components/RoomCard";
import SearchChange from "components/SearchChange";
import UploadFile from "./UploadFile";
import { logger } from "logger";
import SignUpButton from "components/Buttons/SignUpButton";
import ProfileButton from "components/Buttons/ProfileButton";
import PopUp from "components/PopUp";
import LoginForm from "components/form/LogInForm";
import ProfileForm from "components/form/ProfileForm";
import SignControllButton from "components/Buttons/SignControllButton";

// import "./style.css";

function Main() {
	const [data, setData] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);
	const [SignUpPopState, setSignUpPopState] = useState(false);
	const [LogInPopState, setLogInPopState] = useState(false);
	const [user, setUser] = useState(null);
	const [showSignUpForm, setShowSignUpForm] = useState(false);
	const [ProfilePopState, setProfilePopState] = useState(false);
	const [popState, setPopState] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem('user');
		if (user) {
			setUser(JSON.parse(user));
		}
	},[]);

	useEffect(() => {
		console.log('user', user);
	},[user])

	useEffect(() => {
		const newData = data.map((room, i) => {
			return <RoomCard key={i} room={room} />;
		});
		setStudyroomList(newData);
	}, [data]);

	return (
		<div className="mainpage-book">
			<SearchChange setData={setData} />
			<div className="search-result">
				<div className="div">{studyroomList}</div>
			</div>
			<UploadFile />
			<SignControllButton setPopState={setLogInPopState} isLogin={user?.token} setUser={setUser} />
			<ProfileButton setPopState={setProfilePopState} isLogin={user?.token} setUser={setUser} />
			{user?.token ? ( 
				<PopUp isOpen={ProfilePopState} 
					onClose={() => {
					setProfilePopState(false);}}>
					<ProfileForm user={user} setUser={setUser} isLogin={user?.token} />			
				</PopUp>
			) : ( 
				<PopUp isOpen={LogInPopState} 
					onClose={() => {
					setLogInPopState(false);}}>
					<LoginForm setUser={setUser} isLogin={user?.token} />
				</PopUp>
			)}
		</div>
	);
}

export default Main;
