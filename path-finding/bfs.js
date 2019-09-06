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
  getAdjacentVertices(x, y) {
    let adjList = [];

    if (x == 0) {
      if (y == 0) {
        adjList = [[x + 1, y], [x + 1, y + 1], [x, y + 1]];
      } else if (y == this.size) {
        adjList = [[x + 1, y], [x + 1, y - 1], [x, y - 1]];
      } else {
        adjList = [
          [x + 1, y],
          [x + 1, y + 1],
          [x + 1, y - 1],
          [x, y - 1],
          [x, y + 1]
        ];
      }
    } else if (y == 0) {
      if (x == this.size) {
        adjList = [[x - 1, y], [x - 1, y + 1], [x, y + 1]];
      } else {
        adjList = [
          [x + 1, y],
          [x - 1, y],
          [x - 1, y + 1],
          [x + 1, y + 1],
          [x, y + 1]
        ];
      }
    } else if (x == this.size) {
      if (y == this.size) {
        adjList = [[x - 1, y], [x - 1, y - 1], [x, y - 1]];
      } else {
        adjList = [
          [x - 1, y],
          [x - 1, y + 1],
          [x - 1, y - 1],
          [x, y - 1],
          [x, y + 1]
        ];
      }
    } else if (y == this.size) {
      adjList = [
        [x + 1, y],
        [x - 1, y],
        [x - 1, y - 1],
        [x + 1, y - 1],
        [x, y - 1]
      ];
    } else {
      adjList = [
        [x + 1, y],
        [x - 1, y],
        [x - 1, y + 1],
        [x + 1, y + 1],
        [x - 1, y - 1],
        [x + 1, y - 1],
        [x, y - 1],
        [x, y + 1]
      ];
    }
    return this.unvisitedVerticesIn(adjList);
  }
  unvisitedVerticesIn(adjList) {
    return adjList.filter(
      coords =>
        !this.nodes[coords[1]][coords[0]].wasVisited &&
        !this.nodes[coords[1]][coords[0]].isWall
    );
  }
}
/******************************************************/
// Graph construction
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
  colorGrid();
})();

function colorGrid() {
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

function clearGrid() {
  const canvas = document.getElementById('cnv');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/********************************************************/
let { x, y } = g.source;

g.nodes[y][x].wasVisited = true;
g.nodes[y][x].isWall = false;
g.nodes[y][x].color = g.srcColor;

g.nodes[g.destination.y][g.destination.x].color = g.destColor;
g.nodes[g.destination.y][g.destination.x].isWall = false;

let adjList = g.getAdjacentVertices(x, y);
let coords = [];
let adjX = [],
  adjY = [];
let reachable = true;

let start = null;
let stopId;

function bfsAnimate(timestamp) {
  let progress = timestamp - start;

  if (!start || progress > progressLimit) {
    start = timestamp;

    if (adjList.length > 0) {
      coords = adjList.shift();
      [adjX, adjY] = coords;

      if (!g.nodes[adjY][adjX].isWall) {
        let tmpAdjList = g.getAdjacentVertices(adjX, adjY);

        adjList = [...adjList, ...tmpAdjList];

        // Removes any duplicates that adjList may have
        removeDuplicates();

        if (adjX === g.destination.x && adjY === g.destination.y) {
          g.nodes[adjY][adjX].color = g.destFoundColor;
        } else {
          g.nodes[adjY][adjX].color = g.visitedColor;
        }

        g.nodes[adjY][adjX].wasVisited = true;
      }
      clearGrid();
      colorGrid();
    }
  }

  stopId = requestAnimationFrame(bfsAnimate);

  if (
    adjList.length < 1 ||
    (adjX == g.destination.x && adjY == g.destination.y)
  ) {
    cancelAnimationFrame(stopId);
  }
}

setTimeout(() => (stopId = requestAnimationFrame(bfsAnimate)), 500);

// Removes duplicates from coordinates array
function removeDuplicates() {
  // Split array of coordinates into x- & y- coordinate arrays
  let xCoords = adjList.map(coord => coord[0]);
  let yCoords = adjList.map(coord => coord[1]);

  // Used to map ordinate's value to indices
  let xMap = {};

  xCoords.forEach((x, idx) => {
    if (xMap[x]) xMap[x] = [...xMap[x], idx];
    else xMap[x] = [idx];
  });

  // Used to tag potential duplicates
  let pDups = {};

  // Used to save duplicates' indices
  let dupIndices = [];

  // Retrieve duplicates
  for (let x in xMap) {
    if (xMap[x].length > 1) {
      xMap[x].forEach(idx => {
        if (yCoords[idx] in pDups) {
          dupIndices = [...dupIndices, idx];
        } else {
          pDups[yCoords[idx]] = idx;
        }
      });
    }
    pDups = {};
  }

  // Sorting from largest to smallest lets us splice duplicates
  // | in decreasing order of indices. This lets us modify array
  // | w/o modifying the indices of previous coordinates
  dupIndices.sort((el1, el2) => el1 < el2);

  // Remove duplicates
  dupIndices.forEach(idx => adjList.splice(idx, 1));
}
