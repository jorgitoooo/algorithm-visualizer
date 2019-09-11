import { BarChart, BarChartGrid } from './data_structures.js';
// Global variables
const progressLimit = 50;
/**************************************/
// Create bar chart
const bc = new BarChart();
const grid = new BarChartGrid();
grid.InitWith(bc);
/**************************************/
let subArrayQueue = [[...bc.bars]];

let pivots = [Math.floor(bc.bars.length / 2)];

// Pivot will end in sorted position
bc.bars[pivots[0]].color = bc.sortedColor;

let lows = [0];
let highs = [bc.bars.length - 1];

let finished = [false];
let allFinished = false;

let start = null;
let stopId;

let prevLow = lows[0];
let prevHigh = highs[0];
let repeatCount = 0;

function quickSortAnimation(timestamp) {
  let progress = timestamp - start;

  if (!start || progress > progressLimit) {
    start = timestamp;

    let curLength = subArrayQueue.length;
    for (let i = 0; i < curLength; i++) {
      if (lows[i] < highs[i]) {
        [lows[i], highs[i], pivots[i]] = advanceLowHigh(
          subArrayQueue[i],
          pivots[i],
          lows[i],
          highs[i]
        );
      } else {
        // console.log(i, lows[i], highs[i], pivots[i]);
        // console.log('else');
        let tmpArr = subArrayQueue[i].slice(0, highs[i]);
        // console.log(tmpArr);
        subArrayQueue.push(tmpArr);
        lows.push(0);
        highs.push(highs[i]);

        tmpArr = subArrayQueue[i].slice(highs[i]);
        // console.log(tmpArr);
        subArrayQueue.push(tmpArr);
        lows.push(0);
        highs.push(highs[i]);

        subArrayQueue.shift();
        highs.shift();
        lows.shift();

        finished[i] = true;
      }
      bc.Update(subArrayQueue);
    }
    grid.Clear();
    grid.Draw(bc);
  }
  allFinished = true;
  for (let i = 0; i < finished.length; i++) {
    if (!finished[i]) allFinished = false;
  }

  stopId = requestAnimationFrame(quickSortAnimation);
  if (allFinished) {
    console.log('finished');
    cancelAnimationFrame(stopId);
  }
}

stopId = requestAnimationFrame(quickSortAnimation);

function advanceLowHigh(array, pivot, low, high) {
  // console.log(low, pivot, high);
  let lowEl = array[low].height;
  let pivotEl = array[pivot].height;
  let highEl = array[high].height;

  if (lowEl < pivotEl && highEl > pivotEl) {
    low++;
    high--;
  } else {
    if (lowEl < pivotEl || highEl > pivotEl) {
      if (lowEl < pivotEl) {
        low++;
      } else {
        high--;
      }
    } else {
      if (low === pivot) pivot = high;
      if (high === pivot) pivot = low;

      bc.SwapBars(low, high);
      // bc.bars[low].color = bc.sortedColor;
      // bc.bars[high].color = bc.sortedColor;
      low++;
      high--;
    }
  }
  return [low, high, pivot];
}

// function advanceLow(array, pivot, low, high) {
//   let lowEl = array[low].height;
//   let pivotEl = array[pivot].height;
//   let highEl = array[high].height;

//   if(highEl > pivotEl) {
//     bc.SwapBars(pivot, high);
//     return [low, high - 1, pivot];
//   }
//   if(lowEl > pivotEl) {
//     bc.SwapBars(low, pivot);
//     return [low, pivot,]
//   }
// }
