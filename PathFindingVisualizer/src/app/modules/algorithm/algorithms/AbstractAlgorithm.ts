import {
  END_FIELD_ID,
  IN_CONSIDERATION_FIELD_ID,
  START_FIELD_ID,
  VISITED_FIELD_ID,
  WALL_FIELD_ID,
} from 'src/app/constants/AlgorithmConstants';
import { EndNotDefinedError, StartNotDefinedError } from 'src/app/errors/AlgorithmErrors';
import { BaseError } from 'src/app/errors/BaseError';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { AlgorithmOptions } from './AlgorithmOptions';

export abstract class AbstractAlgorithm {
  protected start: RowColumnPair;
  protected end: RowColumnPair;

  finished = false;
  result: RowColumnPair[] = [];

  constructor(
    protected graph: number[][],
    protected options: AlgorithmOptions,
    protected graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) { }

  public initialize(): void {
    this.start = this.getElementWithConstraint(START_FIELD_ID, () => new StartNotDefinedError());
    this.end = this.getElementWithConstraint(END_FIELD_ID, () => new EndNotDefinedError());

    this.initializeImpl();
  }

  abstract initializeImpl(): void;

  abstract continueAlgorithm(): void;

  protected getElementWithConstraint(constraint: number, errorSupplier: () => BaseError): RowColumnPair {
    for (let row = 0; row < this.graph.length; row++) {
      for (let col = 0; col < this.graph[row].length; col++) {
        if (this.graph[row][col] === constraint) {
          return new RowColumnPair(row, col);
        }
      }
    }
    throw errorSupplier();
  }

  protected isValidCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.graph.length &&
      col >= 0 &&
      col < this.graph[row].length &&
      this.graph[row][col] !== WALL_FIELD_ID
    );
  }

  protected getAllUnvisitedNeighbors(currElement: RowColumnPair) {
    const allNeigh = this.getAllNeighborsWithSkipCondition(
      currElement,
      (row, col) => this.graph[row][col] === VISITED_FIELD_ID
    );
    allNeigh.forEach((neigh) => this.setValueToGraphCell(neigh, IN_CONSIDERATION_FIELD_ID));
    return allNeigh;
  }

  protected getAllUnvisitedNotConsideredNeighbors(currElement: RowColumnPair) {
    const shouldSkipCell = (row: number, col: number): boolean =>
      this.graph[row][col] === IN_CONSIDERATION_FIELD_ID || this.graph[row][col] === VISITED_FIELD_ID;
    const allNeigh = this.getAllNeighborsWithSkipCondition(currElement, shouldSkipCell);
    allNeigh.forEach((neigh) => this.setValueToGraphCell(neigh, IN_CONSIDERATION_FIELD_ID));
    return allNeigh;
  }

  private getAllNeighborsWithSkipCondition(
    currElement: RowColumnPair,
    skipConditon: (row: number, col: number) => boolean
  ): RowColumnPair[] {
    const neighbors: RowColumnPair[] = [];
    const row = currElement.row;
    const col = currElement.column;
    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
      let colDeltaStart: number;
      let colDeltaEnd: number;
      if (rowDelta === 0) {
        colDeltaStart = -1;
        colDeltaEnd = 1;
      } else {
        colDeltaStart = row % 2 === 1 ? 0 : -1;
        colDeltaEnd = row % 2 === 1 ? 1 : 0;
      }

      for (let colDelta = colDeltaStart; colDelta <= colDeltaEnd; colDelta++) {
        const rowOfNeigh = row + rowDelta;
        const colOfNeigh = col + colDelta;

        if (this.isValidCell(rowOfNeigh, colOfNeigh) && !skipConditon(rowOfNeigh, colOfNeigh)) {
          neighbors.push(new RowColumnPair(rowOfNeigh, colOfNeigh));
        }
      }
    }
    return neighbors;
  }

  protected setValueToGraphCell(rowCol: RowColumnPair, newValue: number): void {
    this.graph[rowCol.row][rowCol.column] = newValue;
    this.graphIterationCallback(RowColumnPair.copy(rowCol), newValue);
  }

  protected createReversePath(node: CurrentPathElement): RowColumnPair[] {
    if (node.cameFrom === undefined) {
      return [];
    }
    const restOfPath = this.createReversePath(node.cameFrom);
    restOfPath.push(node.rowAndColumn);
    return restOfPath;
  }

  protected getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}

export class CurrentPathElement {
  constructor(public rowAndColumn: RowColumnPair, public cameFrom?: CurrentPathElement) { }
}
