import "./style.css";

// * variables

const canvas = document.getElementById("canvas");
const undoButton = document.getElementById("undo");
const createImageButton = document.getElementById("create-image");
const drawWidthRange = document.getElementById("draw-width-range");

canvas.width = window.innerWidth - 60;
canvas.height = 800;

let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let drawColor = "black";
let isDrawing = false;
let drawWidth = "5";

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

createImageButton.addEventListener("click", createImage, false);

undoButton.addEventListener("click", undo, false);

drawWidthRange.addEventListener("change", setDrawWidth, false);

let restoreArray = [];
let index = -1;

// * function

function start(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}
function draw(event) {
    if (isDrawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColor;
        context.lineWidth = drawWidth;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if (isDrawing) {
        context.stroke();
        context.closePath();
        isDrawing = false;
    }
    event.preventDefault();

    if (event.type != "mouseout") {
        restoreArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index++;
    }
}

function setDrawWidth(e) {
    drawWidth = e.target.value;
}

function createImage() {
    const image = canvas.toDataURL("image/png");
    document.getElementById("image-result").src = image;
}

function clearCanvas() {
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function undo() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index--;
        restoreArray.pop();
        context.putImageData(restoreArray[index], 0, 0);
    }
}
