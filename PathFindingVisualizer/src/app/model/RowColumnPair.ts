export class RowColumnPair {
  constructor(public row: number, public column: number) {}

  static copy = (rp: RowColumnPair): RowColumnPair => {
    if (rp === undefined) return undefined;
    return new RowColumnPair(rp.row, rp.column);
  };
  static equals = (rp1: RowColumnPair, rp2: RowColumnPair): boolean => {
    return rp1.row === rp2.row && rp1.column === rp2.column;
  };
}
