import React, { useState } from "react";
import { Container, Avatar, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { baseURL } from "config/config";

const CustomAvatar = styled(Avatar)(({ theme, selected }) => ({
	width: theme.spacing(8),
	height: theme.spacing(8),
	border: selected ? `3px solid ${theme.palette.success.main}` : "none",
}));

const ProfileSelector = ({ selectedProfile, setSelectedProfile }) => {
	const profiles = new Array(12).fill(0).map((e, i) => {
		return { id: i, name: `Profile ${i}`, image: `${baseURL}/src/profiles/profile${i}.webp` };
	});

	return (
		<Container sx={{ my: 1 }}>
			<Typography align="center" component="span" variant="h6" sx={{ my: 1 }}>
				프로필 선택
			</Typography>
			<Grid container spacing={1} justifyContent="center">
				{profiles.map((profile) => (
					<Grid item key={profile.id}>
						<CustomAvatar
							src={profile.image}
							alt={profile.name}
							onClick={() => setSelectedProfile(profile)}
							selected={selectedProfile?.id === profile.id}
							onDragStart={(e) => e.preventDefault()}
						/>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default ProfileSelector;
