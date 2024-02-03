import React, { useState, useEffect } from "react";
import api from "api";
import { baseURL } from "config/config";
import { Button, Avatar, Typography, Box, TextField, Grid, Link } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useToggleDrawer } from "recoil/handler";

const SignUpForm = () => {
	const [nick, setNick] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userInfo, setUserInfo] = useState(null);
	const toggleDrawer = useToggleDrawer();

	useEffect(() => {
		const errorParam = new URL(window.location.href).searchParams.get("error");
		if (errorParam) {
			alert("이미 존재하는 이메일입니다.");
		}
	}, [userInfo]);

	const handleSubmit = (e) => {
		e.preventDefault();

		// Make API request to register user
		api
			.post(`${baseURL}/auth/signup`, { nick: nick, email: email, password: password })
			.then((response) => {
				// Handle successful registration
				console.log(response.data);
			})
			.catch((error) => {
				// Handle error
				console.error(error);
			});
	};

	return (
		<>
			<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
				회원가입
			</Typography>
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
					onChange={(e) => setNick(e.target.value)}
					value={nick}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="이메일 주소"
					name="email"
					autoComplete="email"
					onChange={(e) => setEmail(e.target.value)}
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
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
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
