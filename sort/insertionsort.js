// Global variables
const progressLimit = 25;
/**************************************/
// Classes
class Bar {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class BarChart {
  constructor(numOfBars) {
    this.numOfBars = numOfBars;
    this.bars = [];
    this.activeColor = 'salmon';
    this.neutralColor = 'black';
    this.sortedColor = 'dodgerblue';
  }

  ScrambleBars() {
    for (let i = 0; i < this.bars.length - 1; i++) {
      let swapPos = Math.floor(Math.random() * i) + 1;
      this.SwapBars(i, swapPos);
    }
  }

  SwapBars(i, j) {
    let tmpBar = this.bars[i];
    this.bars[i] = this.bars[j];
    this.bars[j] = tmpBar;

    let tmpX = this.bars[i].x;
    this.bars[i].x = this.bars[j].x;
    this.bars[j].x = tmpX;
  }

  ClearBars() {
    const cnv = document.getElementById('cnv');
    const ctx = cnv.getContext('2d');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  }

  DrawBars() {
    const cnv = document.getElementById('cnv');
    const ctx = cnv.getContext('2d');

    for (let i = 0; i < this.numOfBars; i++) {
      ctx.fillStyle = this.bars[i].color;
      ctx.fillRect(
        this.bars[i].x,
        this.bars[i].y,
        this.bars[i].width,
        this.bars[i].height
      );
    }
  }

  Insert(bar) {
    this.bars.push(bar);
  }
}
/**************************************/
// Create bar chart
const bc = new BarChart(50);

(function initCanvas() {
  const cnv = document.getElementById('cnv');
  cnv.width = window.innerWidth * 0.94;
  cnv.height = window.innerWidth * 0.94;
  cnv.style.backgroundColor = '#fff';

  if (cnv.getContext) {
    const pad = cnv.width / (bc.numOfBars * bc.numOfBars);
    const dx = cnv.width / bc.numOfBars - pad;
    let posX = pad;

    for (let i = 0; i < bc.numOfBars; i++) {
      let height = Math.random() * cnv.height * 0.9 + cnv.height * 0.05;
      bc.bars.push(
        new Bar(posX, cnv.height - height, dx, height, bc.neutralColor)
      );
      posX += dx + pad;
    }
    bc.DrawBars();
  } else {
    alert('Canvas not available on your browser.');
    return;
  }
})();

/**************************************/
// First element of sorted bar
bc.bars[0].color = bc.sortedColor;

let curPos = 1;
let movingPos = curPos;
let finished = false;

let start = null;
let stopId;

function insertionSortAnimation(timestamp) {
  let progress = timestamp - start;

  if (!start || progress > progressLimit) {
    start = timestamp;

    if (
      movingPos > 0 &&
      movingPos < bc.bars.length &&
      bc.bars[movingPos].height < bc.bars[movingPos - 1].height
    ) {
      bc.bars[movingPos].color = bc.activeColor;
      bc.SwapBars(movingPos, movingPos - 1);

      movingPos--;
    } else if (movingPos >= bc.bars.length) {
      finished = true;
    } else {
      bc.bars[movingPos].color = bc.sortedColor;
      curPos++;
      movingPos = curPos;
    }

    bc.ClearBars();
    bc.DrawBars();
  }

  stopId = requestAnimationFrame(insertionSortAnimation);
  if (finished) {
    cancelAnimationFrame(stopId);
  }
}

stopId = requestAnimationFrame(insertionSortAnimation);
