const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let isErasing = false;

function usePencil() {
    isErasing = false;
    context.strokeStyle = '#5cbcf2'; // Pencil color
}

function useEraser() {
    isErasing = true;
    context.strokeStyle = '#1e1e1e'; // Eraser color (dark background)
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    context.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    context.lineWidth = isErasing ? 20 : 2; // Adjust line width for eraser
    context.lineCap = 'round';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
