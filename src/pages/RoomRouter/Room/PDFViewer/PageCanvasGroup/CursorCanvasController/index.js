import React, { useRef, useEffect } from "react";
import socket from "socket";
import { useRecoilState, useRecoilCallback } from "recoil";
import { cursorCanvasRefFamily, bookChangedState, totalPageState } from "recoil/atom";
import { redrawCanvas, updatePointers } from "./util";

export default function CursorCanvasController() {
	const pointers = useRef([]);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [totalPage, setTotalPage] = useRecoilState(totalPageState);

	const updateCursorCanvasRefs = useRecoilCallback(
		({ set }) =>
			(pageNum, value) => {
				set(cursorCanvasRefFamily({ pageNum }), value);
			},
		[]
	);

	useEffect(() => {
		if (totalPage === 0) return;
		for (let page = 1; page <= totalPage; page++) {
			updateCursorCanvasRefs(page, React.createRef());
		}
		setBookChanged((prev) => !prev);
	}, [totalPage]);

	const handleUpdatePointer = useRecoilCallback(({ snapshot }) => async (data) => {
		const canvas = await snapshot.getPromise(cursorCanvasRefFamily({ pageNum: data.pageNum }));

		if (!canvas) return;
		updatePointers(pointers.current, data);
		redrawCanvas(canvas, pointers.current);
	});

	useEffect(() => {
		socket.on("update-pointer", handleUpdatePointer);
		return () => {
			socket.off("update-pointer", handleUpdatePointer);
		};
	}, []);

	return <></>;
}
