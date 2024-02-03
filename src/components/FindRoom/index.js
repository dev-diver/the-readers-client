import React, { useState } from "react";
import api from "api";
import RoomCard from "./RoomCard";
import { Grid, Box, TextField, Button } from "@mui/material";

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
		<Box component="form" id="searchForm" onSubmit={(e) => handleSearch(e)} sx={{ mt: 1 }}>
			<Grid container>
				<Grid item xs>
					<TextField
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
					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
						검색
					</Button>
				</Grid>
			</Grid>

			<Box>
				{searchResults.map((room, index) => (
					<RoomCard key={index} room={room} />
				))}
			</Box>
		</Box>
	);
}

export default FindRoom;
