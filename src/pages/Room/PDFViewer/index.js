import React, { useEffect, useState, useCallback, useRef} from 'react';
import socket, { baseURL } from 'socket.js'; 
import Button from 'Button';

function PDFViewer(){
    const [htmlContent, setHtmlContent] = useState('');
    const [isAttention, setAttention] = useState(false);

    const containerRef = useRef(null);

    const moveToScroll = (scrollTop) => {
        console.log("moveto", scrollTop);
        containerRef.current.scrollTop = scrollTop;
    }

    const sendAttention = () => {
        socket.emit('attention', {
            attention : true,
            scrollTop : containerRef.current.scrollTop
        });
    }

    const handleScroll = useCallback((event) => {
        const scrollTop = event.currentTarget.scrollTop;
        console.log(`스크롤 위치 : ${scrollTop}`);
        socket.emit('attention_scroll', {
            cleintID : 1,
            scrollTop: scrollTop
        });
        setAttention(false);
    })

    useEffect(()=> {
        fetch(`${baseURL}/src/example.html`)
            .then(response => response.text())
            .then(data => {
                setHtmlContent(data);
            });
    },[]);

    useEffect(()=>{
        socket.on('attention', (data) => {
            setAttention(data.attention);
            moveToScroll(data.scrollTop);
        });

        return () => {
            socket.off('attention');
            socket.off('attention_scroll');
        };
    },[])

    useEffect(()=>{
        if(isAttention){
            socket.on('attention_scroll', (data) => {
                moveToScroll(data.scrollTop);
            });
        }else{
            socket.off('attention_scroll')
        }
    },[isAttention])

	return (
        <>
        <Button onClick ={()=>sendAttention()}/>
        <div 
            className="pdf-container" 
            onScroll={handleScroll}
            ref={containerRef}
        >
            <div
                className ="pdf-contents"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
        </>
	);
}

export default PDFViewer;
