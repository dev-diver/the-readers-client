/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Search } from "../Search";
import "./style.css";

export const SearchBox = ({
	className,
	searchUnion = "https://c.animaapp.com/yGFj865V/img/union.svg",
	hasVector = true,
}) => {
	return (
		<div className={`search-box ${className}`}>
			<div className="input-container">
				<input type="text" required />
			</div>
			<Search
				className="search-icon"
				ellipse="https://c.animaapp.com/yGFj865V/img/ellipse-54-1.svg"
				ellipseClassName="search-icon-2"
				ellipseClassNameOverride="search-icon-3"
				overlapGroupClassName="search-instance"
				union={searchUnion}
				unionClassName="design-component-instance-node"
			/>
			{hasVector && <img className="vector" alt="Vector" src="https://c.animaapp.com/yGFj865V/img/vector.svg" />}
		</div>
	);
};

SearchBox.propTypes = {
	searchUnion: PropTypes.string,
	hasVector: PropTypes.bool,
};
