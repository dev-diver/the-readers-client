import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import Intro from "pages/Intro";
import Header from "components/Header";

import Auth from "./components/Auth";
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
							<li>
								<Link to="/video">Video</Link>
							</li>
						</ul>
						<Auth />
					</nav>
					<Header />
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:roomId/book/:bookId" element={<Room />} />
						<Route path="/room/:roomId" element={<RoomLobby />} />
						<Route path="/intro" element={<Intro />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
