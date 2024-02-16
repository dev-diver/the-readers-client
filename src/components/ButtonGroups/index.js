import React from "react";
import { Button, ButtonGroup } from "@mui/material";

function ButtonGroups({ style }) {
	return (
		<div style={style}>
			<ButtonGroup variant="solid" color="success">
				<Button>메모 삽입</Button>
				<Button>링크 삽입</Button>
				<Button>내부 링크</Button>
				<Button>외부 링크</Button>
			</ButtonGroup>
		</div>
	);
}

export default ButtonGroups;
