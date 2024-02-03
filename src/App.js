import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import StartAnimation from "pages/ProfileCard";
import styles from "./App.module.css";

import Auth from "./components/Auth";
import ProfileCard from "pages/ProfileCard";
function App() {
	return (
		<div>
			<Router>
				<div>
					<nav>
						<ul>
							<li>
								<Link to="/">Main</Link>
							</li>
						</ul>
						<Auth />
					</nav>
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
