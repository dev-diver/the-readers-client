import React, { useEffect, useRef } from 'react';

import '../styles.css';

function RtcViewer(){

  const peerConnection = new RTCPeerConnection();
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
    
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      },
      error => {
        console.warn(error.message);
      }
    );
  }, []);
  
	return (
		<div className="video-container">
			{/* <video autoPlay className="remote-video" id="remote-video"></video> */}
			<video ref={videoRef} autoPlay muted className="local-video" id="local-video"></video>
		</div>
	);
}

export default RtcViewer;
