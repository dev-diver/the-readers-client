import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import HomeIcon from "./HomeIcon";
import SideDrawer from "./SideDrawer";
import { Link } from "react-router-dom";
import PushPinIcon from "@mui/icons-material/PushPin";
import { PushPinOutlined } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { isAppBarPinnedState } from "recoil/atom";

export default function Header({ children }) {
	const [isHovering, setIsHovering] = useState(false);
	const location = useLocation();
	const [isAppBarPinned, setIsAppBarPinned] = useRecoilState(isAppBarPinnedState);

	const appTitle = "The Readers";
	const pages = [];

	useEffect(() => {
		if (location.pathname === "/") {
			setIsHovering(true);
		} else {
			setIsHovering(false);
		}
	}, [location]);

	const handlePinToggle = () => {
		setIsAppBarPinned(!isAppBarPinned);
	};

	return (
		<div
			onMouseOver={() => {
				if (location.pathname !== "/") setIsHovering(true);
			}}
			onMouseLeave={() => {
				if (location.pathname !== "/") setIsHovering(false);
			}}
			style={{ height: "25px", position: "absolute", top: 0, width: "100%", zIndex: 100 }}
		>
			<AppBar
				position="absolute"
				style={{
					top: isHovering || isAppBarPinned ? "0" : "-64px",
					transition: "top 0.5s",
					maxWidth: "100%",
				}}
			>
				<Container maxWidth="false">
					<Toolbar disableGutters>
						<HomeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component={Link}
							to="/"
							sx={{
								ml: 2,
								mr: 2,
								display: { xs: "none", md: "flex" },
								letterSpacing: ".15rem",
								color: "#333",
								textDecoration: "none",
								fontWeight: 700,
							}}
						>
							{appTitle}
						</Typography>
						<HomeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
						<Typography
							variant="h5"
							noWrap
							component={Link}
							to="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							{appTitle}
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button key={page} sx={{ my: 2, color: "white", display: "block" }}>
									{page}
								</Button>
							))}
						</Box>
						{children}
						<IconButton onClick={handlePinToggle}>{isAppBarPinned ? <PushPinIcon /> : <PushPinOutlined />}</IconButton>

						<SideDrawer />
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	);
}
