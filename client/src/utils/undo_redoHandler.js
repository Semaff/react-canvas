import canvasState from "../store/canvasState";

export default function undo_redoHandler(msg, canvas) {
    const { data, oldData, method } = msg;
    const ctx = canvas.getContext('2d');
    canvasState.redraw(ctx, data, oldData, method);
}