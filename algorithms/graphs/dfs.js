export default (g, grid) => {
  return new Promise((resolve, reject) => {
    /****************** Global variables ******************/
    // Speed of graph traversal
    const progressLimit = 30;
    /******************************************************/
    // Initialize grid with graph
    grid.InitWith(g);
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

    let start = null;
    let stopId;

    function dfsAnimation(timestamp) {
      let progress = timestamp - start;

      if (!start || progress > progressLimit) {
        start = timestamp;

        if (vertexStack.length > 0) {
          // Get coordinates at the top of the stack
          [adjX, adjY] = vertexStack[vertexStack.length - 1];

          let tmpCoords = g.GetNextUnvisitedVertex(adjX, adjY);
          if (adjX != x || adjY != y) {
            g.nodes[adjY][adjX].color = g.visitedColor;
            g.nodes[adjY][adjX].wasVisited = true;
          }

          if (tmpCoords === -1) vertexStack.pop();
          else vertexStack.push(tmpCoords);

          if (adjX === destX && adjY === destY) {
            g.nodes[adjY][adjX].color = g.destFoundColor;
          }

          grid.Clear();
          grid.Color(g);
        }
      }

      stopId = requestAnimationFrame(dfsAnimation);

      if (vertexStack.length < 1 || (adjX == destX && adjY == destY)) {
        cancelAnimationFrame(stopId);

        setTimeout(() => {
          grid.Clear();
          resolve();
        }, 1500);
      }
    }

    setTimeout(() => (stopId = requestAnimationFrame(dfsAnimation)), 500);
  });
};
