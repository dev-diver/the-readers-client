import React from "react";
import { Avatar, Badge, Card, CardContent, CardActions, Button, Typography, Link, TextField, Box } from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { deepOrange, green } from "@mui/material/colors";
import "./styles.css";

// const puff = keyframes`
// 0% {
//   top: 100%;
//   height: 0px;
//   padding: 0px;
// }
// 100% {
//   top: 50%;
//   height: 100%;
//   padding: 0px 100%;
// }
// `;

// const borderRadius = keyframes`
// 0% {
//   -webkit-border-radius: 50%;
// }
// 100% {
//   -webkit-border-radius: 0px;
// }
// `;

const StyledBody = styled("div")(({ theme }) => ({
	// 	overflow: "hidden",
	// 	background: '#bcdee7 url("../img/bg.jpg") no-repeat center center fixed',
	// 	backgroundSize: "cover",
	// 	position: "fixed",
	// 	padding: 0,
	// 	margin: 0,
	// 	width: "100%",
	// 	height: "100%",
	// 	font: 'normal 14px/1.618em "Roboto", sans-serif',
	// 	WebkitFontSmoothing: "antialiased",
	// 	"&::before": {
	// 		content: '""', // 가상 요소에는 content 속성이 필수입니다.
	// 		height: 0,
	// 		padding: 0,
	// 		border: "130em solid #313440",
	// 		position: "absolute",
	// 		left: "50%",
	// 		top: "100%",
	// 		zIndex: 1,
	// 		display: "block",
	// 		borderRadius: "50%",
	// 		transform: "translate(-50%, -50%)",
	// 		// Webkit 접두사가 붙은 속성들은 자동으로 처리됩니다. 별도로 추가할 필요가 없습니다.
	// 		// 애니메이션과 관련된 속성
	// 		animation: `${puff} 0.5s 1.8s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards, ${borderRadius} 0.2s 2.3s linear forwards`,
	// 	},
}));

const card = (
	<Box className="card" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<Card className="profile-card" sx={{ minWidth: 275, zIndex: 3 }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					&quot;유진&quot;님이 초대함:
				</Typography>
				<Typography variant="h5" component="div">
					정글
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					2명 온라인 | 멤버 8명
				</Typography>
				<Typography variant="body2">
					별명 <TextField id="outlined-basic" label="별명을 입력하세요." variant="outlined" />
					<br />
					다른 회원에게 표시되는 이름입니다.
				</Typography>
			</CardContent>
			<CardActions>
				<Button sx={{ width: 200 }} variant="contained" size="large">
					계속하기
				</Button>
				<Link href="#" underline="none">
					이미 계정이 있으신가요?
				</Link>
			</CardActions>
		</Card>
	</Box>
);

const avatar = (
	<Avatar sx={{ bgcolor: green[500], width: 56, height: 56, fontSize: "1.25rem" }} variant="rounded">
		정글
	</Avatar>
);

const invitee = "유진";

function ProfileCard() {
	return (
		<StyledBody className="profile-body">
			<Box className="profile-card">
				<header>
					{/* <!-- 방 정보로 이동하는 기능? --> */}
					<Link href="#" underline="none">
						{avatar}
					</Link>

					{/* <!-- 초대한 사람 --> */}
					<Typography sx={{ mb: 0, fontSize: 20 }} color="text.secondary" gutterBottom>
						&quot;{invitee}&quot;님이 초대함:
					</Typography>

					{/* <!-- 방 이름 --> */}
					<Typography sx={{ mb: 2 }} variant="h4" component="h2">
						정글
					</Typography>

					<Typography variant="p" component="h6">
						<Badge sx={{ mx: 1 }} color="success" variant="dot"></Badge>
						2명 온라인
						<Badge sx={{ mx: 1, ml: 2 }} color="secondary" variant="dot"></Badge>
						8명 멤버
					</Typography>
				</header>

				{/* <!-- bit of a bio; who are you? --> */}
				<div className="profile-bio">
					<Typography variant="body2">
						<TextField
							sx={{ width: "85%", mt: 3 }}
							id="outlined-basic"
							label="별명을 입력하세요."
							helperText="다른 회원에게 표시되는 이름입니다."
							variant="outlined"
						/>
					</Typography>
					<Button sx={{ width: "85%", mt: 3, fontSize: 20 }} variant="contained" size="medium">
						계속하기
					</Button>
					<Link sx={{ mt: 1, display: "block" }} href="#" underline="none">
						이미 링크가 있으신가요?
					</Link>
				</div>
			</Box>
		</StyledBody>
	);
}

export default ProfileCard;
