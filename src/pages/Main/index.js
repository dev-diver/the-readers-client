import React, { useState, useEffect } from "react";
// import Book from "components/Book";
import RoomCard from "components/RoomCard";
import SearchForm from "components/SearchForm";
import UploadFile from "./UploadFile";
import MakeRoom from "components/MakeRoom";
import FindRoom from "components/FindRoom";
import Page from "components/Page";
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
	const [rooms, setRoom] = useState([]);
	const [books, setBooks] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);
	const [bookList, setBookList] = useState([]);
	const [SignUpPopState, setSignUpPopState] = useState(false);
	const [LogInPopState, setLogInPopState] = useState(false);
	const [user, setUser] = useState(null);
	const [showSignUpForm, setShowSignUpForm] = useState(false);
	const [ProfilePopState, setProfilePopState] = useState(false);
	const [popState, setPopState] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setUser(JSON.parse(user));
		}
	}, []);

	useEffect(() => {
		console.log("user", user);
	}, [user]);

	useEffect(() => {
		const newData = rooms.map((room, i) => {
			return <RoomCard key={i} room={room} />;
		});
		setStudyroomList(newData);
	}, [rooms]);

	useEffect(() => {
		const newData = books.map((book, i) => {
			return <></>;
		});
		setBookList(newData);
	}, [books]);

	useEffect(() => {
		console.log("data changed");
		const newData = data.map((e, i) => {
			return <Book key={i} name={e.name} id={e.id}></Book>;
		});
		setStudyroomList(newData);
	}, [data]);

	return (
		<div>
			{/* <div className="mainpage-book">
				<SearchForm setData={setRoom} mode="room" />
				<div className="search-result">
					<div className="div">{studyroomList}</div>
				</div>
				<UploadFile />
			</div>
			<div className="mainpage-book">
				<SearchForm setData={setBooks} mode="book" />
				<div className="search-result">
					<div className="div">{bookList}</div>
				</div>
				<UploadFile />
			</div> */}
			<MakeRoom />
			<FindRoom />
			<UploadFile />
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
		</div>
	);
}

export default Main;
