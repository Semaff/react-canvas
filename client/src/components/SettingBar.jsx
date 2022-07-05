import { observer } from 'mobx-react-lite';
import React from 'react';
import toolState from '../store/toolState';
import "../styles/toolbar.scss"

const SettingBar = observer(({ strokeStyle, setStrokeStyle }) => {
    // Change StrokeColor for input + Change strokeStyle for canvas
    const changeStrokeColorHandler = (e) => {
        toolState.setStrokeColor(e.target.value);
        setStrokeStyle(e.target.value);
    }

    return (
        <div className='setting-bar'>
            <label htmlFor="line-width">Толщина линии/обводки</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                style={{ margin: '0 10px' }}
                id='line-width'
                type="number" min={1} max={50} defaultValue={1}
            />

            <label htmlFor="stroke-color">Цвет линии/обводки</label>
            <input
                onChange={e => changeStrokeColorHandler(e)}
                style={{ margin: '0 10px' }}
                value={strokeStyle}
                id='stroke-color'
                type="color"
            />
        </div>
    )
});

export default SettingBar;