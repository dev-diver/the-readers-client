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
	bookState,
	highlightLoadStateFamily,
} from "recoil/atom";
import { useToggleDrawer } from "recoil/handler";
import socket from "socket.js";
import "./styles.css";

import HighlightList from "./HighlightList";
import OptionsModal from "components/OptionsModal";
import { useGetPageLoadState } from "../PdfScroller/util";

function Highlighter({ renderContent }) {
	const { bookId, roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [prevRoomUsers, setPrevRoomUsers] = useState([]);
	const toggleDrawer = useToggleDrawer();

	// 진태 추가 코드
	const [optionsModalOpen, setOptionsModalOpen] = useState(false);
	const [highlightId, setHighlightId] = useState(null);
	const [highlightInfos, setHighlightInfos] = useState(null);
	const [book, setBook] = useRecoilState(bookState);
	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);
	const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);

	const recoilProps = {
		setButtonGroupsPos,
		setCurrentHighlightId,
	};

	const getPageLoadState = useGetPageLoadState();

	const updatehighlightLoadState = useRecoilCallback(
		({ set }) =>
			(book, userId, flag) => {
				console.warn("userId", userId, "totalPages", book?.totalPage || 0, "updatehighlightLoadState", flag);
				for (let pageNum = 1; pageNum <= book?.totalPage || 0; pageNum++) {
					set(highlightLoadStateFamily({ bookId: book.id, pageNum: pageNum, userId: userId }), flag);
				}
			},
		[]
	);

	useEffect(() => {
		scrollerRef?.addEventListener("mouseup", selectionToHighlight);
		return () => {
			scrollerRef?.removeEventListener("mouseup", selectionToHighlight);
		};
	}, [scrollerRef, user, penMode, book]);

	useEffect(() => {
		if (!book) return;
		console.warn("bookID", book.id, roomUsers);
		setHighlightList([]);
		roomUsers.forEach((roomUser) => {
			updatehighlightLoadState(book, roomUser.id, false);
		});
	}, [book]);

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
			const additionalInfo = { bookId: book.id, text: selectedRange.toString() };
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
				loadHighlightList(user.id, book.id); //true
			} else {
				console.log("로그아웃, 하이라이트 지움");
				setHighlightList([]);
				scrollerRef.querySelectorAll("mark").forEach((highlight) => {
					const highlightId = highlight.getAttribute("data-highlight-id");
					eraseHighlight(scrollerRef, highlightId);
				});
				prevRoomUsers.forEach((roomUser) => {
					updatehighlightLoadState(book, roomUser.id, false);
				});
			}
		}
	}, [renderContent, user]);

	useEffect(() => {
		if (!user || !book) return;
		const goneUsers = prevRoomUsers.filter((prevUser) => !roomUsers.some((user) => user.id === prevUser.id));
		// const joinedUsers = roomUsers.filter((user) => !prevRoomUsers.some((prevUser) => prevUser.id === user.id));
		setPrevRoomUsers(roomUsers);
		goneUsers?.forEach((roomUser) => {
			scrollerRef.querySelectorAll(`mark[data-user-id="${roomUser.id}"]`).forEach((highlight) => {
				const highlightId = highlight.getAttribute("data-highlight-id");
				eraseHighlight(scrollerRef, highlightId);
			});
			console.log("updatehighlightLoadState", roomUser.id, false);
			updatehighlightLoadState(book, roomUser.id, false);
		});
		return () => {
			roomUsers?.forEach((roomUser) => {
				console.log("book highlight State reset");
				updatehighlightLoadState(book, roomUser.id, false);
			});
		};
	}, [book, roomUsers]);

	useEffect(() => {
		if (!book || !scrollerRef) return;
		const drawHighlightHandler = (data) => {
			console.log("drawHighlightInfo", data);
			getPageLoadState(book?.id, parseInt(data.pageNum)).then((pageLoadState) => {
				console.log("pageLoadState", pageLoadState);
				if (pageLoadState == "loaded") {
					const newRange = InfoToRange(data);
					const drawHighlightInfo = {
						...data,
					};
					drawHighlight(newRange, drawHighlightInfo, scrollerRef, recoilProps);
				}
			});
		};
		socket.on("draw-highlight", drawHighlightHandler);
		return () => {
			socket.off("draw-highlight", drawHighlightHandler);
		};
	}, [book, scrollerRef]);

	useEffect(() => {
		if (!scrollerRef) return;
		socket.on("erase-highlight", (data) => {
			console.log("erase-highlight", data);
			eraseHighlight(scrollerRef, data.id);
		});
		return () => {
			socket.off("erase-highlight");
		};
	}, [scrollerRef]);

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
					color={user.color || "yellow"}
					appendHighlightListItem={appendHighlightListItem}
					selectedHighlightInfo={highlightInfos} // selectedHighlightInfo를 OptionsModal에 전달
				/>
			)}
		</>
	);
}

export default Highlighter;
