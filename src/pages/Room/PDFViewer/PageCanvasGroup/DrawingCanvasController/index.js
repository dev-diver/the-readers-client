import React, { useEffect } from "react";
import socket from "socket";
import { useRecoilCallback } from "recoil";
import { canvasElementsFamily } from "recoil/atom";
import { blobToJson } from "./utils";

export default function DrawingCanvasController() {
	const updateCanvasElement = useRecoilCallback(
		({ set }) =>
			(pageNum, userId, elements) => {
				const elementKey = { pageNum: pageNum, userId: userId };
				set(canvasElementsFamily(elementKey), elements);
			},
		[]
	);

	useEffect(() => {
		const handleShareCanvas = (data) => {
			const { user, location, elements } = data;
			console.log("share-canvas", data);
			const dataBlob = data;
			blobToJson(dataBlob).then((json) => {
				console.log("복호화", json);
				const { user, location, elements } = json;
				updateCanvasElement(location.pageNum, user.id, elements);
			});
		};
		socket.on("share-canvas", handleShareCanvas);
		return () => {
			socket.off("canvasImage", handleShareCanvas);
		};
	}, [updateCanvasElement]);

	return <></>;
}
