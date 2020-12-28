import { StartNotDefinedError } from 'src/app/errors/AlgorithmErrors';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { AlgorithmOptions } from './AlgorithmOptions';

export abstract class AbstractAlgorithm {
  finished = false;
  result: RowColumnPair[] = [];

  constructor(
    protected graph: number[][],
    protected options: AlgorithmOptions,
    protected graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {}

  abstract continueAlgorithm(): void;

  protected getElementWithConstraint(constraint: number): RowColumnPair {
    for (let row = 0; row < this.graph.length; row++) {
      for (let col = 0; col < this.graph[row].length; col++) {
        if (this.graph[row][col] === constraint) {
          return new RowColumnPair(row, col);
        }
      }
    }
    throw new StartNotDefinedError();
  }
}
