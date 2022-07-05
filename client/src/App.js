import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Canvas, Modal, Notify, SettingBar, Toolbar } from './components';
import canvasState from './store/canvasState';
import "./styles/app.scss";

function App() {
    const [fillStyle, setFillStyle] = useState("#000000");
    const [strokeStyle, setStrokeStyle] = useState("#000000");
    const [showModal, setShowModal] = useState(true);
    const usernameRef = useRef();

    // New User
    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setShowModal(false);
    }

    // Handle CTRL + Z and CTRL + Y
    const handleKeyDown = (e) => {
        let charCode = String.fromCharCode(e.which).toLowerCase();
        if ((e.ctrlKey || e.metaKey) && charCode === 'z') {
            // alert("CTRL+Z Pressed");
            canvasState.undo();
        } else if ((e.ctrlKey || e.metaKey) && charCode === 'y') {
            // alert("CTRL+Y Pressed");
            canvasState.redo();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    return (
        <div className='app'>
            <Toolbar
                fillStyle={fillStyle}
                setFillStyle={setFillStyle} setStrokeStyle={setStrokeStyle} />
            <SettingBar strokeStyle={strokeStyle} setStrokeStyle={setStrokeStyle} />
            <Canvas />

            <Notify />
            <Modal
                show={showModal}
                connectHandler={connectHandler}
                usernameRef={usernameRef}
            />
        </div>
    )
}

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:id" element={<App />} ></Route>
                <Route path="*" element={<Navigate to={`f${(+new Date()).toString(16)}`} replace />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;