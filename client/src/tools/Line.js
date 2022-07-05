import Tool from "./Tool";

export default class Line extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.currentX = e.pageX - e.target.offsetLeft;
        this.currentY = e.pageY - e.target.offsetTop;
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY);
        this.saved = this.canvas.toDataURL();
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                startX: this.currentX,
                startY: this.currentY,
                finishX: this.finishX,
                finishY: this.finishY,
                fillColor: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
            }
        }))
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.finishX = e.pageX - e.target.offsetLeft;
            this.finishY = e.pageY - e.target.offsetTop
            this.draw(this.finishX, this.finishY);
        }
    }

    draw(x, y) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    static serverDraw(ctx, startX, startY, finishX, finishY, fillColor, strokeColor) {
        let prevFillColor = ctx.fillStyle;
        let prevStrokeColor = ctx.strokeStyle;

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(finishX, finishY);
        ctx.stroke();
        ctx.beginPath();

        ctx.fillStyle = prevFillColor;
        ctx.strokeStyle = prevStrokeColor;
    }
}