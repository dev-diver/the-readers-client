import React, { useState } from "react";
import api from "api";
import { baseURL } from "config/config";
import { Button, Avatar, Typography, Box, TextField, FormControlLabel, Checkbox, Grid, Link } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useToggleDrawer } from "recoil/handler";
import { coloringUser } from "components/Chart/utils";

const LogInForm = ({ setUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isChecked, setIsChecked] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const toggleDrawer = useToggleDrawer();

	const handleSubmit = (e) => {
		e.preventDefault();

		api
			.post(`${baseURL}/auth/login`, { email: email, password: password })
			.then((response) => {
				let user = response.data.data;
				user = {
					...user,
					color: coloringUser(user.id),
				};
				if (isChecked) {
					localStorage.setItem("user", JSON.stringify(user));
				}
				setUser(user);
				toggleDrawer("none")(e);
				setErrorMessage("");
			})
			.catch(() => {
				setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
			});
	};

	return (
		<>
			<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
				로그인
			</Typography>
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="이메일 주소"
					name="email"
					autoComplete="email"
					autoFocus
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
					로그인
				</Button>
				<FormControlLabel
					control={
						<Checkbox
							value="remember"
							color="primary"
							checked={isChecked}
							onChange={(e) => setIsChecked(e.target.checked)}
						/>
					}
					label="로그인 유지"
				/>
				<Grid container>
					<Grid item xs></Grid>
					<Grid item>
						<Link onClick={toggleDrawer("signup")} variant="body2">
							가입하기
						</Link>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default LogInForm;
