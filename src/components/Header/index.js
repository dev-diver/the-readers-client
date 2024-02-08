import React, { useState } from "react";

import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import HomeIcon from "./HomeIcon";
import SideDrawer from "./SideDrawer";
import { Link } from "react-router-dom";

export default function Header({ children }) {
	const appTitle = "The Readers";
	const pages = [];

	return (
		<div style={{ height: "25px", position: "absolute", top: 0, width: "100%" }}>
			<AppBar>
				<Container maxWidth="xl">
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

						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								color="inherit"
							>
								{/* <MenuIcon /> */}
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page}>
										<Typography textAlign="center">{page}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
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
						<SideDrawer />
						{children}
					</Toolbar>
				</Container>
			</AppBar>
		</div>
	);
}
