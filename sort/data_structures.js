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
    for (let k = 0; k < 10; k++) {
      for (let i = 0; i < this.bars.length - 1; i++) {
        let swapPos = Math.floor(Math.random() * i) + 1;
        this.SwapBars(i, swapPos);
      }
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

export { Bar, BarChart };
