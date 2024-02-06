import styled from "styled-components";

const Container = styled.div`
	margin: auto;
	border-radius: 20px;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const OutButton = styled.button`
	align-self: flex-end;
	cursor: pointer;
	background-color: white;
	color: black;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	text-align: center;
	margin-bottom: 10px;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
`;

const VideoContainer = styled.div`
	width: 100%;
	height: 150px;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

const VideoBox = styled.div`
	background-color: #4a90e2;
	width: 110px;
	height: 110px;
	border-radius: 50%;
	z-index: 999;
	bottom: -50px;
	right: 0;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	video {
		width: 149px;
		height: 149px;
		cursor: pointer;
	}
`;

const StartButton = styled.button`
	align-self: flex-end;
	cursor: pointer;
	background-color: tomato;
	color: white;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	text-align: center;
	margin-bottom: 10px;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
`;

export { Container, OutButton, VideoContainer, VideoBox, StartButton };
