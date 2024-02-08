import React from "react";
import { Box, IconButton } from "@mui/material";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FindRoom from "components/FindRoom";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";

const bookCovers = new Array(5).fill(null).map((_, i) => {
	return { id: i, image: `${baseURL}/src/bookcovers/${i + 1}.jpg` };
});
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function Main() {
	return (
		<Box>
			<BookCarousel initialItems={bookCovers} initialActive={0} />
			<FindRoom />
		</Box>
	);
}

export default Main;
