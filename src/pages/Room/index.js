import React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";

function Room() {
	const { bookId } = useParams();
	const { roomId } = useParams();
	// useEffect(() => {}, []);

	return (
		<div className="container">
			{/* <RtcViewer/> */}
			<PDFViewer roomId={roomId} bookId={bookId} />
		</div>
	);
}

export default Room;
