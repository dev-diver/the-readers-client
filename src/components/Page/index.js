import React from "react";
import "./style.css";

function Page({ className }) {
	return (
		<div className={`page ${className}`}>
			<div className="contents">
				<div className="text-wrapper">The Readers</div>
			</div>
		</div>
	);
}

export default Page;
