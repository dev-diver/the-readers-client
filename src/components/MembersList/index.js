import React, { useRef } from "react";
import socket from "socket.js";
import { Box, Avatar, Menu, MenuItem, Typography, Tooltip, IconButton, Divider, ListItemIcon } from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { roomUserState, roomUsersState } from "recoil/atom";

const MemberList = () => {
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);

	const memberListRef = useRef(null);

	const openSideBar = () => {
		memberListRef.current.style.right = 0;
	};
	const closeSideBar = () => {
		memberListRef.current.style.right = -100 + "%";
	};

	// const [anchorEl, setAnchorEl] = React.useState(null);
	// const open = Boolean(anchorEl);
	// const handleClick = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };
	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	return (
		// <React.Fragment>
		// 	<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
		// 		<Typography sx={{ minWidth: 100 }}>Contact</Typography>
		// 		<Typography sx={{ minWidth: 100 }}>Profile</Typography>
		// 		<Tooltip title="Account settings">
		// 			<IconButton
		// 				onClick={handleClick}
		// 				size="small"
		// 				sx={{ ml: 2 }}
		// 				aria-controls={open ? "account-menu" : undefined}
		// 				aria-haspopup="true"
		// 				aria-expanded={open ? "true" : undefined}
		// 			>
		// 				<Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
		// 			</IconButton>
		// 		</Tooltip>
		// 	</Box>
		// 	<Menu
		// 		anchorEl={anchorEl}
		// 		id="account-menu"
		// 		open={open}
		// 		onClose={handleClose}
		// 		onClick={handleClose}
		// 		PaperProps={{
		// 			elevation: 0,
		// 			sx: {
		// 				overflow: "visible",
		// 				filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
		// 				mt: 1.5,
		// 				"& .MuiAvatar-root": {
		// 					width: 32,
		// 					height: 32,
		// 					ml: -0.5,
		// 					mr: 1,
		// 				},
		// 				"&::before": {
		// 					content: '""',
		// 					display: "block",
		// 					position: "absolute",
		// 					top: 0,
		// 					right: 14,
		// 					width: 10,
		// 					height: 10,
		// 					bgcolor: "background.paper",
		// 					transform: "translateY(-50%) rotate(45deg)",
		// 					zIndex: 0,
		// 				},
		// 			},
		// 		}}
		// 		transformOrigin={{ horizontal: "right", vertical: "top" }}
		// 		anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
		// 	>
		// 		<MenuItem onClick={handleClose}>
		// 			<Avatar /> Profile
		// 		</MenuItem>
		// 		<MenuItem onClick={handleClose}>
		// 			<Avatar /> My account
		// 		</MenuItem>
		// 		<Divider />
		// 		<MenuItem onClick={handleClose}>
		// 			<ListItemIcon>
		// 				<PersonAdd fontSize="small" />
		// 			</ListItemIcon>
		// 			Add another account
		// 		</MenuItem>
		// 		<MenuItem onClick={handleClose}>
		// 			<ListItemIcon>
		// 				<Settings fontSize="small" />
		// 			</ListItemIcon>
		// 			Settings
		// 		</MenuItem>
		// 		<MenuItem onClick={handleClose}>
		// 			<ListItemIcon>
		// 				<Logout fontSize="small" />
		// 			</ListItemIcon>
		// 			Logout
		// 		</MenuItem>
		// 	</Menu>
		// </React.Fragment>
		<>
			<button
				className="btn btn-dark btn-sm"
				onClick={openSideBar}
				style={{ position: "absolute", top: "10%", right: "5%" }}
			>
				Users
			</button>
			<div
				className="position-fixed pt-2 h-100 bg-dark"
				ref={memberListRef}
				style={{
					width: "150px",
					right: "-100%",
					transition: "0.3s linear",
					zIndex: "9999",
				}}
			>
				<button className="btn btn-block border-0 form-control rounded-0 btn-light" onClick={closeSideBar}>
					Close
				</button>
				<div className="w-100 mt-5">
					{roomUsers.map((roomUsr, index) => (
						<p key={index} className="text-white text-center py-2">
							{roomUsr.id}
							{roomUsr.id === roomUser.id && " - (You)"}
						</p>
					))}
				</div>
			</div>
		</>
	);
};

export default MemberList;
