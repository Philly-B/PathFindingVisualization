import { P5Vector } from '../p5-additionals/models/P5Vector';

export class GraphCell {
  center: P5Vector;
  graphCellConstraint: GraphCellConstraint;
  row: number;
  column: number;
  lastChange: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.graphCellConstraint = GraphCellConstraint.PASSABLE;
    this.lastChange = Date.now();
  }
}

export enum GraphCellConstraint {
  WALL,
  START,
  END,
  PASSABLE,
  IN_CONSIDERATION,
  VISITED,
  FINAL_PATH,
}
