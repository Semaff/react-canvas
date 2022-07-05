import { observer } from 'mobx-react-lite';
import React from 'react';
import notifyState from '../store/notifyState';
import '../styles/notify.scss';

const Notify = observer(() => {
    const closeNotification = (id) => {
        notifyState.removeNotification(id);
    }

    return (
        <div className='notifier'>
            {notifyState.notifications.length > 0
                ?
                notifyState.notifications.map(notification => (
                    <div id={notification.id} key={notification.id} className="notify">
                        <div className="notify__header">
                            <h3 className="notify__title">Подключение...</h3>
                            <button onClick={() => closeNotification(notification.id)} className='notify__close'>
                                <img src="./assets/img/close.svg" alt="close" />
                            </button>
                        </div>
                        <div className="notify__body">
                            <p className="notify__desc">{notification.desc}</p>
                        </div>
                    </div>
                ))
                :
                null
            }
        </div>
    )
});

export default Notify;