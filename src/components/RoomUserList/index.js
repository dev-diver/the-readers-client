import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { User } from "lucide-react";

import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import { useRecoilState } from "recoil";
import { roomUserState, roomUsersState } from "recoil/atom";
import { Box, Popper } from "@mui/material";

export default function RoomUserList() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	const [anchorPop, setAnchorPop] = React.useState(null);
	const [openPop, setOpenPop] = React.useState(false);

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickPop = (event) => {
		setAnchorPop(anchorPop ? null : event.currentTarget);
		setOpenPop((prev) => !prev);
	};

	return (
		<div>
			<Button
				id="fade-button"
				aria-controls={open ? "fade-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				sx={{
					backgroundColor: "#ddd", // 배경색 설정
					borderRadius: "50%", // 동그랗게 만들기
					minWidth: 0, // 최소 너비 설정을 제거하여 패딩에 의해 결정되도록 함
					width: 48, // 버튼의 너비 설정
					height: 48, // 버튼의 높이 설정, 너비와 동일하게 하여 원 형태 유지
					padding: "10px", // 아이콘과 버튼 가장자리 사이의 패딩 조정
				}}
			>
				<User sx={{ width: "50px", height: "50px", borderRadius: "50%" }} />
			</Button>
			<Menu
				id="fade-menu"
				MenuListProps={{
					"aria-labelledby": "fade-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				TransitionComponent={Fade}
				anchorOrigin={{
					vertical: "top", // 메뉴가 버튼의 상단에 연결되도록 설정
					horizontal: "center", // 메뉴를 버튼의 가운데에 가로로 정렬
				}}
				transformOrigin={{
					vertical: "top", // 메뉴가 상단으로 변형되는 기준점을 하단으로 설정
					horizontal: "center", // 메뉴를 버튼의 가운데에 가로로 정렬
				}}
				slotProps={{
					paper: {
						sx: {
							width: "70px", // 메뉴의 너비 설정
							borderRadius: "50px",
						},
					},
				}}
			>
				{roomUsers?.map((Member, index) => (
					<MenuItem key={index} onClick={handleClose}>
						<BadgeAvatars nick={Member.nick} profileImg={Member.profileImg} />
						{Member.id === roomUser.user.id && (
							<Badge
								color="success"
								badgeContent="나"
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								sx={{
									".MuiBadge-badge": {
										right: 43, // 뱃지의 오른쪽 위치 조정
										top: 0, // 뱃지의 상단 위치 조정
										border: `2px solid white`, // 뱃지 주변에 흰색 테두리 추가
										padding: "3px 3px", // 뱃지 내부 패딩 조정
									},
								}}
							></Badge>
						)}
					</MenuItem>
				)) || []}
			</Menu>
		</div>
	);
}

function BadgeAvatars({ nick, profileImg }) {
	const StyledBadge = styled(Badge)(({ theme }) => ({
		"& .MuiBadge-badge": {
			backgroundColor: "#44b700",
			color: "#44b700",
			boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
			"&::after": {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				borderRadius: "50%",
				animation: "ripple 1.2s infinite ease-in-out",
				border: "1px solid currentColor",
				content: '""',
			},
		},
		"@keyframes ripple": {
			"0%": {
				transform: "scale(.8)",
				opacity: 1,
			},
			"100%": {
				transform: "scale(2.4)",
				opacity: 0,
			},
		},
	}));

	return (
		<Stack direction="row" spacing={2}>
			<StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
				<Avatar alt={`${nick}`} src={`${profileImg}`} />
			</StyledBadge>
		</Stack>
	);
}
