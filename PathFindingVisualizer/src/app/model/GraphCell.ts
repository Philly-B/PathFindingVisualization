export class GraphCell {
  graphCellConstraint: GraphCellConstraint;
  row: number;
  column: number;
}

export enum GraphCellConstraint {
  WALL,
  START,
  END,
  PASSABLE,
  FINAL_PATH,
}
