import React, { useRef, useEffect } from "react";
import socket from "socket";
import { useRecoilState } from "recoil";
import { cursorCanvasRefsState, bookChangedState } from "recoil/atom";
import { redrawCanvas, updatePointers } from "./util";

export default function CursorCanvasController({ totalPage }) {
	const pointers = useRef([]);
	const [cursorCanvasRefs, setCursorCanvasRefs] = useRecoilState(cursorCanvasRefsState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);

	useEffect(() => {
		if (totalPage === 0) return;
		const newRefs = new Array(totalPage).fill(null).map((e, i) => {
			return { page: i + 1, ref: React.createRef() };
		});
		setBookChanged((prev) => !prev);
		setCursorCanvasRefs(newRefs);
	}, [totalPage]);

	useEffect(() => {
		if (cursorCanvasRefs.length === 0) return;
		socket.on("update-pointer", (data) => {
			const canvasRefItem = cursorCanvasRefs.find((refItem) => refItem.page == data.page);
			const canvas = canvasRefItem ? canvasRefItem.ref : null;
			updatePointers(pointers.current, data);
			redrawCanvas(canvas, pointers.current);
		});
		return () => {
			socket.off("update-pointer");
		};
	}, [cursorCanvasRefs]);

	return <div>CanvasController</div>;
}
