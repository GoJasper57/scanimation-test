let baseImage;
let gridOverlayImage;
let sliderPosition = 0;
let showOverlay = true;

const sliceWidth = 1;
const frameC = 8; // 你的 base 是由 8 帧组成的

// KEYBOARD STATE
let isLeftPressed = false;
let isRightPressed = false;
const keyHoldSpeed = 0.25;

// mouse
let previousSliderPosition = 0;

// touch
let startTouchX = 0;
let isTouchDragging = false;

function preload() {
  baseImage = loadImage("cat walk base.png"); // 你的合成底图
}

function setup() {
  createCanvas(baseImage.width, baseImage.height);
  gridOverlayImage = createGraphics(width, height);
  createGridOverlayImage();

  sliderPosition = -width / 2;
}

function draw() {
  background(230);

  // 显示 base 图
  image(baseImage, 0, 0);

  // 更新 slider
  if (isLeftPressed) sliderPosition -= keyHoldSpeed;
  if (isRightPressed) sliderPosition += keyHoldSpeed;

  // 显示遮罩
  if (showOverlay) {
    let gridX = Math.round(sliderPosition);
    push();
    translate(gridX, 0);
    image(gridOverlayImage, 0, 0);
    pop();
  }

  drawHUD();
}

function createGridOverlayImage() {
  gridOverlayImage.clear();
  gridOverlayImage.noStroke();

  for (let x = 0; x < width * 2; x += sliceWidth * frameC) {
    // 透明条
    gridOverlayImage.fill(255, 0);
    gridOverlayImage.rect(x, 0, sliceWidth, height);

    // 黑条
    gridOverlayImage.fill(0);
    gridOverlayImage.rect(x + sliceWidth, 0, sliceWidth * (frameC - 1), height);
  }
}

function drawHUD() {
  push();
  fill(0);
  stroke(255);
  strokeWeight(2);
  text("←/→ 或拖动滑动遮罩", 10, height - 20);
  text("空格：开/关遮罩", 10, height - 5);
  pop();
}

// 键盘事件
function keyPressed() {
  if (keyCode === LEFT_ARROW) isLeftPressed = true;
  else if (keyCode === RIGHT_ARROW) isRightPressed = true;
  else if (keyCode === 32) showOverlay = !showOverlay;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) isLeftPressed = false;
  else if (keyCode === RIGHT_ARROW) isRightPressed = false;
}

// 鼠标事件
function mousePressed() {
  previousSliderPosition = sliderPosition;
}

function mouseDragged() {
  sliderPosition += movedX / 10;
}

function mouseReleased() {
  if (Math.abs(sliderPosition - previousSliderPosition) < 1) {
    showOverlay = !showOverlay;
  }
}

// 触摸事件
function touchStarted() {
  if (touches.length > 0) {
    startTouchX = touches[0].x;
    previousSliderPosition = sliderPosition;
    isTouchDragging = false;
  }
}

function touchMoved() {
  if (touches.length > 0) {
    let delta = touches[0].x - startTouchX;
    sliderPosition += delta / 10;
    startTouchX = touches[0].x;
    isTouchDragging = true;
  }
  return false;
}

function touchEnded() {
  if (!isTouchDragging) {
    showOverlay = !showOverlay;
  }
  isTouchDragging = false;
}
