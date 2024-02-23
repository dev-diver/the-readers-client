import React, { useState, useEffect } from "react";
import api from "api";
import { baseURL } from "config/config";
import { Button, Typography, Box, TextField, Grid, Link } from "@mui/material";
import { useToggleDrawer } from "recoil/handler";
import ProfileSelector from "./ProfileSelector";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";
import { coloringUser } from "components/Chart/utils";

const SignUpForm = () => {
	const [user, setUser] = useRecoilState(userState);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [nick, setNick] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const toggleDrawer = useToggleDrawer();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!selectedProfile) {
			setErrorMessage("프로필을 선택해주세요.");
			return;
		}
		// Make API request to register user
		api
			.post(`${baseURL}/auth/signup`, {
				nick: nick,
				email: email,
				password: password,
				profileImg: selectedProfile.image,
			})
			.then((response) => {
				// Handle successful registration
				console.log(response.data);
				toggleDrawer("none")(e);
				setErrorMessage("");
				//로그인
				// let user = response.data.data;
				// localStorage.setItem("user", JSON.stringify(user));
				// user = {
				// 	...user,
				// 	color: coloringUser(user.id),
				// };
				// setUser(user);
			})
			.catch((error) => {
				setErrorMessage(error.response.data.message);
				console.error(error);
			});
	};

	return (
		<>
			<Typography component="h1" variant="h5">
				회원가입
			</Typography>
			<ProfileSelector selectedProfile={selectedProfile} setSelectedProfile={setSelectedProfile} />
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
				<TextField
					margin="normal"
					required
					fullWidth
					id="nick"
					label="닉네임"
					name="nick"
					autoComplete="nick"
					autoFocus
					onChange={(e) => {
						setErrorMessage("");
						setNick(e.target.value);
					}}
					value={nick}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="이메일 주소"
					name="email"
					type="email"
					autoComplete="email"
					onChange={(e) => {
						setErrorMessage("");
						setEmail(e.target.value);
					}}
					value={email}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="패스워드"
					type="password"
					id="password"
					autoComplete="current-password"
					onChange={(e) => {
						setErrorMessage("");
						setPassword(e.target.value);
					}}
					value={password}
				/>
				<Typography variant="body2" color="error" align="center">
					{errorMessage}
				</Typography>
				<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
					회원가입
				</Button>
				{/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}

				<Grid container>
					<Grid item xs></Grid>
					<Grid item>
						<Link onClick={toggleDrawer("signin")} variant="body2">
							로그인하기
						</Link>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default SignUpForm;
