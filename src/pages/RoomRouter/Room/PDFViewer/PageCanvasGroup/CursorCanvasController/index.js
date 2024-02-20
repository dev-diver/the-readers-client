import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilState, useRecoilCallback } from "recoil";
import { cursorCanvasRefFamily, bookChangedState, bookState } from "recoil/atom";
import { redrawCanvas, updatePointers } from "./util";

export default function CursorCanvasController() {
	const pointers = useRef([]);
	const { bookId } = useParams();
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [book, setBook] = useRecoilState(bookState);

	const updateCursorCanvasRefs = useRecoilCallback(
		({ set }) =>
			(pageNum, value) => {
				set(cursorCanvasRefFamily({ bookId: bookId, pageNum: pageNum }), value);
			},
		[]
	);

	useEffect(() => {
		if (book?.totalPage === 0) return;
		for (let page = 1; page <= book?.totalPage || 0; page++) {
			updateCursorCanvasRefs(page, React.createRef());
		}
		setBookChanged((prev) => !prev);
	}, [book]);

	const handleUpdatePointer = useRecoilCallback(
		({ snapshot }) =>
			async (data) => {
				const canvas = await snapshot.getPromise(cursorCanvasRefFamily({ bookId: bookId, pageNum: data.pageNum }));
				if (!canvas) return;
				updatePointers(pointers.current, data);
				redrawCanvas(canvas, pointers.current);
			},
		[redrawCanvas, updatePointers, pointers]
	);

	const onPointerUpdate = (data) => {
		handleUpdatePointer(data);
	};

	useEffect(() => {
		socket.on("update-pointer", onPointerUpdate);
		return () => {
			socket.off("update-pointer", onPointerUpdate);
		};
	}, [handleUpdatePointer]);

	return <></>;
}
