import { Injectable } from '@angular/core';
import { PASSABLE_FIELD_ID } from '../constants/AlgorithmConstants';
import { GraphCell, GraphCellConstraint } from '../model/GraphCell';

@Injectable({
  providedIn: 'root',
})
export class GraphUtilService {
  constructor() { }

  initGraph = (N: number): GraphCell[][] => {
    return this.create2dArray(N, (row, col) => new GraphCell(row, col));
  };

  initGraphForAlgorithm = (N: number): number[][] => {
    return this.create2dArray(N, (row, col) => PASSABLE_FIELD_ID);
  };

  private create2dArray<T>(N: number, arrayFiller: (row: number, col: number) => T): T[][] {

    const graph: T[][] = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      const sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
      for (let col = 0; col < sizeOfNForRow; col++) {
        currRow.push(arrayFiller(row, col));
      }
      graph.push(currRow);
    }
    return graph;
  }

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
