import React, { useEffect, useState } from "react";

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import HomeIcon from "./HomeIcon";
import SideDrawer from "./SideDrawer";
import Info from "./Info";
import { Link } from "react-router-dom";
import { isMainState } from "recoil/atom";
import { useRecoilState } from "recoil";

export default function Header({ children }) {
	const [isHovering, setIsHovering] = useState(false);
	const [isMain, setIsMain] = useRecoilState(isMainState);

	const appTitle = "The Readers";
	const pages = [];

	useEffect(() => {
		if (isMain) {
			setIsHovering(true);
		} else {
			setIsHovering(false);
		}
	}, [isMain]);

	return (
		<div
			onMouseOver={() => {
				if (!isMain) setIsHovering(true);
			}}
			onMouseLeave={() => {
				if (!isMain) setIsHovering(false);
			}}
			style={{ height: "25px", position: "absolute", top: 0, width: "100%" }}
		>
			<AppBar
				position="absolute"
				style={{
					top: isHovering ? "0" : "-64px",
					transition: "top 0.5s",
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
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
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
						<SideDrawer />
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	);
}
