import { observer } from 'mobx-react-lite';
import React from 'react';
import '../styles/modal.scss';

const Modal = observer(({connectHandler, usernameRef, show}) => {
    if(!show) {
        return false;
    }

    return (
        <div className="modal-bg">
            <div className="modal">
                <div className="modal__header">
                    <h2 className="modal__title">Введите ваше имя</h2>
                </div>
                <div className="modal__body">
                    <input ref={usernameRef} type="text" className='modal__input' placeholder='Имя...' />
                </div>
                <div className="modal__footer">
                    <button className='modal__btn' onClick={() => connectHandler()}>Войти</button>
                </div>
            </div>
        </div>
    )
});

export default Modal;