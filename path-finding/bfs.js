// import Node from '../graph/node';
/****************** Global variables ******************/
// Speed of graph traversal
const progressLimit = 30;

// Node properties
let nodes = [];
const numOfNodesPerRow = 20;
const size = numOfNodesPerRow - 1;

// Colors
const wallColor = '#fff';
const cnvColor = wallColor;
const srcColor = '#ff5a5f';
const visitedColor = '#0baabc';
const destColor = srcColor;
const destFoundColor = '#ff262d';
/******************************************************/
class Node {
  constructor(x, y, width, height, color, isWall) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isWall = isWall;
    this.color = isWall ? wallColor : color;
    this.wasVisited = false;
  }

  GetCoordsAndDim() {
    return [this.x, this.y, this.width, this.height];
  }
}
/******************************************************/
function getAdjacentVertices(x, y) {
  let adjList = [];

  if (x == 0) {
    if (y == 0) {
      adjList = [[x + 1, y], [x + 1, y + 1], [x, y + 1]];
    } else if (y == size) {
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
    if (x == size) {
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
  } else if (x == size) {
    if (y == size) {
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
  } else if (y == size) {
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
  return unvisitedVerticesIn(adjList);
}
function unvisitedVerticesIn(adjList) {
  return adjList.filter(
    coords =>
      !nodes[coords[1]][coords[0]].wasVisited &&
      !nodes[coords[1]][coords[0]].isWall
  );
}
/******************************************************/
(function initCanvas() {
  const canvas = document.getElementById('cnv');
  canvas.style.backgroundColor = cnvColor;
  canvas.width = window.innerWidth * 0.94;
  canvas.height = window.innerWidth * 0.94;
  canvas.style.padding = `${canvas.width * 0.00625}px`;

  if (canvas.getContext) {
    const pad = canvas.width / 100;

    const dX = canvas.width / numOfNodesPerRow;
    const dY = canvas.height / numOfNodesPerRow;

    let posX = pad;
    let posY = pad;

    const nodeWidth = dX - 2 * pad;
    const nodeheight = dY - 2 * pad;

    // Initialize graph
    for (let i = 0; i < numOfNodesPerRow; i++) {
      nodes[i] = [];

      let color = 'rgb(0,0,0)';
      for (let j = 0; j < numOfNodesPerRow; j++) {
        const isWall = Math.floor(Math.random() * 2);
        nodes[i] = [
          ...nodes[i],
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

  nodes.forEach(nodesRow =>
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
let source = {
  x: Math.floor(Math.random() * numOfNodesPerRow),
  y: Math.floor(Math.random() * numOfNodesPerRow)
};
let destination = {
  x: Math.floor(Math.random() * numOfNodesPerRow),
  y: Math.floor(Math.random() * numOfNodesPerRow)
};

let { x, y } = source;

nodes[y][x].wasVisited = true;
nodes[y][x].isWall = false;
nodes[y][x].color = srcColor;

nodes[destination.y][destination.x].color = destColor;
nodes[destination.y][destination.x].isWall = false;

let adjList = getAdjacentVertices(x, y);
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

      if (!nodes[adjY][adjX].isWall) {
        let tmpAdjList = getAdjacentVertices(adjX, adjY);

        adjList = [...adjList, ...tmpAdjList];

        // Removes any duplicates that adjList may have
        removeDuplicates();

        if (adjX === destination.x && adjY === destination.y)
          nodes[adjY][adjX].color = destFoundColor;
        else nodes[adjY][adjX].color = visitedColor;
        nodes[adjY][adjX].wasVisited = true;
      }
      clearGrid();
      colorGrid();
    }
  }

  stopId = requestAnimationFrame(bfsAnimate);

  if (adjList.length < 1 || (adjX == destination.x && adjY == destination.y)) {
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
