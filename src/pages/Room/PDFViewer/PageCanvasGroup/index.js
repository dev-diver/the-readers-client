import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { canvasMouse, clearCanvas } from "./CursorCanvasController/util";
import { userState, roomUsersState, cursorCanvasRefsState, penModeState, bookChangedState } from "recoil/atom";

import UserPageDrawingCanvas from "./DrawingCanvasController/UserPageDrawingCanvas";

function PageCanvasGroup({ pageNum, canvasFrame }) {
	const { bookId, roomId } = useParams();
	// 여기에서 추가하기
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [cursorCanvasRefs, setCursorCanvasRefs] = useRecoilState(cursorCanvasRefsState);

	const [penMode, setPenMode] = useRecoilState(penModeState);

	const setRef = useCallback(
		(el) => {
			setCursorCanvasRefs((oldRefs) => {
				const newRefs = oldRefs.map((pageRef) => {
					if (pageRef.page === pageNum) {
						return { ...pageRef, ref: { current: el } };
					}
					return pageRef;
				});
				return newRefs;
			});
		},
		[pageNum, bookChanged, setCursorCanvasRefs]
	);

	const info = { user: user, bookId: bookId, pageNum: pageNum };
	//pointer canvas도 밖으로 빼기
	return (
		<div className="page-canvas-group">
			<canvas
				id={`pointer-canvas-${pageNum}`}
				ref={setRef}
				width={canvasFrame.scrollWidth}
				height={canvasFrame.scrollHeight}
				style={{
					border: "1px solid black",
					pointerEvents: penMode == "pointer" ? "auto" : " none",
					position: "absolute",
					left: 0,
					top: 0,
				}}
				onMouseMove={(e) => canvasMouse(e, info)}
				onMouseOut={(e) => {
					//socket 신호가 더 늦게와서 다시 그려짐
					clearCanvas(e.target);
				}}
			></canvas>
			{roomUsers?.map((roomUser, i) => (
				<UserPageDrawingCanvas key={i} index={i} pageNum={pageNum} canvasFrame={canvasFrame} roomUser={roomUser} />
			)) || []}
		</div>
	);
}

export default PageCanvasGroup;
