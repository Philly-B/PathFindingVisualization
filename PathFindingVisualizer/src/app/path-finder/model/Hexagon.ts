import { P5Vector } from 'src/app/p5Additionals/models/P5Vector';

export class Hexagon {
  center: P5Vector;
  row: number;
  column: number;

  isStart = false;
  isEnd = false;
  isWall = false;

  constructor(center: P5Vector, row: number, column: number) {
    this.center = center;
    this.row = row;
    this.column = column;
  }
}