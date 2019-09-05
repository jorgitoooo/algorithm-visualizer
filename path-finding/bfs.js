// Global variables
let nodes = [];
const numOfNodesPerRow = 30;
const size = numOfNodesPerRow - 1;
// const wallColor = '#3c3c3c';
const wallColor = '#000';
const cnvColor = wallColor;
const srcColor = '#ff5a5f';
// const visitedColor = '#087e8b';
// const visitedColor = '#8469ad';
const visitedColor = '#0baabc';
// const destColor = '#44991b';
const destColor = srcColor;
// const destFoundColor = '#fcaa67';
const destFoundColor = '#ff262d';
/***************************************************/
// import Node from '../graph/node';
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
/******************************************************************/
(function initCanvas() {
  const canvas = document.getElementById('cnv');
  canvas.style.backgroundColor = cnvColor;
  canvas.width = window.innerWidth * 0.94;
  canvas.height = window.innerWidth * 0.94;
  // canvas.style.padding = '2.5px';
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
      let color = 'rgb(255,255,255)';
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
})();

function colorGrid() {
  const canvas = document.getElementById('cnv');
  const ctx = canvas.getContext('2d');

  nodes.forEach(nodesRow =>
    nodesRow.forEach(node => {
      ctx.fillStyle = node.color;
      ctx.fillRect(...node.GetCoordsAndDim());
    })
  );
}
// let count = 0;
// function bfs(source, destination) {
//   let { x, y } = source;

//   nodes[y][x].wasVisited = true;
//   nodes[y][x].color = '#00b300';

//   nodes[destination.y][destination.x].color = '#4ff4a2';

//   let adjList = getAdjacentVertices(x, y);
//   // let tmpList = [...adjList];

//   // Loop through all adjacent vertices
//   // while (adjList.length > 0) {
//   while (count++ < 300 && adjList.length > 0) {
//     // if (count > 100) break;
//     setTimeout(() => {
//       // tmpList.shift();

//       let coords = adjList.shift();
//       let [adjX, adjY] = coords;

//       if (!nodes[adjY][adjX].isWall) {
//         let tmpAdjList = getAdjacentVertices(adjX, adjY);
//         // adjList.concat(tmpAdjList);
//         adjList = [...adjList, ...tmpAdjList];
//         // tmpList = [...tmpList, ...tmpAdjList];
//         // console.log(tmpList);
//         nodes[adjY][adjX].color = '#587';
//         nodes[adjY][adjX].wasVisited = true;
//       }

//       colorGrid();
//     }, 1000);
//   }
// }

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

  if (!start || progress > 30) {
    start = timestamp;

    if (adjList.length > 0) {
      coords = adjList.shift();
      [adjX, adjY] = coords;

      if (!nodes[adjY][adjX].isWall) {
        let tmpAdjList = getAdjacentVertices(adjX, adjY);

        adjList = [...adjList, ...tmpAdjList];
        removeDuplicates();

        if (adjX === destination.x && adjY === destination.y)
          nodes[adjY][adjX].color = destFoundColor;
        else nodes[adjY][adjX].color = visitedColor;
        nodes[adjY][adjX].wasVisited = true;
      }
      colorGrid();
    }
  }
  stopId = requestAnimationFrame(bfsAnimate);
  if (adjX == destination.x && adjY == destination.y) {
    console.log(stopId);
    cancelAnimationFrame(stopId);
  }
}

stopId = requestAnimationFrame(bfsAnimate);

function removeDuplicates() {
  // Split array of coordinates into x & y ordinate arrays
  let xCoords = adjList.map(coord => coord[0]);
  let yCoords = adjList.map(coord => coord[1]);

  // Used to map ordinates value to index
  let xDup = {};

  xCoords.forEach((x, idx) => {
    if (xDup[x]) xDup[x] = [...xDup[x], idx];
    else xDup[x] = [idx];
  });

  // Used to tag potential duplicates
  let pDups = {};

  // Used to save duplicate indices
  let dupIndices = [];

  // Retrieve duplicates
  for (let x in xDup) {
    if (xDup[x].length > 1) {
      xDup[x].forEach(idx => {
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
  dupIndices.forEach(idx => adjList.splice(idx, 1));
}
