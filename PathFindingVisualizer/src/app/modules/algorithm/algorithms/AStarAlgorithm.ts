import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm, CurrentPathElement } from './AbstractAlgorithm';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { PriorityQueue } from 'src/app/modules/algorithm/utils/PriorityQueue';
import { IN_CONSIDERATION_FIELD_ID, VISITED_FIELD_ID } from 'src/app/constants/AlgorithmConstants';

export class AStarAlgorithm extends AbstractAlgorithm {
  static description =
    'A* (pronounced "A-star") is a graph traversal and path search algorithm, ' +
    'which is often used in many fields of computer science due to its completeness, ' +
    'optimality, and optimal efficiency. One major practical drawback is its {displaystyle ' +
    ' O(b^{d})}O(b^d) space complexity, as it stores all generated nodes in memory. Thus, ' +
    'in practical travel-routing systems, it is generally outperformed by algorithms which ' +
    'can pre-process the graph to attain better performance, as well as memory-bounded ' +
    'approaches; however, A* is still the best solution in many cases. (source: wikipedia)';

  private queue: PriorityQueue<PrioritizedCurrentPathElement>;
  private currentWeights: number[][];
  private currentBestOrigin: RowColumnPair[][];

  private MAX = 1000000007;

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);

    this.currentWeights = [];
    this.currentBestOrigin = [];
    for (const graphRow of graph) {
      const currRow = new Array(graphRow.length);
      currRow.fill(this.MAX);
      this.currentWeights.push(currRow);

      this.currentBestOrigin.push(new Array(graphRow.length));
    }
  }

  public initializeImpl(): void {
    this.queue = new PriorityQueue<PrioritizedCurrentPathElement>(this.prioritizedGraphCellComparator);
    this.queue.pushElement(
      new PrioritizedCurrentPathElement(
        this.start,
        this.calculateDistanceOfTwoCells(this.start.row, this.start.column, this.end),
        0
      )
    );
    this.currentWeights[this.start.row][this.start.column] = 0;
  }

  public continueAlgorithm(): void {
    if (this.queue.isEmpty() || this.finished) {
      this.finished = true;
      return;
    }

    while (!this.queue.isEmpty()) {
      const currElement = this.queue.popElement();
      const currentElementRow = currElement.rowAndColumn.row;
      const currentElementColumn = currElement.rowAndColumn.column;

      if (RowColumnPair.equals(currElement.rowAndColumn, this.end)) {
        this.finished = true;
        this.result = this.createBestPath();
        this.currentBestOrigin[currentElementRow][currentElementColumn] = currElement.cameFrom.rowAndColumn;
        return;
      }
      if (this.graph[currentElementRow][currentElementColumn] === VISITED_FIELD_ID) {
        continue;
      }

      this.setValueToGraphCell(currElement.rowAndColumn, VISITED_FIELD_ID);
      this.getAllUnvisitedNotConsideredNeighbors(currElement.rowAndColumn)
        .filter((neigh) => this.currentWeights[neigh.row][neigh.column] > currElement.selfWeight + 1)
        .forEach((neigh) => {
          this.currentWeights[neigh.row][neigh.column] = currElement.selfWeight + 1;
          this.currentBestOrigin[neigh.row][neigh.column] = currElement.rowAndColumn;

          this.queue.pushElement(
            new PrioritizedCurrentPathElement(
              neigh,
              currElement.selfWeight + 1 +
              this.calculateDistanceOfTwoCells(neigh.row, neigh.column, this.end),
              currElement.selfWeight + 1
            )
          );
        });
      break;
    }
  }

  private createBestPath(): RowColumnPair[] {
    const path = [];
    let currentNode = this.currentBestOrigin[this.end.row][this.end.column];
    while (currentNode !== this.start) {
      path.push(currentNode);
      currentNode = this.currentBestOrigin[currentNode.row][currentNode.column];
    }
    return path;
  }

  private prioritizedGraphCellComparator(
    cell1: PrioritizedCurrentPathElement,
    cell2: PrioritizedCurrentPathElement
  ): number {
    return cell1.priority - cell2.priority;
  }
  private calculateDistanceOfTwoCells(currentRow: number, currentCol: number, cell2: RowColumnPair) {
    return Math.sqrt(Math.pow(currentRow - cell2.row, 2) + Math.pow(currentCol - cell2.column, 2));
  }
}

class PrioritizedCurrentPathElement extends CurrentPathElement {
  constructor(
    public rowAndColumn: RowColumnPair,
    public priority: number,
    public selfWeight?: number
  ) {
    super(rowAndColumn);
  }
}
