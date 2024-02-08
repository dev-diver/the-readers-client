import React from "react";

import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
import IconButton from "@mui/material/IconButton";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// 책 커버 이미지 정보를 담고 있는 객체의 배열인 bookCovers를 생성
// map 함수를 사용하여 5개의 책 커버 이미지 정보를 담고 있는 객체를 생성하고, 배열에 저장함
const bookCovers = new Array(5).fill(null).map((_, i) => {
	return { id: i, image: `${baseURL}/src/bookcovers/${i + 1}.jpg` };
});

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function MyApp() {
	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);
	return (
		<Box
			sx={{
				display: "flex",
				width: "100%",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "background.default",
				color: "text.primary",
				borderRadius: 1,
				p: 3,
			}}
		>
			{theme.palette.mode} mode
			<IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
				{theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
			</IconButton>
		</Box>
	);
}

function ToggleColorMode() {
	const [mode, setMode] = React.useState("light");
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[]
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<MyApp />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

function Main() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<ToggleColorMode />
			<BookCarousel initialItems={bookCovers} initialActive={0} />
			<FindRoom />
		</Box>
	);
}

export default Main;
