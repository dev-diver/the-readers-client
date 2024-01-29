import React, { useState, useEffect } from "react";
import Book from "components/Book";
import RoomCard from "components/RoomCard";
import SearchChange from "components/SearchChange";
import UploadFile from "./UploadFile";
import { logger } from "logger";
import SignUpButton from "components/Buttons/SignUpButton";
import LogInButton from "components/Buttons/LoginButton";
import PopUp from "components/PopUp";
import SignUpForm from "components/form/SignUpForm";
import LoginForm from "components/form/LogInForm";

// import "./style.css";

function Main() {
	const [data, setData] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);
	const [SignUpPopState, setSignUpPopState] = useState(false);
	const [LogInPopState, setLogInPopState] = useState(false);
	const [user, setUser] = useState(null);
	const [showSignUpForm, setShowSignUpForm] = useState(false);

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

	useEffect(() => {
		if (showSignUpForm) {
			setSignUpPopState(true);
		}
	}, [showSignUpForm]);
	
	const handleShowSignUpForm = () => {
		setShowSignUpForm(true);
	}

	return (
		<div className="mainpage-book">
			<SearchChange setData={setData} />
			<div className="search-result">
				<div className="div">{studyroomList}</div>
			</div>
			<UploadFile />
			<SignUpButton setPopState={setSignUpPopState} isLogin={user?.token}/>
			<LogInButton setPopState={setLogInPopState} isLogin={user?.token} setUser={setUser}/>
			{/* <PopUp isOpen={SignUpPopState} onClose={() => {
				setSignUpPopState(false);
			}}>
				<SignUpForm />
			</PopUp> */}
			<PopUp isOpen={LogInPopState} onClose={() => {
				setLogInPopState(false);
			}}>
				<LoginForm setUser={setUser} isLogin={user?.token} onClick={ handleShowSignUpForm } />
			</PopUp>
		</div>
	);
}

export default Main;
