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
