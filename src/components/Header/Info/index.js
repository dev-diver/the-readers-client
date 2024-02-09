import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import BookShelf from "components/BookShelf";
import AddBook from "pages/RoomLobby/Addbook";
import { BookOpen, LampDeskIcon, LibrarySquare } from "lucide-react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Info 컴포넌트는 사용자가 Book에 들어가면 나타나는 메뉴를 담당함
// Room으로 이동하는 버튼 기능, 책 간 이동 기능, 책 추가 기능이 있음
// mui의 Menu는 항상 커서가 포인터로 설정되어 있어서, 커서를 auto로 설정하는 테마를 적용함
const theme = createTheme({
	components: {
		// Menu에 대한 스타일 오버라이드
		MuiMenu: {
			styleOverrides: {
				// Menu의 기본 커서 스타일을 auto로 설정
				list: {
					cursor: "auto",
				},
			},
		},
		// MenuItem에 대한 스타일 오버라이드 (선택적)
		MuiMenuItem: {
			styleOverrides: {
				root: {
					// MenuItem 내부의 커서 스타일을 auto로 설정
					cursor: "auto",
				},
			},
		},
	},
});

export default function Info({ room, bookId, bookClickHandler, setRoomRefresh }) {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOtherItemClick = (event) => {
		event.stopPropagation(); // 이벤트 전파 방지. 메뉴 계속 켜져있게 하기 위함임.
	};

	return (
		<React.Fragment>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				<Tooltip title="Account settings">
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
					>
						<Avatar sx={{ width: 32, height: 32, margin: 1 }}>i</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<ThemeProvider theme={theme}>
				<Menu
					anchorEl={anchorEl}
					id="account-menu"
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				>
					<MenuItem onClick={handleClose} style={{ cursor: "auto" }}>
						<ListItemIcon>
							<LibrarySquare />
						</ListItemIcon>
						<Link to={`/room/${room.id}`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
							방으로 이동 &#40;현재 방: {room && <>{room.title}</>}&#41;
						</Link>
					</MenuItem>

					<MenuItem onClick={handleOtherItemClick} style={{ cursor: "auto" }}>
						<ListItemIcon>
							<BookOpen />
						</ListItemIcon>
						책 목록 &nbsp;
						{room && (
							<>
								<BookShelf books={room.Books} bookId={bookId} bookClickhandler={bookClickHandler} />
							</>
						)}
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleOtherItemClick}>
						{room && (
							<>
								<AddBook key="book" room={room} refresher={setRoomRefresh} />
							</>
						)}
					</MenuItem>
				</Menu>
			</ThemeProvider>
		</React.Fragment>
	);
}
