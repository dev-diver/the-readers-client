const colors = ["#8884d8", "#82ca9d", "#E69F00", "#ff4b73", "#56B4E9"];
export function coloringUser(userId) {
	return colors[(Number(userId) - 1) % colors.length];
}
