import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "pages/Main";
import RoomRouter from "RoomRouter";
import Intro from "pages/Intro";
import Header from "components/Header";
import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
import IconButton from "@mui/material/IconButton";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
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
				typography: {
					allVariants: {
						fontSize: 10,
					},
				},
				components: {
					// Menu에 대한 스타일 오버라이드
					MuiMenu: {
						styleOverrides: {
							// Menu의 기본 커서 스타일을 auto로 설정
							list: {
								cursor: "auto",
							},
						},
					},
					// MenuItem에 대한 스타일 오버라이드 (선택적)
					MuiMenuItem: {
						styleOverrides: {
							root: {
								// MenuItem 내부의 커서 스타일을 auto로 설정
								cursor: "auto",
							},
						},
					},
				},
			}),
		[mode]
	);

	// const theme = useMemo(() => {
	// 	const simpleTheme = createTheme({
	// 		palette: {
	// 			mode,
	// 		},
	// 	});

	// 	simpleTheme.vars = {
	// 		radius: {
	// 			sm: "4px",
	// 			md: "8px",
	// 			lg: "12px",
	// 		},
	// 	};
	// 	return simpleTheme;
	// }, [mode]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<Box
					sx={{
						height: "100vh",
					}}
				>
					<Router>
						<div>
							<Header>
								{theme.palette.mode} mode
								<IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
									{theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
								</IconButton>
							</Header>
							<Routes>
								<Route path="/" element={<Main />} />
								<Route path="/room/:roomId/*" element={<RoomRouter />} />
								<Route path="/intro" element={<Intro />} />
							</Routes>
						</div>
					</Router>
				</Box>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
