import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";

import Auth from "./components/Auth";
// import VideoRoom from "pages/VideoRoom";
import VideoChat from "./components/VideoChat";
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
							<li>{/* <Link to="/video">Video</Link> */}</li>
						</ul>
						<Auth />
					</nav>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:roomId/book/:bookId" element={<Room />} />
						<Route path="/room/:roomId" element={<RoomLobby />} />
						<Route path="/video" element={<VideoChat />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
