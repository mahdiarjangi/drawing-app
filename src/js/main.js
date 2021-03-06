// * variables

const canvas = document.getElementById("canvas");
const undoButton = document.getElementById("undo");
const canvasImage = document.getElementById("canvas-image");
const createImageButton = document.getElementById("create-image");
const drawWidthRange = document.getElementById("draw-width-range");

canvas.width = canvasImage.width;
canvas.height = canvasImage.height;

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
    context.moveTo(
        event.clientX - canvasImage.getBoundingClientRect().left,
        event.clientY - canvasImage.getBoundingClientRect().top
    );
    event.preventDefault();
}
function draw(event) {
    if (isDrawing) {
        context.lineTo(event.clientX - canvasImage.getBoundingClientRect().left, event.clientY - canvasImage.getBoundingClientRect().top);
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
