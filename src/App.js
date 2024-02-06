import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "pages/Main";
import RoomRouter from "RoomRouter";
import Intro from "pages/Intro";
import Header from "components/Header";

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
					</nav>
					<Header />
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/room/:roomId/*" element={<RoomRouter />} />
						<Route path="/intro" element={<Intro />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
