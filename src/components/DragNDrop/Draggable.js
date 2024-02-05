// import React from "react";
// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";

// function Draggable(props) {
// 	const { attributes, listeners, setNodeRef, transform } = useDraggable({
// 		id: props.id,
// 	});
// 	const style = {
// 		// Outputs `translate3d(x, y, 0)`
// 		transform: CSS.Translate.toString(transform),
// 	};

// 	return (
// 		<button ref={setNodeRef} style={style} {...listeners} {...attributes}>
// 			{props.children}
// 		</button>
// 	);
// }

import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function Draggable({ id, content, styles }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: {};

	return (
		<div ref={setNodeRef} style={{ ...style, ...styles }} {...listeners} {...attributes}>
			{content}
		</div>
	);
}
