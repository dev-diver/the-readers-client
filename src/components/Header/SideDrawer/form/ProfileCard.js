import React from "react";
import { LogOutButton } from "components/Buttons/SignControllButton";
import { useToggleDrawer } from "recoil/handler";
import { Typography, Avatar, Grid, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const ProfileCard = ({ user }) => {
	const toggleDrawer = useToggleDrawer();

	return (
		user && (
			<>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant="h5" component="h2" gutterBottom>
					{user.nick}
				</Typography>
				<Box
					sx={{
						my: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Grid container>
						<Grid item xs>
							<Typography variant="body2" color="textSecondary" style={{ textAlign: "center", display: "block" }}>
								{user.followingCount} <br /> 팔로잉
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body2" color="textSecondary" style={{ textAlign: "center", display: "block" }}>
								{user.followerCount} <br /> 팔로워
							</Typography>
						</Grid>
					</Grid>
				</Box>
				<LogOutButton onClose={toggleDrawer("none")} />
			</>
		)
	);
};

export default ProfileCard;
