import { RowColumnPair } from '../model/RowColumnPair';
import { AlgorithmOptions } from './AlgorithmOptions';

export abstract class AbstractAlgorithm {
  constructor(
    protected graph: number[][],
    protected options: AlgorithmOptions,
    protected graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {}

  abstract continueAlgorithm(): void;
}
