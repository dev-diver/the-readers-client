import React, { useEffect } from "react";

function PageCanvas({ canvasRef, pageNum, pageWrapper }) {
	const [pageRect, setPageRect] = React.useState({});

	useEffect(() => {
		if (pageWrapper) {
			const newRect = {
				left: 0,
				top: 0,
				width: pageWrapper.scrollWidth,
				height: pageWrapper.scrollHeight,
			};

			setPageRect(newRect);
		}
	}, [pageWrapper]);

	return (
		<canvas
			ref={(el) => (canvasRef.current[pageNum] = el)}
			width={pageRect.width}
			height={pageRect.height}
			style={{
				// border: "1px solid black",
				pointerEvents: "none",
				position: "absolute",
				left: 0,
				top: 0,
			}}
		></canvas>
	);
}

export default PageCanvas;
