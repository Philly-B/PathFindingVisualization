import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm, CurrentPathElement } from './AbstractAlgorithm';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { PriorityQueue } from 'src/app/modules/algorithm/utils/PriorityQueue';
import { VISITED_FIELD_ID } from 'src/app/constants/AlgorithmConstants';
import { StartNotDefinedError } from 'src/app/errors/AlgorithmErrors';

export class AStarAlgorithm extends AbstractAlgorithm {
  private queue: PriorityQueue<PrioritizedCurrentPathElement>;

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);
  }

  public initializeImpl(): void {
    this.queue = new PriorityQueue<PrioritizedCurrentPathElement>(this.prioritizedGraphCellComparator);
    this.queue.pushElement(
      new PrioritizedCurrentPathElement(
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
      this.getAllUnvisitedNotConsideredNeighbors(currElement.rowAndColumn).forEach((neight) =>
        this.queue.pushElement(
          new PrioritizedCurrentPathElement(
            neight,
            this.calculateDistanceOfTwoCells(neight.row, neight.column, this.end),
            currElement
          )
        )
      );
      break;
    }
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
    public cameFrom?: PrioritizedCurrentPathElement
  ) {
    super(rowAndColumn, cameFrom);
  }
}
