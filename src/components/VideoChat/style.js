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

const Session = styled.div`
	margin: auto;
	border-radius: 20px;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100px;
`;

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const VideoContainer = styled.div`
	padding: 5px;	
	boxShadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08),
	borderRadius: 8px,
	backgroundColor: #f7f7f7,
	border: 1px solid #ddd,
	zIndex: 100,	
	width: 100px,
`;

const VideoBox = styled.div`
	background-color: #4a90e2;
	width: 110px;
	height: 110px;
	border-radius: 50%;
	z-index: 999;
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

const NameTag = styled.div`
	width: 100%;
	color: black;
	border-radius: 20px;
	font-size: 20px;
	width: 80px;
	text-align: center;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
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

const StartButton = styled.button`
	align-self: flex-end;
	cursor: pointer;
	background-color: #f56c62;
	color: black;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	text-align: center;
	margin-bottom: 10 px;
	box-shadow:
		0 4px 6px rgba(50, 50, 93, 0.11),
		0 1px 3px rgba(0, 0, 0, 0.08);
`;

const VideoButtonBox = styled.div`
	padding: 5px;
	border-radius: 10px;
	width: 110px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #d0a970;
`;

const MuteContainer = styled.div`
	padding: 5px;
	width: 110px;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

export {
	Container,
	OutButton,
	VideoContainer,
	VideoBox,
	StartButton,
	VideoButtonBox,
	Session,
	NameTag,
	Header,
	MuteContainer,
};
