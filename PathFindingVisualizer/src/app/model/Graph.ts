import { GraphCell } from './GraphCell';

export class Graph {
  grid: GraphCell[][];

  constructor(grid: GraphCell[][]) {
    this.grid = grid;
  }
}
