import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { fetchCanvas, sendCanvas } from '../API/canvasAPI';
import { Brush } from '../tools';
import socketAPI from '../API/socketAPI';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import "../styles/canvas.scss"

const Canvas = observer(() => {
    const canvasRef = useRef();
    const params = useParams();

    // Redraw Canvas for others
    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        let ctx = canvasState.canvas.getContext('2d');

        fetchCanvas(params.id)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                // img.onload = () => {}

                // * REDRAW
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.stroke();
            }).catch(err => {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
                ctx.fillStyle = "black";
            });
    }, [params.id]);

    // Check Connection / Draw canvas
    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/');
            canvasState.setSocket(socket);
            canvasState.setSessionID(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));

            // use socketAPI to get connection
            socketAPI(socket, params.id, canvasState.username, canvasRef.current);
        }
    }, [canvasState.username]);

    return (
        <div className='canvas'>
            <canvas
                onMouseUp={() => sendCanvas(params.id, canvasRef.current.toDataURL())}
                onMouseDown={() => canvasState.pushToUndo(canvasRef.current.toDataURL())}
                ref={canvasRef} width={1000} height={600} />
        </div>
    )
});

export default Canvas;