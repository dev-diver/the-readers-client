import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";

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
					</nav>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:roomId" element={<RoomLobby />} />
						<Route path="/room/:roomId/book/:bookId" element={<Room />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
