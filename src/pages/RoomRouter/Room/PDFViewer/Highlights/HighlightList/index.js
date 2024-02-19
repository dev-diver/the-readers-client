import React, { useRef, useEffect, useState } from "react";
import HighlightListItem from "./HighlightListItem";
import { Box, Collapse, ThemeProvider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useRecoilState } from "recoil";
import { isAppBarPinnedState } from "recoil/atom";

export default function HighlightList({ highlights, deleteHandler }) {
	const listContainer = useRef(null);
	const [items, setItems] = useState([]);
	const [showItems, setShowItems] = useState(true);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [ChevronIcon, setChevronIcon] = useState(isMobile ? ChevronLeft : ChevronDown);
	const [isAppBarPinned, setIsAppBarPinned] = useRecoilState(isAppBarPinnedState);

	useEffect(() => {
		if (isMobile) {
			if (drawerOpen) {
				setShowItems(true);
				setChevronIcon(ChevronRight);
			} else {
				setShowItems(false);
				setChevronIcon(ChevronLeft);
			}
		} else {
			setShowItems(true);
			setChevronIcon(ChevronDown);
		}
	}, [isMobile, drawerOpen]);

	// Drawer 토글 함수
	const toggleDrawer = () => {
		if (isMobile) {
			setDrawerOpen(!drawerOpen);
			setChevronIcon(drawerOpen ? ChevronRight : ChevronLeft);
			console.log("drawerOpen", drawerOpen);
		} else {
			toggleItemsDisplay();
		}
	};

	// "Highlights" 클릭 시 showItems 상태를 토글하는 함수
	const toggleItemsDisplay = () => {
		setShowItems(!showItems);
		setChevronIcon(showItems ? ChevronDown : ChevronUp);
	};

	useEffect(() => {
		const newHighlights =
			highlights?.map((hl, i) => <HighlightListItem key={i} hlInfo={hl} deleteHandler={() => deleteHandler(hl)} />) ||
			[];
		console.log("new highlights", newHighlights);
		setItems(newHighlights);
	}, [highlights]);

	useEffect(() => {
		// Drawer가 열릴 때 document에 클릭 이벤트 리스너 추가
		if (drawerOpen) {
			document.addEventListener("click", handleOutsideClick);
		} else {
			document.removeEventListener("click", handleOutsideClick);
		}

		// 컴포넌트가 언마운트될 때 document에서 클릭 이벤트 리스너 제거
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [drawerOpen]);

	// Drawer 바깥쪽을 클릭했을 때 Drawer를 닫는 함수
	const handleOutsideClick = (event) => {
		if (listContainer.current && !listContainer.current.contains(event.target)) {
			setDrawerOpen(false);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Box
				id="highlights-list"
				ref={listContainer}
				sx={{
					maxWidth: "100%",
					height: "100%",
					overflow: "auto",
					backgroundColor: "#e1c69e",
					padding: "10px",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
					borderRadius: "3px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					position: "absolute",
					top: "0px",
					right: "0px",
					width: drawerOpen || !isMobile ? "300px" : "50px", // 모바일에서 Drawer가 열릴 때 너비 조정
					transition: "width 0.3s ease-in-out", // 너비 변화에 애니메이션 적용
				}}
			>
				<Typography variant="h6" component="h6">
					하이라이트
				</Typography>

				{isMobile && <ChevronIcon sx={{ top: "10px", right: "10px", cursor: "pointer" }} onClick={toggleDrawer} />}
				<Collapse in={showItems || drawerOpen}> {items} </Collapse>
			</Box>
		</ThemeProvider>
	);
}
