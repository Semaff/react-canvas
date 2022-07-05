import Brush from "./Brush";

export default class Eraser extends Brush {
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static serverDraw(ctx, x, y, lineWidth) {
        let prevStyle = ctx.strokeStyle;
        let prevLineWidth = ctx.lineWidth;
        
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "white";
        ctx.lineTo(x, y);
        ctx.stroke();
        
        ctx.strokeStyle = prevStyle;
        ctx.lineWidth = prevLineWidth;
    }
}