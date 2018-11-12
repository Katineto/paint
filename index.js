const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let selectedTool = "pen";
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = "#8080ff";
let toolSize = 20;
let lineCap = "round";
let hue = 70;
// Default pen style
ctx.strokeStyle = color;
ctx.lineJoin = "round";

// Main drawing functionality
function draw(e) {
  if (!isDrawing) return;
  ctx.lineCap = lineCap;
  ctx.lineWidth = toolSize;
  if (selectedTool === "pen") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
  if (selectedTool === "rainbow") {
    ctx.strokeStyle = `hsl(${hue}, 50%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    hue++;
  }

  [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", e => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  if (selectedTool === "text") {
    textPrompt();
  }
});
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// Handle color selection
const colorInput = document.getElementById("color");
colorInput.addEventListener("change", () => {
  color = colorInput.value;
  console.log(colorInput.value);
  console.log(color);
});

// Handle pen width
const sizeSpan = document.getElementById("size");
const sizeInput = document.getElementById("tool-size");
sizeInput.addEventListener("change", () => {
  toolSize = sizeInput.value;
  sizeSpan.innerText = sizeInput.value;
});

// Select pen
function selectPen() {
  color = colorInput.value;
  selectedTool = "pen";
}
const pen = document.getElementById("pen");
pen.addEventListener("click", selectPen);

//Select rainbow
const rainbow = document.getElementById("rainbow");
rainbow.addEventListener("click", selectRainbow);
function selectRainbow() {
  rainbow.classList.remove("not-selected");
  rainbow.classList.add("selected");
  selectedTool = "rainbow";
}

// Text tool
function textPrompt() {
  const text = prompt("Enter your text:", "");
  if (!text) return;
  ctx.font = `${sizeInput.value}px sans-serif`;
  ctx.fillText(text, lastX, lastY);
}
const textTool = document.getElementById("text");
function handleTextInput() {
  selectedTool = "text";
}
textTool.addEventListener("click", handleTextInput);

// Select eraser
const eraser = document.getElementById("eraser");
eraser.addEventListener("click", () => {
  selectedTool = "pen";
  color = "#fff";
});

// Handle clearing the canvas
const clear = document.getElementById("clear");
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 800;
  canvas.height = 800;
}
clear.addEventListener("click", clearCanvas);

// Handle saving the picture
function downloadImage(e) {
  try {
    const data = ctx.canvas.toDataURL("image/png");
    this.href = data;
  } catch (e) {
    console.log(e); // Possible security error?
  }
}
const download = document.getElementById("download");
download.addEventListener("click", downloadImage);

// Handle loading image from user
function loadImageURL(url) {
  const image = document.createElement("img");
  image.addEventListener("load", function() {
    ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = color;
    ctx.lineWidth = toolSize;
  });
  image.src = url;
}
function handleLoad() {
  if (load.files.length === 0) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    loadImageURL(reader.result);
  });
  reader.readAsDataURL(load.files[0]);
}
const load = document.getElementById("load");
load.addEventListener("change", handleLoad);

// Set color and pen width from current inputs
window.onload = function() {
  color = colorInput.value;
  toolSize = sizeInput.value;
  load.value = "";
  sizeSpan.innerText = sizeInput.value;
};
