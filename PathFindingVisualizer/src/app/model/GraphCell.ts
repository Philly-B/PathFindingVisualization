export class GraphCell {
  graphCellConstraint: GraphCellConstraint;
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
    this.graphCellConstraint = GraphCellConstraint.PASSABLE;
  }
}

export enum GraphCellConstraint {
  WALL,
  START,
  END,
  PASSABLE,
  FINAL_PATH,
}
