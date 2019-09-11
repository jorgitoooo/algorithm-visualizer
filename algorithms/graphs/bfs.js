export default (g, grid) => {
  return new Promise((resolve, reject) => {
    /****************** Global variables ******************/
    // Speed of graph traversal
    const progressLimit = 30;
    /******************************************************/
    // Initialize grid with graph
    grid.InitWith(g);
    /********************************************************/
    let { x, y } = g.source;

    g.nodes[y][x].wasVisited = true;
    g.nodes[y][x].isWall = false;
    g.nodes[y][x].color = g.srcColor;

    g.nodes[g.destination.y][g.destination.x].color = g.destColor;
    g.nodes[g.destination.y][g.destination.x].isWall = false;

    let adjList = g.GetAdjacentNodes(x, y);
    let coords = [];
    let adjX = [],
      adjY = [];

    let start = null;
    let stopId;

    function bfsAnimation(timestamp) {
      let progress = timestamp - start;

      if (!start || progress > progressLimit) {
        start = timestamp;

        if (adjList.length > 0) {
          coords = adjList.shift();
          [adjX, adjY] = coords;

          if (!g.nodes[adjY][adjX].isWall) {
            let tmpAdjList = g.GetAdjacentNodes(adjX, adjY);

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
          grid.Clear();
          grid.Color(g);
        }
      }

      stopId = requestAnimationFrame(bfsAnimation);

      if (
        adjList.length < 1 ||
        (adjX == g.destination.x && adjY == g.destination.y)
      ) {
        cancelAnimationFrame(stopId);

        setTimeout(() => {
          grid.Clear();
          resolve();
        }, 1500);
      }
    }

    setTimeout(() => (stopId = requestAnimationFrame(bfsAnimation)), 500);

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
  });
};
