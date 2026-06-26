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
