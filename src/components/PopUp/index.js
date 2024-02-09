import { Button } from "@mui/material";
import React from "react";

const PopUp = ({ isOpen, onClose, children }) => {
	const myStyle = {
		display: isOpen ? "block" : "none",
	};

	return (
		<div className={`popup ${isOpen ? "open" : ""}`} style={myStyle}>
			<div className="popup-content">{children}</div>
		</div>
	);
};

export default PopUp;
