import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import ProfileCard from "pages/ProfileCard";
import Header from "components/Header";

function App() {
	return (
		<div>
			<Router>
				<div>
					<Header />
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:roomId/book/:bookId" element={<Room />} />
						<Route path="/room/:roomId" element={<RoomLobby />} />
						<Route path="/profile-card" element={<ProfileCard />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
