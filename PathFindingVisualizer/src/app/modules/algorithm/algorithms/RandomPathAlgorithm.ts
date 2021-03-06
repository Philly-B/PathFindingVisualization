import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm, CurrentPathElement } from './AbstractAlgorithm';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { VISITED_FIELD_ID } from 'src/app/constants/AlgorithmConstants';

export class RandomPathAlgorithm extends AbstractAlgorithm {
  static description =
    'The random path algorithm acts similiarly to the A* algorithm' +
    ' with the small difference of not choosing the currently closest cell to the end' +
    ' but a random cell which has not been visited yet. Thus the result path might be' +
    ' optimal but must not!';

  private queue: CurrentPathElement[];

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);
  }

  public initializeImpl(): void {
    this.queue = [new CurrentPathElement(this.start)];
  }

  public continueAlgorithm(): void {
    if (this.queue.length === 0 || this.finished) {
      this.finished = true;
      return;
    }

    while (this.queue.length !== 0) {
      const indexOfNext = this.getRandomInt(this.queue.length - 1);
      const currElement = this.queue.splice(indexOfNext, 1)[0];

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
        this.queue.push(new CurrentPathElement(neight, currElement))
      );
      break;
    }
  }
}
