import {
  DijkstraGraph,
  GraphGrid,
  BarChart,
  BarChartGrid
} from './data_structures.js';
import bfs from './algorithms/graphs/bfs.js';
import dfs from './algorithms/graphs/dfs.js';
import dijkstra from './algorithms/graphs/dijkstra.js';
import insertionSort from './algorithms/sort/insertionsort.js';

window.onload = () => {
  async function display(algorithms, type) {
    while (true) {
      type %= algorithms.length;

      let dataStruct, grid;

      if (type < 3) {
        // Graph & grid construction
        dataStruct = new DijkstraGraph();
        grid = new GraphGrid();
      } else {
        // Bar chart & grid construction
        dataStruct = new BarChart();
        grid = new BarChartGrid();
      }

      await algorithms[type++](dataStruct, grid);
    }
  }
  const algorithms = [dijkstra, dfs, bfs, insertionSort];
  display(algorithms, 0);
};
