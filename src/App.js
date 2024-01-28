import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Room from "pages/Room";
import Main from "pages/Main";

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Main</Link>
						</li>
						<li>
							<Link to="/rooms">Room</Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/room/:roomId/book/:bookId" element={<Room />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
