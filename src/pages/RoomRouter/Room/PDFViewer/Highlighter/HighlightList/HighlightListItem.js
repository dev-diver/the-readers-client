import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { useDeleteHighlightListItem } from "pages/RoomRouter/Room/PDFViewer/Highlighter/util";
import { scrollerRefState } from "recoil/atom";
import { useRecoilState } from "recoil";

const DISPLAY_LENGTH = 12;

export default function HighlightListItem({ hlInfo }) {
	const { roomId } = useParams();
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);

	const deleteHandler = useDeleteHighlightListItem();

	const displayText =
		hlInfo.text.length > DISPLAY_LENGTH ? hlInfo.text.substring(0, DISPLAY_LENGTH) + "..." : hlInfo.text;
	return (
		<Grid
			container
			justifyContent="space-between"
			sx={{ margin: "5px", padding: "5px", borderRadius: "6px", border: "solid 1px #333", backgroundColor: "#f5f7fa" }}
		>
			<Grid item>
				<Link
					style={{ textDecoration: "none ", color: "inherit" }}
					to={`/room/${roomId}/book/${hlInfo.bookId}?highlightId=${hlInfo.id}`}
				>
					<Tooltip placement="left" title={hlInfo.text}>
						<Typography component="span" variant="span" data-page-num={hlInfo.pageNum} data-highlight-id={hlInfo.id}>
							{displayText}
						</Typography>
					</Tooltip>
				</Link>
			</Grid>
			<Grid item>
				<Button variant="contained" size="small" onClick={() => deleteHandler(scrollerRef, hlInfo, roomId)}>
					삭제
				</Button>
			</Grid>
		</Grid>
	);
}
