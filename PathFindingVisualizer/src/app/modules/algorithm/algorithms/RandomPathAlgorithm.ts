import { AlgorithmOptions } from './AlgorithmOptions';
import { AbstractAlgorithm } from './AbstractAlgorithm';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { END_FIELD_ID, START_FIELD_ID } from 'src/app/constants/AlgorithmConstants';

export class RandomPathAlgorithm extends AbstractAlgorithm {
  private start: RowColumnPair;
  private end: RowColumnPair;
  private queue: RowColumnPair[];

  finished = false;
  result: RowColumnPair[] = [];

  constructor(
    graph: number[][],
    options: AlgorithmOptions,
    graphIterationCallback: (cell: RowColumnPair, newState: number) => void
  ) {
    super(graph, options, graphIterationCallback);

    this.start = super.getElementWithConstraint(START_FIELD_ID);
    this.end = super.getElementWithConstraint(END_FIELD_ID);
    this.queue = [this.start];
  }

  public continueAlgorithm(): void {}

  private setValueToGraphCell(rowCol: RowColumnPair, newValue: number): void {
    this.graph[rowCol.row][rowCol.column] = newValue;
    this.graphIterationCallback(RowColumnPair.copy(rowCol), newValue);
  }
}
