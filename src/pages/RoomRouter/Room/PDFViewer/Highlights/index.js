import { logger } from "logger";
import api from "api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { rangeToInfo, InfoToRange, eraseHighlight, drawHighlight } from "./util";
import { useRecoilState, useRecoilCallback } from "recoil";
import {
	bookChangedState,
	roomUsersState,
	penModeState,
	userState,
	scrollerRefState,
	highlightState,
	buttonGroupsPosState,
	currentHighlightIdState,
	totalPageState,
	highlightLoadStateFamily,
} from "recoil/atom";
import { useToggleDrawer } from "recoil/handler";
import socket from "socket.js";
import "./styles.css";

import HighlightList from "./HighlightList";

import OptionsModal from "components/OptionsModal";
import { useGetPageLoadState } from "../PdfScroller/util";
function Highlighter({ bookId, renderContent }) {
	const { roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [prevRoomUsers, setPrevRoomUsers] = useState([]);
	const [color, setColor] = useState("yellow");
	const toggleDrawer = useToggleDrawer();

	// 진태 추가 코드
	const [optionsModalOpen, setOptionsModalOpen] = useState(false);
	const [highlightId, setHighlightId] = useState(null);
	const [highlightInfos, setHighlightInfos] = useState(null);
	const [totalPages, setTotalPages] = useRecoilState(totalPageState);

	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);
	const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);

	const recoilProps = {
		setButtonGroupsPos,
		setCurrentHighlightId,
	};

	const getPageLoadState = useGetPageLoadState();

	const updatehighlightLoadState = useRecoilCallback(
		({ set }) =>
			(userId, flag) => {
				console.log("userId", userId, "totalPages", totalPages, "updatehighlightLoadState", flag);
				for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
					set(highlightLoadStateFamily({ bookId: bookId, pageNum: pageNum, userId: userId }), flag);
				}
			},
		[totalPages, bookId]
	);

	useEffect(() => {
		scrollerRef?.addEventListener("mouseup", selectionToHighlight);
		return () => {
			scrollerRef?.removeEventListener("mouseup", selectionToHighlight);
		};
	}, [scrollerRef, user, penMode]);

	useEffect(() => {
		setHighlightList([]);
	}, [bookId]);

	const selectionToHighlight = () => {
		if (!user) {
			alert("하이라이팅은 로그인이 필요합니다.");
			toggleDrawer("signin")();
			return;
		}
		const selectedRange = window.getSelection();

		if (penMode == "highlight" && selectedRange.rangeCount == 1 && !selectedRange.isCollapsed) {
			const range = selectedRange.getRangeAt(0);
			// console.log(range);
			const additionalInfo = { bookId: bookId, text: selectedRange.toString() };
			const highlightInfo = rangeToInfo(range, additionalInfo);
			// console.log("highlightInfo", highlightInfo);
			setOptionsModalOpen(true);
			setHighlightInfos([highlightInfo]);
		}

		selectedRange.removeAllRanges();
	};

	useEffect(() => {
		if (renderContent) {
			if (user) {
				console.log("my applyServerHighlight");
				loadHighlightList(user.id, bookId); //true
				// loadAllPageHighlight(user.id, bookId, color);
			} else {
				console.log("로그아웃, 하이라이트 지움");
				setHighlightList([]);
				scrollerRef.querySelectorAll("mark").forEach((highlight) => {
					const highlightId = highlight.getAttribute("data-highlight-id");
					eraseHighlight(scrollerRef, highlightId);
				});
				prevRoomUsers.forEach((roomUser) => {
					updatehighlightLoadState(roomUser.id, false);
				});
			}
		}
	}, [renderContent, user, bookChanged]);

	useEffect(() => {
		const leftUsers = prevRoomUsers.filter((prevUser) => !roomUsers.some((user) => user.id === prevUser.id));
		const joinedUsers = roomUsers.filter((user) => !prevRoomUsers.some((prevUser) => prevUser.id === user.id));
		setPrevRoomUsers(roomUsers);
		if (!user) return;
		joinedUsers?.forEach((roomUser) => {
			if (roomUser.id !== user.id) {
				// loadAllPageHighlight(roomUser.id, bookId, "pink");
			}
		});
		leftUsers?.forEach((roomUser) => {
			scrollerRef.querySelectorAll(`mark[data-user-id="${roomUser.id}"]`).forEach((highlight) => {
				const highlightId = highlight.getAttribute("data-highlight-id");
				eraseHighlight(scrollerRef, highlightId);
			});
			console.log("updatehighlightLoadState", roomUser.id, false);
			updatehighlightLoadState(roomUser.id, false);
		});
	}, [roomUsers, bookChanged]);

	useEffect(() => {
		const drawHighlightHandler = (data) => {
			console.log("drawHighlightInfo", data);
			getPageLoadState(bookId, parseInt(data.pageNum)).then((pageLoadState) => {
				console.log("pageLoadState", pageLoadState);
				if (pageLoadState == "loaded") {
					const newRange = InfoToRange(data);
					const drawHighlightInfo = {
						...data,
						color: "pink",
					};
					drawHighlight(newRange, drawHighlightInfo, scrollerRef, recoilProps);
				}
			});
		};
		socket.on("draw-highlight", drawHighlightHandler);
		return () => {
			socket.off("draw-highlight", drawHighlightHandler);
		};
	}, [user, scrollerRef]);

	useEffect(() => {
		socket.on("erase-highlight", (data) => {
			console.log("erase-highlight", data);
			eraseHighlight(scrollerRef, data.id);
		});
		return () => {
			socket.off("erase-highlight");
		};
	}, [user, scrollerRef]);

	/* Server */
	const loadHighlightList = (userId, bookId) => {
		api
			.get(`/highlights/user/${userId}/book/${bookId}`)
			.then((response) => {
				logger.log("highlight", response.data);
				setHighlightList(response.data);
			})
			.catch((err) => {
				logger.log(err);
			});
	};

	const sendHighlightToServer = async (highlightInfo) => {
		console.log("user", user, highlightInfo);
		if (!user) {
			return null; // 세미콜론은 여기서 선택적이지만, 명확성을 위해 사용할 수 있습니다.
		}
		return api
			.post(`/highlights/user/${user.id}`, highlightInfo)
			.then((response) => {
				logger.log(response);
				// 유저가 칠한 하이라이트에 아이디가 생성되는 부분 (서버에서 받아옴)
				const highlightId = response.data.data[0].HighlightId;
				setHighlightId(highlightId);
				return highlightId;
			})
			.catch((err) => {
				logger.log(err);
				return null; // 에러 처리 후, 명시적으로 null 반환
			}); // Promise 체인이 끝나는 곳에 세미콜론 사용
	};

	/* Highlight List Item */

	const appendHighlightListItem = (highlightInfo) => {
		console.log("append");
		setHighlightList((prevHighlights) => {
			console.log(prevHighlights);
			const newHighlightInfos = [...prevHighlights, highlightInfo].sort((a, b) => a.num - b.num);
			console.log(newHighlightInfos);
			return newHighlightInfos;
		});
	};

	const deleteHighlightListItem = (highlightInfo) => {
		setHighlightList(highlightList.filter((h) => h.id !== highlightInfo.id));

		api
			.delete(`/highlights/${highlightInfo.id}`)
			.then((response) => {
				logger.log(response);
			})
			.catch((err) => {
				logger.log(err);
			});

		eraseHighlight(scrollerRef, highlightInfo.id);
		socket.emit("delete-highlight", { roomId: roomId, ...highlightInfo });
	};

	return (
		<>
			<HighlightList highlights={highlightList} deleteHandler={deleteHighlightListItem} />
			{/* 조건부 랜더링 : optionsModalOpen이 true되면 OptionsModal이 화면에 랜더링됨. */}
			{optionsModalOpen && (
				<OptionsModal
					isOpen={optionsModalOpen}
					onClose={() => setOptionsModalOpen(false)}
					user={user}
					highlightId={highlightId}
					setHighlightId={setHighlightId}
					bookId={bookId}
					roomId={roomId}
					color={color}
					drawHighlight={drawHighlight}
					appendHighlightListItem={appendHighlightListItem}
					sendHighlightToServer={sendHighlightToServer}
					selectedHighlightInfo={highlightInfos} // selectedHighlightInfo를 OptionsModal에 전달
				/>
			)}
		</>
	);
}

export default Highlighter;
