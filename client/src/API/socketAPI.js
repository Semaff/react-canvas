import notifyState from "../store/notifyState";
import drawHandler from "../utils/drawHandler";
import undo_redoHandler from "../utils/undo_redoHandler";

export default function socketAPI(socket, id, username, canvas) {
    // socket ON OPEN
    socket.onopen = () => {
        console.log('Соединение установлено');
        socket.send(JSON.stringify({
            id: id,
            username: username,
            method: 'connection'
        }))
    }

    // socket ON MESSAGE
    socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
            case "connection":
                console.log(`Пользователь ${msg.username} подключен`);
                notifyState.addNotification({desc: msg.username, id: Date.now()});
                break;
            case "draw":
                drawHandler(msg, canvas);
                break;
            case "undo":
            case "redo":
                undo_redoHandler(msg, canvas);
                break;
            default:
                break;
        }
    }
}
