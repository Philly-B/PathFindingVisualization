import { Graph } from '../model/Graph';
import { GraphCell, GraphCellConstraint } from '../model/GraphCell';
import { graphReducer } from '../store/graph.reducer';
import { PriorityQueue } from '../utils/PriorityQueue';
import { StartNotDefinedError } from './errors';

export class AStarAlgorithm {
  constructor() {}

  public runAlgorithm(graph: Graph, options: AStarAlgorithmOptions): GraphCell[] {
    const start = this.getElementWithConstraint(graph, GraphCellConstraint.START);
    const end = this.getElementWithConstraint(graph, GraphCellConstraint.START);

    const queue = new PriorityQueue<PrioritizedGraphCell>(this.prioritizedGraphCellComparator);
    queue.pushElement(new PrioritizedGraphCell(start, this.calculateManhattenDistanceOfTwoCells(start, end)));

    let lastNode: PrioritizedGraphCell;
    while (!queue.isEmpty()) {
      const currElement = queue.popElement();
      if (currElement.graphCell === end) {
        lastNode = currElement;
        break;
      }
      const row = currElement.graphCell.row;
      const col = currElement.graphCell.column;
      this.checkNeighborToLeft(graph, currElement, queue, end);
      this.checkNeighborsSameColumnAndRight(graph, currElement, queue, end);
    }

    if (lastNode === undefined) {
      return [];
    }
    return this.createReversePath(lastNode);
  }

  private checkNeighborsSameColumnAndRight(
    graph: Graph,
    currElement: PrioritizedGraphCell,
    queue: PriorityQueue<PrioritizedGraphCell>,
    end: GraphCell
  ) {
    const row = currElement.graphCell.row;
    const col = currElement.graphCell.column;
    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
      for (let colDelta = 0; colDelta <= 1; colDelta++) {
        if (rowDelta === 0 && colDelta === 0) {
          continue;
        }
        if (this.isValidCell(graph, currElement.graphCell.row + rowDelta, col + colDelta)) {
          queue.pushElement(
            new PrioritizedGraphCell(
              graph.grid[row][col],
              this.calculateManhattenDistanceOfTwoCells(graph.grid[row][col], end),
              currElement
            )
          );
        }
      }
    }
  }
  private checkNeighborToLeft(
    graph: Graph,
    currElement: PrioritizedGraphCell,
    queue: PriorityQueue<PrioritizedGraphCell>,
    end: GraphCell
  ) {
    const row = currElement.graphCell.row;
    const col = currElement.graphCell.column;
    if (this.isValidCell(graph, currElement.graphCell.row, col - 1)) {
      queue.pushElement(
        new PrioritizedGraphCell(
          graph.grid[row][col],
          this.calculateManhattenDistanceOfTwoCells(graph.grid[row][col], end),
          currElement
        )
      );
    }
  }

  private isValidCell(graph: Graph, row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < graph.grid.length &&
      col >= 0 &&
      col < graph.grid[row].length &&
      graph.grid[row][col].graphCellConstraint !== GraphCellConstraint.WALL
    );
  }

  private createReversePath(node: PrioritizedGraphCell): GraphCell[] {
    if (node.cameFrom === undefined) {
      return [];
    }
    const restOfPath = this.createReversePath(node.cameFrom);
    restOfPath.push(node.graphCell);
    return restOfPath;
  }

  private getElementWithConstraint(graph: Graph, constraint: GraphCellConstraint): GraphCell {
    for (const graphRow of graph.grid) {
      for (const graphCell of graphRow) {
        if (graphCell.graphCellConstraint === constraint) {
          return graphCell;
        }
      }
    }
    throw new StartNotDefinedError();
  }

  private prioritizedGraphCellComparator(cell1: PrioritizedGraphCell, cell2: PrioritizedGraphCell): number {
    return cell1.priority - cell2.priority;
  }
  private calculateManhattenDistanceOfTwoCells(cell1: GraphCell, cell2: GraphCell) {
    return Math.abs(cell1.row - cell2.row) + Math.abs(cell1.column - cell2.column);
  }
}

export class AStarAlgorithmOptions {
  algorithmSpeed: number;
}

class PrioritizedGraphCell {
  constructor(public graphCell: GraphCell, public priority: number, public cameFrom?: PrioritizedGraphCell) {}
}
