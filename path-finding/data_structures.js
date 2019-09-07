class Node {
  constructor(x, y, width, height, color, isWall) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isWall = isWall;
    this.color = isWall ? 'transparent' : color;
    this.wasVisited = false;
  }

  GetCoordsAndDim() {
    return [this.x, this.y, this.width, this.height];
  }
}

class DijkstraNode extends Node {
  constructor(x, y, width, height, color, isWall, prevNode = null) {
    super(x, y, width, height, color, isWall);
    this.prevNode = prevNode;
    this.distance = Infinity;
  }

  SetPrevNode(prevNode) {
    if (this.distance > prevNode.distance + 1) {
      this.distance = prevNode.distance + 1;
      this.prevNode = prevNode;
    }
  }

  GetCoords() {
    return [this.x, this.y];
  }

  GetPrevNodeCoords() {
    if (this.prevNode !== null) return [this.prevNode.x, this.prevNode.y];
  }
}

class Graph {
  constructor(numOfNodesPerRow = 25) {
    this.wallColor = '#fff';
    this.srcColor = '#ff5a5f';
    this.visitedColor = '#0baabc';
    this.destColor = this.srcColor;
    this.destFoundColor = '#ff262d';

    this.nodes = [];
    this.numOfNodesPerRow = numOfNodesPerRow;
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

  GetAdjacentNodes(x, y) {
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
    this.MarkDistances(adjList, x, y);
    return this.UnvisitedNodesIn(adjList);
  }
  UnvisitedNodesIn(adjList) {
    return adjList.filter(
      coords =>
        !this.nodes[coords[1]][coords[0]].wasVisited &&
        !this.nodes[coords[1]][coords[0]].isWall
    );
  }
  MarkDistances(adjList, x, y) {
    adjList.forEach(([adjX, adjY]) => {
      this.nodes[adjY][adjX].SetPrevNode(this.nodes[y][x]);
    });
  }

  GetNextUnvisitedVertex(x, y) {
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

class DijkstraGraph extends Graph {
  constructor() {
    super();
  }

  ColorShortestPath() {
    let curNode = this.nodes[this.destination.y][this.destination.x];
    let startNode = this.nodes[this.source.y][this.source.x];

    while (curNode.prevNode !== null && curNode.prevNode !== startNode) {
      curNode.prevNode.color = 'purple';
      curNode = curNode.prevNode;
    }
  }
}

// Operations for graph visuals
class GraphGrid {
  constructor(bgColor = 'transparent') {
    this.bgColor = bgColor;
  }

  // Initializes GraphGrid and Graph parameter
  InitWith(g) {
    const canvas = document.getElementById('cnv');
    canvas.style.backgroundColor = this.bgColor;
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
            new DijkstraNode(posX, posY, nodeWidth, nodeheight, color, isWall)
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
    this.Color(g);
  }
  Color(g, nodeShape = 'square') {
    const canvas = document.getElementById('cnv');
    const ctx = canvas.getContext('2d');

    g.nodes.forEach(nodesRow =>
      nodesRow.forEach(node => {
        ctx.fillStyle = node.color;

        // Displays nodes as circles
        if (nodeShape === 'circle') {
          ctx.strokeStyle = node.color;
          ctx.beginPath();
          ctx.arc(
            node.x + node.width / 2,
            node.y + node.width / 2,
            node.width / 2,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          ctx.fill();
        }
        // Displays nodes as squares
        else {
          ctx.fillRect(...node.GetCoordsAndDim());
        }
      })
    );
  }

  Clear() {
    const canvas = document.getElementById('cnv');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export { Node, DijkstraNode, Graph, DijkstraGraph, GraphGrid };
