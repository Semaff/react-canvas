import { Brush, Circle, Eraser, Line, Rect, Triangle } from '../tools';

export default function drawHandler(msg, canvas) {
    const figure = msg.figure;
    const ctx = canvas.getContext('2d');
    switch (figure.type) {
        case 'brush':
            Brush.serverDraw(ctx, figure.x, figure.y, figure.strokeColor, figure.lineWidth);
            break;
        case 'eraser':
            Eraser.serverDraw(ctx, figure.x, figure.y, figure.lineWidth);
            break;
        case 'rect':
            Rect.serverDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeColor, figure.lineWidth);
            break;
        case 'triangle':
            Triangle.serverDraw(ctx, figure.x, figure.y, figure.curX, figure.curY, figure.fillColor, figure.strokeColor, figure.lineWidth);
            break
        case 'circle':
            Circle.serverDraw(ctx, figure.x, figure.y, figure.r, figure.fillColor, figure.strokeColor, figure.lineWidth);
            break;
        case 'line':
            Line.serverDraw(ctx, figure.startX, figure.startY, figure.finishX, figure.finishY, figure.fillColor, figure.strokeColor, figure.lineWidth);
            break
        case 'finish':
            ctx.beginPath();
            break;
        default:
            break;
    }
}