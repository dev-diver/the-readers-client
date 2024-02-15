import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import WifiIcon from "@mui/icons-material/Wifi";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const listItems = [
	{
		id: "cursor",
		text: "커서",
	},
	{
		id: "draw",
		text: "필기",
	},
	{
		id: "highlight",
		text: "하이라이트",
	},
	{
		id: "voice",
		text: "보이스",
	},
	{
		id: "bluetooth",
		text: "화상채팅",
	},
];
export default function SwitchController() {
	const [checked, setChecked] = React.useState(["cursor"]);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	return (
		<Paper>
			<List
				sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
				subheader={<ListSubheader>각자의 이름 표시</ListSubheader>}
			>
				{listItems.map(({ id, text }) => (
					<ListItem
						key={id}
						sx={{
							"&.MuiListItem-root": {
								paddingTop: "0px", // 위쪽 패딩 조정
								paddingBottom: "0px", // 아래쪽 패딩 조정
							},
						}}
					>
						<Switch
							edge="end"
							onChange={handleToggle(id)}
							checked={checked.indexOf(id) !== -1}
							inputProps={{
								"aria-labelledby": `switch-list-label-${id}`,
							}}
						/>
						<ListItemText id={`switch-list-label-${id}`} primary={text} />
					</ListItem>
				))}
			</List>
		</Paper>
	);
}
