import { makeAutoObservable } from "mobx";
import { sendCanvas } from "../API/canvasAPI";

class CanvasState {
    constructor() {
        this.canvas = null;
        this.socket = null;
        this.sessionId = null;
        this.username = null;
        this.undoList = [];
        this.redoList = [];
        makeAutoObservable(this);
    }

    setUsername(username) {
        this.username = username
    }

    setSocket(socket) {
        this.socket = socket
    }

    setSessionID(id) {
        this.sessionId = id
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    pushToUndo(data) {
        this.undoList.push(data);
    }

    pushToRedo(data) {
        this.redoList.push(data);
    }

    undo() {
        let ctx = this.canvas.getContext('2d');

        if (this.undoList.length > 0) {
            let dataURL = this.undoList.pop();
            let oldDataURL = this.canvas.toDataURL();
            // this.redoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataURL;

            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

                this.socket.send(JSON.stringify({
                    method: 'undo',
                    id: this.sessionId,
                    data: dataURL,
                    oldData: oldDataURL
                }));
            }
        }
    }

    redo() {
        let ctx = this.canvas.getContext('2d');

        if (this.redoList.length > 0) {
            let dataURL = this.redoList.pop();
            let oldDataURL = this.canvas.toDataURL();
            // this.undoList.push(this.canvas.toDataURL());
            let img = new Image();
            img.src = dataURL;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

                this.socket.send(JSON.stringify({
                    method: 'redo',
                    id: this.sessionId,
                    data: dataURL,
                    oldData: oldDataURL
                }));
            }
        }
    }

    redraw(ctx, data, oldData, method) {
        if (method === "undo") {
            if(this.redoList.indexOf(oldData) === -1) this.redoList.push(oldData);
            const img = new Image();
            img.src = data;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                sendCanvas(this.sessionId, data);
            }
        } else {
            if(this.undoList.indexOf(oldData) === -1) this.undoList.push(oldData);
            const img = new Image();
            img.src = data;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                sendCanvas(this.sessionId, data);
            }
        }
    }
}

export default new CanvasState();