import React, { useState, useEffect } from "react";
import { LogOutButton } from "components/Buttons/SignControllButton";
import { useToggleDrawer } from "recoil/handler";
import { Typography, Avatar, Grid, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import api from "api";
const mockupData = [
	{
		id: 1,
		title: "정글스터디",
		usermx: 5,
	},
	{
		id: 2,
		title: "나 홀로 공부",
		usermx: 5,
	},
];

const ProfileCard = ({ user }) => {
	const [searchResults, setSearchResults] = useState([]);
	const toggleDrawer = useToggleDrawer();

	const getUserRooms = (user) => {
		api
			.get(`/user/${user.id}/rooms`)
			.then((response) => {
				//setSearchResults(response.data.data); // 검색 결과를 상태에 저장
				setSearchResults(mockupData); // 검색 결과를 상태에 저장
				console.log("검색 결과:", response.data.data);
			})
			.catch((error) => {
				console.error(error.response.data.message);
			});
	};

	useEffect(() => {
		if (user) {
			getUserRooms(user);
		}
	}, [user]);

	return (
		user && (
			<>
				<Avatar alt={user.nick} src={user.profileImg} sx={{ width: 150, height: 150 }} />
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
					<Grid container spacing={2}>
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

				<Box>
					<Divider component="div">
						<Typography align="center" variant="h6" component="h2" gutterBottom sx={{ my: 0 }}>
							내 스터디룸
						</Typography>
					</Divider>
					<List sx={{ width: 300 }}>
						{searchResults.map((room, index) => (
							<>
								<ListItem component={Link} to={`/room/${room.id}`} key={index}>
									<ListItemText primary={room.title} />
								</ListItem>
								<Divider component="li" />
							</>
						))}
					</List>
				</Box>
				<LogOutButton onClose={toggleDrawer("none")} />
			</>
		)
	);
};

export default ProfileCard;
