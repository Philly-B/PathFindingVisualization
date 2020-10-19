import { Point } from 'src/app/path-finder/model/Point';

export class AStartGraphPoint {


  position: Point;
  currentCost: number;
  costToGoal: number;
  pathToHere: Point[];

}
