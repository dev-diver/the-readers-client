import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";

function DrawingCanvas({ socket }) {
	return (
		<div>
			<App socket={socket} />
		</div>
	);
}

export default DrawingCanvas;
