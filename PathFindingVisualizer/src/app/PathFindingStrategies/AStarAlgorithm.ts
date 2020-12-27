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
  constructor() {}

  public runAlgorithm(graph: number[][], options: AStarAlgorithmOptions): RowColumnPair[] {
    const start = this.getElementWithConstraint(graph, START_FIELD_ID);
    const end = this.getElementWithConstraint(graph, END_FIELD_ID);

    const queue = new PriorityQueue<PrioritizedGraphCell>(this.prioritizedGraphCellComparator);
    queue.pushElement(
      new PrioritizedGraphCell(start, this.calculateManhattenDistanceOfTwoCells(start.row, start.column, end))
    );

    console.log('start', start);
    console.log('end', end);

    let lastNode: PrioritizedGraphCell;
    while (!queue.isEmpty()) {
      const currElement = queue.popElement();
      if (RowColumnPair.equals(currElement.rowAndColumn, end)) {
        lastNode = currElement;
        break;
      }
      if (graph[currElement.rowAndColumn.row][currElement.rowAndColumn.column] === VISITED_FIELD_ID) {
        continue;
      }
      graph[currElement.rowAndColumn.row][currElement.rowAndColumn.column] = VISITED_FIELD_ID;

      console.log('current element', currElement);

      const row = currElement.rowAndColumn.row;
      const col = currElement.rowAndColumn.column;
      this.checkNeighborToLeft(graph, currElement, queue, end);
      this.checkNeighborsSameColumnAndRight(graph, currElement, queue, end);

      queue.print();
    }

    if (lastNode === undefined) {
      return [];
    }
    return this.createReversePath(lastNode);
  }

  private checkNeighborsSameColumnAndRight(
    graph: number[][],
    currElement: PrioritizedGraphCell,
    queue: PriorityQueue<PrioritizedGraphCell>,
    end: RowColumnPair
  ) {
    const row = currElement.rowAndColumn.row;
    const col = currElement.rowAndColumn.column;
    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
      const colDeltaStart = row % 2 === 1 ? 0 : -1;
      const colDeltaEnd = row % 2 === 1 ? 1 : 0;
      for (let colDelta = colDeltaStart; colDelta <= colDeltaEnd; colDelta++) {
        if (rowDelta === 0 && colDelta === 0) {
          continue;
        }
        if (this.isValidCell(graph, row + rowDelta, col + colDelta)) {
          if (
            graph[row + rowDelta][col + colDelta] === IN_CONSIDERATION_FIELD_ID ||
            graph[row + rowDelta][col + colDelta] === VISITED_FIELD_ID
          ) {
            continue;
          }
          graph[row + rowDelta][col + colDelta] = IN_CONSIDERATION_FIELD_ID;
          queue.pushElement(
            new PrioritizedGraphCell(
              new RowColumnPair(row + rowDelta, col + colDelta),
              this.calculateManhattenDistanceOfTwoCells(row, col, end),
              currElement
            )
          );
        }
      }
    }
  }
  private checkNeighborToLeft(
    graph: number[][],
    currElement: PrioritizedGraphCell,
    queue: PriorityQueue<PrioritizedGraphCell>,
    end: RowColumnPair
  ) {
    const row = currElement.rowAndColumn.row;
    const col = currElement.rowAndColumn.column;
    if (this.isValidCell(graph, currElement.rowAndColumn.row, col - 1)) {
      if (graph[row][col - 1] === IN_CONSIDERATION_FIELD_ID || graph[row][col - 1] === VISITED_FIELD_ID) {
        return;
      }
      graph[row][col - 1] = IN_CONSIDERATION_FIELD_ID;
      queue.pushElement(
        new PrioritizedGraphCell(
          new RowColumnPair(row, col - 1),
          this.calculateManhattenDistanceOfTwoCells(row, col, end),
          currElement
        )
      );
    }
  }

  private isValidCell(grid: number[][], row: number, col: number): boolean {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length && grid[row][col] !== WALL_FIELD_ID;
  }

  private createReversePath(node: PrioritizedGraphCell): RowColumnPair[] {
    if (node.cameFrom === undefined) {
      return [];
    }
    const restOfPath = this.createReversePath(node.cameFrom);
    restOfPath.push(node.rowAndColumn);
    return restOfPath;
  }

  private getElementWithConstraint(graph: number[][], constraint: number): RowColumnPair {
    for (let row = 0; row < graph.length; row++) {
      for (let col = 0; col < graph[row].length; col++) {
        if (graph[row][col] === constraint) {
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
    return Math.abs(currentRow - cell2.row) + Math.abs(currentCol - cell2.column);
  }
}

export class AStarAlgorithmOptions {
  algorithmSpeed: number;
}

class PrioritizedGraphCell {
  constructor(public rowAndColumn: RowColumnPair, public priority: number, public cameFrom?: PrioritizedGraphCell) {}
}
