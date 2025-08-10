let baseImage;
let gridOverlayImage;
let sliderPosition = 0;
let showOverlay = true;

const sliceWidth = 1;
const frameC = 8;
const moveSpeed = 0.5; // 每帧移动速度

// 移动方向：-1 向左，0 停止，1 向右
let moveDir = 0;

function preload() {
  baseImage = loadImage("base.png");
}

function setup() {
  createCanvas(baseImage.width, baseImage.height);

  gridOverlayImage = createGraphics(width, height);
  createGridOverlayImage();

  sliderPosition = -width / 2;

  createButtons();
}

function draw() {
  background(230);

  // 底图
  image(baseImage, 0, 0);

  // 根据方向移动
  if (moveDir !== 0) {
    sliderPosition += moveDir * moveSpeed;
  }

  // 遮罩
  if (showOverlay) {
    const gridX = Math.round(sliderPosition);
    push();
    translate(gridX, 0);
    image(gridOverlayImage, 0, 0);
    pop();
  }
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

function createButtons() {
  const btnStyle = `
    background-color: white;
    border: none;
    border-radius: 16px;
    padding: 24px 48px;
    font-size: 56px;
    white-space: nowrap; /* 不换行 */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    cursor: pointer;
    margin: 0 16px;
    transition: background-color 0.2s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  `;

  const container = createDiv();
  container.style('position', 'absolute');
  container.style('top', '10px');
  container.style('left', '50%');
  container.style('transform', 'translateX(-50%)');
  container.style('display', 'flex');
  container.style('justify-content', 'center');
  container.style('align-items', 'center');
  container.style('z-index', '10');

  // mask on/off：点一下切换遮罩
  const btnMask = createButton('mask on/off');
  btnMask.attribute('style', btnStyle);
  btnMask.mousePressed(() => { showOverlay = !showOverlay; });
  btnMask.mouseOver(() => btnMask.style('background-color', '#f0f0f0'));
  btnMask.mouseOut(() => btnMask.style('background-color', 'white'));
  container.child(btnMask);

  // ◀：点一下开始向左持续移动
  const btnLeft = createButton('◀');
  btnLeft.attribute('style', btnStyle);
  btnLeft.mousePressed(() => { moveDir = -1; });
  btnLeft.mouseOver(() => btnLeft.style('background-color', '#f0f0f0'));
  btnLeft.mouseOut(() => btnLeft.style('background-color', 'white'));
  container.child(btnLeft);

  // ⏸：暂停（停止移动）
  const btnPause = createButton('⏸');
  btnPause.attribute('style', btnStyle);
  btnPause.mousePressed(() => { moveDir = 0; });
  btnPause.mouseOver(() => btnPause.style('background-color', '#f0f0f0'));
  btnPause.mouseOut(() => btnPause.style('background-color', 'white'));
  container.child(btnPause);

  // ▶：点一下开始向右持续移动
  const btnRight = createButton('▶');
  btnRight.attribute('style', btnStyle);
  btnRight.mousePressed(() => { moveDir = 1; });
  btnRight.mouseOver(() => btnRight.style('background-color', '#f0f0f0'));
  btnRight.mouseOut(() => btnRight.style('background-color', 'white'));
  container.child(btnRight);
}

/* 可选：键盘行为（与按钮一致，保留的话更方便调试）
   ← 开始向左；→ 开始向右；空格切换遮罩；P 暂停 */
function keyPressed() {
  if (keyCode === LEFT_ARROW) moveDir = -1;
  else if (keyCode === RIGHT_ARROW) moveDir = 1;
  else if (keyCode === 32) showOverlay = !showOverlay;
  else if (key === 'p' || key === 'P') moveDir = 0;
}
