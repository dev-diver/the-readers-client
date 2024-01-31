import React from "react";

const PopUp = ({ isOpen, onClose, children }) => {
	const myStyle = {
		display: isOpen ? "block" : "none",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	};

	return (
		<div className={`popup ${isOpen ? "open" : ""}`} style={myStyle}>
			<div className="popup-content">
				<button className="close-button" onClick={onClose}>
					X
				</button>
				{children}
			</div>
		</div>
	);
};

export default PopUp;
