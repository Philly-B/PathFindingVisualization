import { Injectable } from '@angular/core';
import { PASSABLE_FIELD_ID } from '../constants/AlgorithmConstants';
import { GraphCell, GraphCellConstraint } from '../model/GraphCell';
import { RowColumnPair } from '../model/RowColumnPair';

@Injectable({
  providedIn: 'root',
})
export class GraphUtilService {
  constructor() {}

  initGraph = (N: number): GraphCell[][] => {
    const graph: GraphCell[][] = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      const sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
      for (let col = 0; col < sizeOfNForRow; col++) {
        currRow.push(new GraphCell(row, col));
      }
      graph.push(currRow);
    }
    return graph;
  };

  initGraphForAlgorithm = (N: number): number[][] => {
    const graph: number[][] = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      const sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
      for (let col = 0; col < sizeOfNForRow; col++) {
        currRow.push(PASSABLE_FIELD_ID);
      }
      graph.push(currRow);
    }
    return graph;
  };

  getAllWalls = (graph: GraphCell[][]): RowColumnPair[] => {
    const walls = [];

    this.doSomethingForEveryHex(
      graph,
      (hexagon) => walls.push(new RowColumnPair(hexagon.row, hexagon.column)),
      (hexagon) => hexagon.graphCellConstraint === GraphCellConstraint.WALL
    );

    return walls;
  };

  setGraphConstraintOfGraphCell = (
    graph: GraphCell[][],
    oldValue: GraphCellConstraint,
    newValue: GraphCellConstraint
  ): void => {
    this.doSomethingForEveryHex(
      graph,
      (hexagon) => (hexagon.graphCellConstraint = newValue),
      (hexagon) => hexagon.graphCellConstraint === oldValue
    );
  };

  private doSomethingForEveryHex = (
    graph: GraphCell[][],
    hexagonConsumer: (hexagon: GraphCell) => void,
    hexagonFilter?: (hexagon: GraphCell) => boolean
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
