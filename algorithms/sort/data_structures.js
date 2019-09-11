class Bar {
  constructor(x, y, width, height, color = 'black') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class BarChart {
  constructor(numOfBars = '50') {
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
    // console.log(i, j);

    let tmpBar = this.bars[i];
    this.bars[i] = this.bars[j];
    this.bars[j] = tmpBar;

    let tmpX = this.bars[i].x;
    this.bars[i].x = this.bars[j].x;
    this.bars[j].x = tmpX;
  }

  Insert(bar) {
    if (bar !== null) {
      this.bars.push(bar);
    }
  }

  Update(bars) {
    if (bars.length > 0) {
      this.bars = [];

      for (let i = 0; i < bars.length; i++) {
        this.bars = [...this.bars, ...bars[i]];
      }
      // console.log(this.bars);
    }
  }
}

class BarChartGrid {
  constructor(bgColor = 'transparent') {
    this.bgColor = bgColor;
  }

  // Initializes Grid and Bar elements in Bar Chart
  InitWith(bc) {
    const cnv = document.getElementById('cnv');
    cnv.width = window.innerWidth * 0.94;
    cnv.height = window.innerWidth * 0.94;
    cnv.style.backgroundColor = this.bgColor;

    if (cnv.getContext) {
      const pad = cnv.width / (bc.numOfBars * bc.numOfBars);
      const dx = cnv.width / bc.numOfBars - pad;
      let posX = pad;

      for (let i = 0; i < bc.numOfBars; i++) {
        let height = Math.random() * cnv.height * 0.9 + cnv.height * 0.05;
        bc.Insert(
          new Bar(posX, cnv.height - height, dx, height, bc.neutralColor)
        );
        posX += dx + pad;
      }
      this.Draw(bc);
    } else {
      alert('Canvas not available on your browser.');
      return;
    }
  }

  Clear() {
    const cnv = document.getElementById('cnv');
    const ctx = cnv.getContext('2d');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  }

  Draw(bc) {
    const cnv = document.getElementById('cnv');
    const ctx = cnv.getContext('2d');

    for (let i = 0; i < bc.numOfBars; i++) {
      ctx.fillStyle = bc.bars[i].color;
      ctx.fillRect(
        bc.bars[i].x,
        bc.bars[i].y,
        bc.bars[i].width,
        bc.bars[i].height
      );
    }
  }
}

export { Bar, BarChart, BarChartGrid };
