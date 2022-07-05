import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Brush, Rect, Line, Circle, Eraser, Triangle } from "../tools";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import '../styles/toolbar.scss'

const Toolbar = observer(({ fillStyle, setFillStyle, setStrokeStyle }) => {
    const toolbarRef = useRef();

    // Change Color on both inputs + Change Canvas stroke and fill Style
    const changeColor = e => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
        setFillStyle(e.target.value);
        setStrokeStyle(e.target.value);
    }

    // Download canvas IMG
    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionid + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Set choosen tool + add 'active' class to button
    const setTool = (e, Tool) => {
        toolState.setTool(new Tool(canvasState.canvas, canvasState.socket, canvasState.sessionId));
        const activeBtn = toolbarRef.current.querySelector('.active');
        if (activeBtn) {
            activeBtn.classList.remove('active');
        }
        e.currentTarget.classList.add('active');
    }

    return (
        <div className="toolbar" ref={toolbarRef}>
            {/* Left Side - choose tool */}
            <div className="toolbar__left">
                <button title='BRUSH' className='toolbar__btn active' onClick={(e) => setTool(e, Brush)}>
                    <img src="./assets/img/brush.png" alt="brush" />
                </button>
                <button title='RECTANGLE' className='toolbar__btn' onClick={(e) => setTool(e, Rect)}>
                    <img src="./assets/img/rect.png" alt="rect" />
                </button>
                <button title='TRIANGLE' className='toolbar__btn' onClick={(e) => setTool(e, Triangle)}>
                    <img src="./assets/img/triangle.png" alt="line" />
                </button>
                <button title='CIRCLE' className='toolbar__btn' onClick={(e) => setTool(e, Circle)}>
                    <img src="./assets/img/circle.png" alt="circle" />
                </button>
                <button title='ERASER' className='toolbar__btn' onClick={(e) => setTool(e, Eraser)}>
                    <img src="./assets/img/eraser.png" alt="eraser" />
                </button>
                <button title='LINE' className='toolbar__btn' onClick={(e) => setTool(e, Line)}>
                    <img src="./assets/img/line.png" alt="line" />
                </button>

                <label htmlFor="fill-color">Цвет заливки</label>
                <input
                    id='fill-color'
                    value={fillStyle}
                    onChange={e => changeColor(e)}
                    type="color" />
            </div>

            {/* Right Side - redo/undo/save */}
            <div className="toolbar__right" style={{ marginLeft: 'auto' }}>
                <button title='UNDO (CTRL + Z)' className='toolbar__btn' onClick={() => canvasState.undo()}>
                    <img src="./assets/img/undo.png" alt="undo" />
                </button>
                <button title='REDO (CTRL + Y)' className='toolbar__btn' onClick={() => canvasState.redo()}>
                    <img src="./assets/img/redo.png" alt="redo" />
                </button>
                <button title='SAVE' className='toolbar__btn' onClick={() => download()}>
                    <img src="./assets/img/save.png" alt="save" />
                </button>
            </div>
        </div>
    );
});

export default Toolbar;