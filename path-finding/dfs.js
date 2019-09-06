// import Node from '../graph/node';
/****************** Global variables ******************/
// Speed of graph traversal
const progressLimit = 30;

// Colors
const cnvColor = '#fff';
/******************************************************/
class Node {
  constructor(x, y, width, height, color, isWall) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isWall = isWall;
    this.color = isWall ? cnvColor : color;
    this.wasVisited = false;
  }

  GetCoordsAndDim() {
    return [this.x, this.y, this.width, this.height];
  }
}
class Graph {
  constructor() {
    this.wallColor = '#fff';
    this.srcColor = '#ff5a5f';
    this.visitedColor = '#0baabc';
    this.destColor = this.srcColor;
    this.destFoundColor = '#ff262d';

    this.nodes = [];
    this.numOfNodesPerRow = 20;
    this.size = this.numOfNodesPerRow - 1;

    this.source = {
      x: Math.floor(Math.random() * this.numOfNodesPerRow),
      y: Math.floor(Math.random() * this.numOfNodesPerRow)
    };
    this.destination = {
      x: Math.floor(Math.random() * this.numOfNodesPerRow),
      y: Math.floor(Math.random() * this.numOfNodesPerRow)
    };
  }
  getNextUnvisitedVertex(x, y) {
    // console.log(`(${x},${y})`);

    // Checks if vertices to the right of (x,y) are available/unvisited
    if (x + 1 < this.numOfNodesPerRow) {
      if (!this.nodes[y][x + 1].wasVisited && !this.nodes[y][x + 1].isWall) {
        // console.log(`(x+1,y) => (${x + 1},${y})`);
        return [x + 1, y];
      }
      if (y + 1 < this.numOfNodesPerRow) {
        if (
          !this.nodes[y + 1][x + 1].wasVisited &&
          !this.nodes[y + 1][x + 1].isWall
        ) {
          // console.log(`(x+1,y+1) => (${x + 1},${y + 1})`);
          return [x + 1, y + 1];
        }
      }
      if (y - 1 >= 0) {
        if (
          !this.nodes[y - 1][x + 1].wasVisited &&
          !this.nodes[y - 1][x + 1].isWall
        ) {
          // console.log(`(x+1,y-1) => (${x + 1},${y - 1})`);
          return [x + 1, y - 1];
        }
      }
      // console.log('In x + 1');
    }

    // Checks if vertices to the left of (x,y) are available/unvisited
    if (x - 1 >= 0) {
      if (!this.nodes[y][x - 1].wasVisited && !this.nodes[y][x - 1].isWall) {
        // console.log(`(x-1,y) => (${x - 1},${y})`);
        return [x - 1, y];
      }
      if (y + 1 < this.numOfNodesPerRow) {
        if (
          !this.nodes[y + 1][x - 1].wasVisited &&
          !this.nodes[y + 1][x - 1].isWall
        ) {
          // console.log(`(x-1,y+1) => (${x - 1},${y + 1})`);
          return [x - 1, y + 1];
        }
      }
      if (y - 1 >= 0) {
        if (
          !this.nodes[y - 1][x - 1].wasVisited &&
          !this.nodes[y - 1][x - 1].isWall
        ) {
          // console.log(`(x-1,y-1) => (${x - 1},${y - 1})`);
          return [x - 1, y - 1];
        }
      }
      // console.log('In x - 1');
    }

    // Checks if vertices above (x,y) are available/unvisited
    if (
      y - 1 >= 0 &&
      !this.nodes[y - 1][x].wasVisited &&
      !this.nodes[y - 1][x].isWall
    ) {
      // console.log(`(x,y-1) => (${x},${y - 1})`);
      return [x, y - 1];
    }

    // Checks if vertices below (x,y) are available/unvisited
    if (
      y + 1 < this.numOfNodesPerRow &&
      !this.nodes[y + 1][x].wasVisited &&
      !this.nodes[y + 1][x].isWall
    ) {
      // console.log(`(x,y+1) => (${x},${y + 1})`);
      return [x, y + 1];
    }

    // console.log(`-1`);
    return -1;
  }
}
class Grid {
  constructor() {}
  Color(g) {
    const canvas = document.getElementById('cnv');
    const ctx = canvas.getContext('2d');

    g.nodes.forEach(nodesRow =>
      nodesRow.forEach(node => {
        ctx.fillStyle = node.color;

        // Displays nodes as circles
        // ctx.strokeStyle = node.color;
        // ctx.beginPath();
        // ctx.arc(
        //   node.x + node.width / 2,
        //   node.y + node.width / 2,
        //   node.width / 2,
        //   0,
        //   2 * Math.PI
        // );
        // ctx.stroke();
        // ctx.fill();

        // Displays nodes as squares
        ctx.fillRect(...node.GetCoordsAndDim());
      })
    );
  }

