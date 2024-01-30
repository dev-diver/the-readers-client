import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "pages/Main";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import ProfilePage from "./pages/Profile";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Highlights from "./pages/Highlights";
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
						</ul>
						<Auth />
					</nav>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:id" element={<Room />} />
						<Route path="/highlights" element={<Highlights />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
