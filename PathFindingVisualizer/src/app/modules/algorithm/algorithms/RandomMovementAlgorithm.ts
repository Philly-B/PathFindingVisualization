import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm } from './AbstractAlgorithm';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { VISITED_FIELD_ID } from 'src/app/constants/AlgorithmConstants';

export class RandomMovementAlgorithm extends AbstractAlgorithm {
  static description =
    'The random movement algorithm acts in a way of trying to walk a path and if it does not succeed' +
    ' go back and try another one.';

  private queueStack: RowColumnPair[];
  private currentIndex: number;

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);
  }

  public initializeImpl(): void {
    this.queueStack = [this.start];
    this.currentIndex = 0;
  }

  public continueAlgorithm(): void {
    if (this.queueStack.length === 0 || this.finished) {
      this.finished = true;
      return;
    }

    while (this.queueStack.length !== 0) {
      const currElement = this.queueStack[this.currentIndex];

      if (RowColumnPair.equals(currElement, this.end)) {
        this.finished = true;
        this.result = this.queueStack;
        return;
      }
      this.setValueToGraphCell(currElement, VISITED_FIELD_ID);

      const possibleNeigh = this.getAllUnvisitedNeighbors(currElement);
      if (possibleNeigh.length === 0) {
        this.queueStack.splice(this.currentIndex, 1);
        this.currentIndex--;
        continue;
      }

      const nextNeighborToVisit = possibleNeigh[this.getRandomInt(possibleNeigh.length - 1)];
      this.queueStack.push(nextNeighborToVisit);
      this.currentIndex++;

      break;
    }
  }
}
