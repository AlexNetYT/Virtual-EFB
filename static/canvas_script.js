const container = document.querySelector('.container');
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let tool = 'pencil';

function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

function usePencil() {
  tool = 'pencil';
}

function useEraser() {
  tool = 'eraser';
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (tool === 'pencil') {
    context.lineWidth = 3;
    context.lineCap = 'round';
    context.strokeStyle = '#fff';
  } else if (tool === 'eraser') {
    context.lineWidth = 10;
    context.lineCap = 'round';
    context.strokeStyle = '#333';
  }

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

// Initialize canvas size
resizeCanvas();

// Resize canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
