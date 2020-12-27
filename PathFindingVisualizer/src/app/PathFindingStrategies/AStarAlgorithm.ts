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

export class AStarAlgorithm {
  private start: RowColumnPair;
  private end: RowColumnPair;
  private queue: PriorityQueue<PrioritizedGraphCell>;

  finished = false;
  result: RowColumnPair[] = [];

  constructor(
    private graph: number[][],
    private options: AStarAlgorithmOptions,
    private graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    this.start = this.getElementWithConstraint(START_FIELD_ID);
    this.end = this.getElementWithConstraint(END_FIELD_ID);
    this.queue = new PriorityQueue<PrioritizedGraphCell>(this.prioritizedGraphCellComparator);
    this.queue.pushElement(
      new PrioritizedGraphCell(
        this.start,
        this.calculateManhattenDistanceOfTwoCells(this.start.row, this.start.column, this.end)
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

      this.checkNeighborToLeft(currElement);
      this.checkNeighborsSameColumnAndRight(currElement);
      break;
    }
  }

  private setValueToGraphCell(rowCol: RowColumnPair, newValue: number): void {
    this.graph[rowCol.row][rowCol.column] = newValue;
    this.graphIterationCallback(RowColumnPair.copy(rowCol), newValue);
  }

  private checkNeighborsSameColumnAndRight(currElement: PrioritizedGraphCell) {
    const row = currElement.rowAndColumn.row;
    const col = currElement.rowAndColumn.column;
    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
      const colDeltaStart = row % 2 === 1 ? 0 : -1;
      const colDeltaEnd = row % 2 === 1 ? 1 : 0;

      for (let colDelta = colDeltaStart; colDelta <= colDeltaEnd; colDelta++) {
        if (rowDelta === 0 && colDelta === 0) {
          continue;
        }
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
              this.calculateManhattenDistanceOfTwoCells(rowOfNeigh, colOfNeigh, this.end),
              currElement
            )
          );
        }
      }
    }
  }
  private checkNeighborToLeft(currElement: PrioritizedGraphCell) {
    const row = currElement.rowAndColumn.row;
    const col = currElement.rowAndColumn.column;
    const colOfNeigh = col - 1;
    if (this.isValidCell(currElement.rowAndColumn.row, colOfNeigh)) {
      if (
        this.graph[row][colOfNeigh] === IN_CONSIDERATION_FIELD_ID ||
        this.graph[row][colOfNeigh] === VISITED_FIELD_ID
      ) {
        return;
      }
      const newLocal = new RowColumnPair(row, colOfNeigh);
      this.setValueToGraphCell(newLocal, IN_CONSIDERATION_FIELD_ID);

      this.queue.pushElement(
        new PrioritizedGraphCell(
          newLocal,
          this.calculateManhattenDistanceOfTwoCells(row, colOfNeigh, this.end),
          currElement
        )
      );
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
    for (let row = 0; row < this.graph.length; row++) {
      for (let col = 0; col < this.graph[row].length; col++) {
        if (this.graph[row][col] === constraint) {
          return new RowColumnPair(row, col);
        }
      }
    }
    throw new StartNotDefinedError();
  }

  private prioritizedGraphCellComparator(cell1: PrioritizedGraphCell, cell2: PrioritizedGraphCell): number {
    return cell1.priority - cell2.priority;
  }
  private calculateManhattenDistanceOfTwoCells(currentRow: number, currentCol: number, cell2: RowColumnPair) {
    const colShiftCurr = currentRow % 2 === 1 ? 1 : 0;
    const colShiftCell2 = cell2.row % 2 === 1 ? 1 : 0;
    return Math.abs(currentRow - cell2.row) + Math.abs(currentCol + colShiftCurr - (cell2.column + colShiftCell2));
  }
}

export class AStarAlgorithmOptions {
  constructor(public algorithmSpeed: number) {}
}

class PrioritizedGraphCell {
  constructor(public rowAndColumn: RowColumnPair, public priority: number, public cameFrom?: PrioritizedGraphCell) {}
}
