import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link, useParams, useNavigate } from "react-router-dom";
import BookShelf from "components/BookShelf";
import AddBook from "components/Addbook";
import { BookOpen, LampDeskIcon, LibrarySquare } from "lucide-react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useRecoilState } from "recoil";
import { roomState, isTrailState } from "recoil/atom";
import { Logout } from "@mui/icons-material";

export default function Info() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [room, setRoom] = useRecoilState(roomState);
	const [roomRefresh, setRoomRefresh] = useRecoilState(roomState);
	const [trail, setTrail] = useRecoilState(isTrailState);
	const [isHovered, setIsHovered] = React.useState(false);
	const { roomId, bookId } = useParams();
	const theme = useTheme();
	const navigate = useNavigate();

	const open = Boolean(anchorEl);

	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	const handleOtherItemClick = (event) => {
		event.stopPropagation(); // 이벤트 전파 방지. 메뉴 계속 켜져있게 하기 위함임.
	};

	const bookClickHandler = (book) => {
		//for animation
		setTrail(false);
		navigate(`/room/${roomId}/book/${book.id}`);
	};

	return (
		<Box sx={{ marginTop: "48px" }}>
			<Box onClick={handleOtherItemClick} sx={{ cursor: "auto" }}>
				{room && <BookShelf books={room?.Books || []} bookId={bookId} bookClickhandler={bookClickHandler} />}
			</Box>
			<Link
				to={`/room/${room?.id}`}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontWeight: "bold",
					position: "absolute",
					bottom: "10px",
					textDecoration: "none",
					color: "#a86e16",
					cursor: "pointer",
					margin: "3px",
					marginLeft: "10px",
					marginBottom: "72px",
					backgroundColor: isHovered ? "#d0a970" : "#e1c69e",
					borderRadius: "5px",
					width: "35px",
					height: "45px",
					transition: "background-color 0.1s ease-in-out",
					boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
				}}
				onMouseEnter={() => setIsHovered(true)} // 마우스가 요소에 진입할 때
				onMouseLeave={() => setIsHovered(false)} // 마우스가 요소를 벗어날 때
			>
				<Logout style={{ color: "#a86e16" }} />
			</Link>
			{/* <Box
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
	
				</MenuItem>


				<Divider />
				<MenuItem onClick={handleOtherItemClick}>
					{room && (
						<>
							<AddBook key="book" room={room} refresher={setRoomRefresh} />
						</>
					)}
				</MenuItem>
			</Box> */}
		</Box>
	);
}
