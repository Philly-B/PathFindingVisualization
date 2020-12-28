import { PriorityQueue } from '../utils/PriorityQueue';
import { StartNotDefinedError } from '../errors/AlgorithmErrors';
import {
  END_FIELD_ID,
  IN_CONSIDERATION_FIELD_ID,
  START_FIELD_ID,
  VISITED_FIELD_ID,
  WALL_FIELD_ID,
} from '../constants/AlgorithmConstants';
import { RowColumnPair } from '../model/RowColumnPair';
import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm } from './AbstractAlgorithm';

export class AStarAlgorithm extends AbstractAlgorithm {
  private start: RowColumnPair;
  private end: RowColumnPair;
  private queue: PriorityQueue<PrioritizedGraphCell>;

  finished = false;
  result: RowColumnPair[] = [];

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);

    this.start = this.getElementWithConstraint(START_FIELD_ID);
    this.end = this.getElementWithConstraint(END_FIELD_ID);
    this.queue = new PriorityQueue<PrioritizedGraphCell>(this.prioritizedGraphCellComparator);
    this.queue.pushElement(
      new PrioritizedGraphCell(
        this.start,
        this.calculateDistanceOfTwoCells(this.start.row, this.start.column, this.end)
      )
    );
  }

  public continueAlgorithm(): void {
    // TODO there should be a difference / we want to know if there is no path!
    if (this.queue.isEmpty() || this.finished) {
      this.finished = true;
      return;
    }

    while (!this.queue.isEmpty()) {
      const currElement = this.queue.popElement();
      if (RowColumnPair.equals(currElement.rowAndColumn, this.end)) {
        this.finished = true;
        this.result = this.createReversePath(currElement);
        return;
      }
      if (this.graph[currElement.rowAndColumn.row][currElement.rowAndColumn.column] === VISITED_FIELD_ID) {
        continue;
      }
      this.setValueToGraphCell(currElement.rowAndColumn, VISITED_FIELD_ID);
      this.checkNeighbors(currElement);
      break;
    }
  }

  private setValueToGraphCell(rowCol: RowColumnPair, newValue: number): void {
    this.graph[rowCol.row][rowCol.column] = newValue;
    this.graphIterationCallback(RowColumnPair.copy(rowCol), newValue);
  }

  private checkNeighbors(currElement: PrioritizedGraphCell) {
    const row = currElement.rowAndColumn.row;
    const col = currElement.rowAndColumn.column;
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

        if (this.isValidCell(rowOfNeigh, colOfNeigh)) {
          if (
            this.graph[rowOfNeigh][colOfNeigh] === IN_CONSIDERATION_FIELD_ID ||
            this.graph[rowOfNeigh][colOfNeigh] === VISITED_FIELD_ID
          ) {
            continue;
          }
          const newLocal = new RowColumnPair(rowOfNeigh, colOfNeigh);
          this.setValueToGraphCell(newLocal, IN_CONSIDERATION_FIELD_ID);

          this.queue.pushElement(
            new PrioritizedGraphCell(
              newLocal,
              this.calculateDistanceOfTwoCells(rowOfNeigh, colOfNeigh, this.end),
              currElement
            )
          );
        }
      }
    }
  }

  private isValidCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.graph.length &&
      col >= 0 &&
      col < this.graph[row].length &&
      this.graph[row][col] !== WALL_FIELD_ID
    );
  }

  private createReversePath(node: PrioritizedGraphCell): RowColumnPair[] {
    if (node.cameFrom === undefined) {
      return [];
    }
    const restOfPath = this.createReversePath(node.cameFrom);
    restOfPath.push(node.rowAndColumn);
    return restOfPath;
  }

  private getElementWithConstraint(constraint: number): RowColumnPair {
    for (let row = 0; row < super.graph.length; row++) {
      for (let col = 0; col < super.graph[row].length; col++) {
        if (super.graph[row][col] === constraint) {
          return new RowColumnPair(row, col);
        }
      }
    }
    throw new StartNotDefinedError();
  }

  private prioritizedGraphCellComparator(cell1: PrioritizedGraphCell, cell2: PrioritizedGraphCell): number {
    return cell1.priority - cell2.priority;
  }
  private calculateDistanceOfTwoCells(currentRow: number, currentCol: number, cell2: RowColumnPair) {
    return Math.sqrt(Math.pow(currentRow - cell2.row, 2) + Math.pow(currentCol - cell2.column, 2));
  }
}

class PrioritizedGraphCell {
  constructor(public rowAndColumn: RowColumnPair, public priority: number, public cameFrom?: PrioritizedGraphCell) {}
}
