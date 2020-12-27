import { GraphCellConstraint } from './GraphCell';
import { RowColumnPair } from './RowColumnPair';

export class AlgorithmEvent {
  constructor(public cell: RowColumnPair, public constraint: GraphCellConstraint) {}
}
