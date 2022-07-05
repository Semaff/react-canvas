import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: this.r,
                fillColor: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startY = e.pageY - e.target.offsetTop;
        this.startX = e.pageX - e.target.offsetLeft;
        this.savedImg = this.canvas.toDataURL();
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let curentX = e.pageX - e.target.offsetLeft
            let curentY = e.pageY - e.target.offsetTop
            let width = curentX - this.startX
            let height = curentY - this.startY
            this.r = Math.sqrt(width ** 2 + height ** 2)
            this.draw(this.startX, this.startY, this.r)
        }
    }

    draw(x, y, r) {
        const img = new Image()
        img.src = this.savedImg
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static serverDraw(ctx, x, y, r, fillColor, strokeColor, lineWidth) {
        let prevFillColor = ctx.fillStyle;
        let prevStrokeColor = ctx.strokeStyle;
        let prevLineWidth = ctx.lineWidth;

        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();

        ctx.fillStyle = prevFillColor;
        ctx.strokeStyle = prevStrokeColor;
        ctx.lineWidth = prevLineWidth;
    }
}