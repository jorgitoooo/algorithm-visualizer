export default (bc, grid) => {
  return new Promise((resolve, reject) => {
    // Global variables
    const progressLimit = 15;
    /**************************************/
    // Initialize grid with bar chart
    grid.InitWith(bc);
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

        grid.Clear();
        grid.Draw(bc);
      }

      stopId = requestAnimationFrame(insertionSortAnimation);
      if (finished) {
        cancelAnimationFrame(stopId);
        setTimeout(() => {
          grid.Clear();
          resolve();
        }, 1500);
      }
    }

    stopId = requestAnimationFrame(insertionSortAnimation);
  });
};
