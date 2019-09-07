import { Bar, BarChart } from './bars.js';
// Global variables
const progressLimit = 15;
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

// Base case sorted bar
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
