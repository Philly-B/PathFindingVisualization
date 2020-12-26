import { Injectable } from '@angular/core';
import { GraphCell } from '../model/GraphCell';
import { Hexagon } from '../path-finder/visualisation-model/Hexagon';
import { RowColumnPair } from '../path-finder/visualisation-model/RowColumnPair';

@Injectable({
  providedIn: 'root',
})
export class GraphUtilService {
  constructor() {}

  initGraph = (N: number): GraphCell[][] => {
    return this.genericCreateGraph(N, (row, col) => new GraphCell(row, col));
  };

  initVisualisationGraph = (N: number): Hexagon[][] => {
    return this.genericCreateGraph(N, (row, col) => new Hexagon(undefined, row, col));
  };

  private genericCreateGraph<T>(N: number, objectCreator: (row: number, column: number) => T): T[][] {
    const graph = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      const sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
      for (let col = 0; col < sizeOfNForRow; col++) {
        currRow.push(objectCreator(row, col));
      }
      graph.push(currRow);
    }
    return graph;
  }

  getAllWalls = (graph: Hexagon[][]): RowColumnPair[] => {
    const walls = [];

    this.doSomethingForEveryHex(
      graph,
      (hexagon) => walls.push(new RowColumnPair(hexagon.row, hexagon.column)),
      (hexagon) => hexagon.isWall
    );

    return walls;
  };

  setFieldOfHexagon = (graph: Hexagon[][], fieldName: string, newValue: any): void => {
    this.doSomethingForEveryHex(graph, (hexagon) => (hexagon[fieldName] = newValue));
  };

  private doSomethingForEveryHex = (
    graph: Hexagon[][],
    hexagonConsumer: (hexagon: Hexagon) => void,
    hexagonFilter?: (hexagon: Hexagon) => boolean
  ): void => {
    for (const hexRow of graph) {
      for (const hexagon of hexRow) {
        if (hexagonFilter === undefined || hexagonFilter(hexagon)) {
          hexagonConsumer(hexagon);
        }
      }
    }
  };
}
