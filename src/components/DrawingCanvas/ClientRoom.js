import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
	const imgRef = useRef(null);
	useEffect(() => {
		socket.on("message", (data) => {
			toast.info(data.message);
		});
	}, []);
	useEffect(() => {
		socket.on("users", (data) => {
			console.log("server에서 준 data:", data);
			setUsers(data);
			setUserNo(data.length);
		});
	}, []);
	useEffect(() => {
		socket.on("canvasImage", (data) => {
			if (imgRef.current) {
				// console.log("***mgRef.current.src***", imgRef.current.src);
				// console.log("***data***", data);
				imgRef.current.src = data;
			}
		});
	}, []);

	return (
		<div>
			<div className="row mt-5">
				<div
					className="col-md-8 overflow-hidden border border-dark px-0 mx-auto
          mt-3"
					style={{ height: "500px" }}
				>
					<img className="w-100 h-100" ref={imgRef} src="" alt="image" style={{ objectFit: "contain" }} />
				</div>
			</div>
		</div>
	);
};

export default ClientRoom;
