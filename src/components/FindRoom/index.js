import React, { useState } from "react";
import api from "api";
import RoomCard from "./RoomCard";
import MakeRoom from "pages/Main/MakeRoom";
import { Grid, Box, TextField, Button } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

function FindRoom() {
	const [name, setName] = useState("");
	const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

	const handleSearch = (e) => {
		e.preventDefault();
		api
			.get("/rooms", {
				params: { name: name },
			})
			.then((response) => {
				setSearchResults(response.data.data); // 검색 결과를 상태에 저장
				console.log("검색 결과:", response.data.data);
			})
			.catch((error) => {
				console.error(error.response.data.message);
			});
	};

	return (
		<Box sx={{ width: 450 }} component="form" id="searchForm" onSubmit={(e) => handleSearch(e)}>
			<Grid container>
				<Grid item>
					<MakeRoom />
				</Grid>
				<Grid item xs>
					<TextField
						size="small"
						margin="normal"
						required
						fullWidth
						id="search_name_field"
						label="방/책 이름 검색"
						name="name"
						autoComplete="name"
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<Button type="submit" fullWidth variant="contained" sx={{ my: 2, mx: 1 }}>
						검색
					</Button>
				</Grid>
			</Grid>

			{/* <Box>
				{searchResults.map((room, index) => (
					<RoomCard key={index} room={room} />
				))}
			</Box> */}
			<Masonry columns={4} spacing={2}>
				{searchResults.map((room, index) => (
					<RoomCard key={index} room={room} />
				))}
			</Masonry>
		</Box>
	);
}

export default FindRoom;
