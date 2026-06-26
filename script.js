const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 16; 
const PIXEL_COUNT = 400;
const PIXEL_SIZE = canvas.width / GRID_SIZE;
let gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('#1a1530'));
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            ctx.fillStyle = gridData[r][c];
            ctx.fillRect(c * PIXEL_SIZE, r * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * PIXEL_SIZE, 0);
        ctx.lineTo(i * PIXEL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * PIXEL_SIZE);
        ctx.lineTo(canvas.width, i * PIXEL_SIZE);
        ctx.stroke();
    }
}
const nesPalette = [
    '#000000',
    '#FFFFFF',
    '#ff0000', 
    '#0018B8', 
    '#00A800', 
    '#F8B800', 
    '#58bdf8', 
    '#f800d3', 
    '#BCBCBC' 
];
let currentColor = nesPalette[2];
const paletteContainer = document.getElementById('palette');
nesPalette.forEach((color, index) => {
    const swatch = document.createElement('div');
    swatch.classList.add('color-swatch');
    swatch.style.backgroundColor = color;
    if (color === currentColor) swatch.classList.add('selected');
     swatch.addEventListener('click', () => {
         document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
         swatch.classList.add('selected');
         currentColor = color;
         if (currentTool === 'eraser') switchTool('pencil');
     });
     paletteContainer.appendChild(swatch);
 });
 let isDrawing = false;
 function getPixelCoords(e) {
     const rect = canvas.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;   
     const col = Math.floor(x / (rect.width / GRID_SIZE));
     const row = Math.floor(y / (rect.height / GRID_SIZE)); 
     return { row, col };
 }
 canvas.addEventListener('mousedown', (e) => {
     isDrawing = true;
     const { row, col } = getPixelCoords(e);
     handleAction(row, col);
 });
 canvas.addEventListener('mousemove', (e) => {
     if (!isDrawing) return;
     const { row, col } = getPixelCoords(e);
     handleAction(row, col);
 });
 window.addEventListener('mouseup', () => {
     isDrawing = false;
 });
 function handleAction(row, col) {
     if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
         if (currentTool === 'pencil') {
             gridData[row][col] = currentColor;
         } else if (currentTool === 'eraser') {
             gridData[row][col] = '#1a1530'; 
         } else if (currentTool === 'bucket') {
             floodFill(row, col, gridData[row][col], currentColor);
         }
         drawGrid();
     }
 }
 function floodFill(startRow, startCol, targetColor, replacementColor) {
     if (targetColor === replacementColor) return;
     if (gridData[startRow][startCol] !== targetColor) return;
     const queue = [[startRow, startCol]];
     while (queue.length > 0) {
         const [r, c] = queue.shift();
         if (gridData[r][c] === targetColor) {
             gridData[r][c] = replacementColor;
             if (r > 0) queue.push([r - 1, c]);
             if (r < GRID_SIZE - 1) queue.push([r + 1, c]);
             if (c > 0) queue.push([r, c - 1]);
             if (c < GRID_SIZE - 1) queue.push([r, c + 1]);
         }
     }
 }
 function switchTool(toolName) {
     currentTool = toolName;
     document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
     if(toolName !== 'clear') {
         document.getElementById(`tool-${toolName}`).classList.add('active');
     }
 }
 document.getElementById('tool-pencil').addEventListener('click', () => switchTool('pencil'));
 document.getElementById('tool-eraser').addEventListener('click', () => switchTool('eraser'));
 document.getElementById('tool-bucket').addEventListener('click', () => switchTool('bucket'));
 document.getElementById('tool-clear').addEventListener('click', () => {
    if(confirm("Очистить весь рисунок")) {
         gridData = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('#1a1530'));
         drawGrid();
     }
 });
document.getElementById('cartridgeSlot').addEventListener('click', () => {
    alert("⚡ GAME OVER?! Нет, это просто пасхалка! Цвета инвертированы! ⚡");
    gridData = gridData.map(row => row.map(color => color === '#1a1530' ? '#ff007f' : '#1a1530'));
    drawGrid();
});
  document.getElementById('downloadBtn').addEventListener('click', () => {
     const exportCanvas = document.createElement('canvas');
     const exportSize = 512;
     exportCanvas.width = exportSize;
     exportCanvas.height = exportSize;   
     const exportCtx = exportCanvas.getContext('2d');
     const exportPixelSize = exportSize / GRID_SIZE;
     for (let r = 0; r < GRID_SIZE; r++) {
         for (let c = 0; c < GRID_SIZE; c++) {
             if (gridData[r][c] !== '#1a1530') {
                 exportCtx.fillStyle = gridData[r][c];
                 exportCtx.fillRect(c * exportPixelSize, r * exportPixelSize, exportPixelSize, exportPixelSize);
             }
         }
     }
     const link = document.createElement('a');
     link.download = 'retro-sprite.png';
     link.href = exportCanvas.toDataURL('image/png');
     link.click();
 });
 drawGrid();
