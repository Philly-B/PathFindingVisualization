import { Injectable } from '@angular/core';
import { Hexagon } from '../path-finder/model/Hexagon';
import { RowColumnPair } from '../path-finder/model/RowColumnPair';

@Injectable({
  providedIn: 'root',
})
export class GraphUtilService {
  constructor() {}

  initGraph = (N: number): Hexagon[][] => {
    const graph = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      for (let col = 0; col < N; col++) {
        currRow.push(new Hexagon(undefined, row, col));
      }
      graph.push(currRow);
    }
    return graph;
  };

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
