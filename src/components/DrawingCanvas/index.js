import React from "react";
import ReactDOM from "react-dom";

import ClientRoom from "./ClientRoom";
import { useRecoilState } from "recoil";
import { roomUsersState } from "recoil/atom";

import "./style.css";

const DrawingCanvas = () => {
	const [users, setUsers] = useRecoilState(roomUsersState);

	return (
		<div className="home">
			{/* <UtilButton /> */}
			{users.map((user, index) => (
				<ClientRoom key={index} canvasId={user.id} setUsers={setUsers} />
			))}
		</div>
	);
};

const UtilButton = () => {
	return (
		<>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-2">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 노란색 버튼
							className="btn btn-warning"
							value="load canvas #time (미구현)"
							// onClick={loadCanvas}
						/>
					</div>
				</div>
			</div>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-1">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 초록색 버튼
							className="btn btn-success"
							value="save canvas"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DrawingCanvas;