  Clear() {
    const canvas = document.getElementById('cnv');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
/******************************************************/
// Graph construction
const grid = new Grid();
const g = new Graph();

(function initCanvas() {
  const canvas = document.getElementById('cnv');
  canvas.style.backgroundColor = cnvColor;
  canvas.width = window.innerWidth * 0.94;
  canvas.height = window.innerWidth * 0.94;
  canvas.style.padding = `${canvas.width * 0.00625}px`;

  if (canvas.getContext) {
    const pad = canvas.width / 100;

    const dX = canvas.width / g.numOfNodesPerRow;
    const dY = canvas.height / g.numOfNodesPerRow;

    let posX = pad;
    let posY = pad;

    const nodeWidth = dX - 2 * pad;
    const nodeheight = dY - 2 * pad;

    // Initialize graph
    for (let i = 0; i < g.numOfNodesPerRow; i++) {
      g.nodes[i] = [];

      let color = 'rgb(0,0,0)';
      for (let j = 0; j < g.numOfNodesPerRow; j++) {
        const isWall = Math.floor(Math.random() * 2);
        g.nodes[i] = [
          ...g.nodes[i],
          new Node(posX, posY, nodeWidth, nodeheight, color, isWall)
        ];
        posX += dX;
      }
      posX = pad;
      posY += dY;
    }
  } else {
    alert('Canvas visualization unsupported by your browser =[');
    return;
  }
  grid.Color(g);
})();

/********************************************************/
// Source vertex coordinates
let { x, y } = g.source;

// Destination vertex coordinates
let [destX, destY] = [g.destination.x, g.destination.y];

// Marks source vertex as visited
g.nodes[y][x].wasVisited = true;
g.nodes[y][x].isWall = false;
g.nodes[y][x].color = g.srcColor;

g.nodes[destY][destX].color = g.destColor;
g.nodes[destY][destX].isWall = false;

let vertexStack = [[x, y]];
let adjX, adjY;
// let reachable = true;

let start = null;
let stopId;

function dfsAnimate(timestamp) {
  let progress = timestamp - start;

  if (!start || progress > progressLimit) {
    start = timestamp;

    if (vertexStack.length > 0) {
      // Get coordinates at the top of the stack
      [adjX, adjY] = vertexStack[vertexStack.length - 1];

      let tmpCoords = g.getNextUnvisitedVertex(adjX, adjY);
      if (adjX != x || adjY != y) {
        g.nodes[adjY][adjX].color = g.visitedColor;
        g.nodes[adjY][adjX].wasVisited = true;
      }
      //
      if (tmpCoords === -1) vertexStack.pop();
      else vertexStack.push(tmpCoords);

      if (adjX === destX && adjY === destY) {
        g.nodes[adjY][adjX].color = g.destFoundColor;
      }

      grid.Clear();
      grid.Color(g);
    }
  }

  stopId = requestAnimationFrame(dfsAnimate);

  if (vertexStack.length < 1 || (adjX == destX && adjY == destY)) {
    cancelAnimationFrame(stopId);
  }
}

setTimeout(() => (stopId = requestAnimationFrame(dfsAnimate)), 500);
