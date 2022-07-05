import Tool from "./Tool";

export default class Triangle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.savedImg = this.canvas.toDataURL();
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'triangle',
                x: this.startX,
                y: this.startY,
                curX: this.currentX,
                curY: this.currentY,
                fillColor: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;

            this.draw(this.startX, this.startY, this.currentX, this.currentY);
        }
    }

    draw(x, y, curX, curY) {
        const img = new Image();
        img.src = this.savedImg;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(curX, curY);
        this.ctx.lineTo(x + (x - curX), curY);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }

    static serverDraw(ctx, x, y, curX, curY, fillColor, strokeColor, lineWidth) {
        let prevFillColor = ctx.fillStyle;
        let prevStrokeColor = ctx.strokeStyle;
        let prevLineWidth = ctx.lineWidth;

        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(curX, curY);
        ctx.lineTo(x + (x - curX), curY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();

        ctx.fillStyle = prevFillColor;
        ctx.strokeStyle = prevStrokeColor;
        ctx.lineWidth = prevLineWidth;
    }
}