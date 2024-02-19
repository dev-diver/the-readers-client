import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
import { RecoilRoot, useRecoilSnapshot } from "recoil";

function DebugObserver() {
	const snapshot = useRecoilSnapshot();
	useEffect(() => {
		console.debug("The following atoms were modified:");
		for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
			console.debug(node.key, snapshot.getLoadable(node));
		}
	}, [snapshot]);

	return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<RecoilRoot>
		{/* <DebugObserver /> */}
		<App />
	</RecoilRoot>
	// </React.StrictMode>
);
