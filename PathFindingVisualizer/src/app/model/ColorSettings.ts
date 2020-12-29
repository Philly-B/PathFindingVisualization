export class ColorSettings {
  hexagonInsidePassable: number[];

  hexagonInsideInConsideration: number[];
  hexagonInsideVisited: number[];
  hexagonInsideFinalPath: number[];

  hexagonInsideWall: number[];
  hexagonInsideStart: number[];
  hexagonInsideEnd: number[];

  static initialSettings: ColorSettings = {
    hexagonInsidePassable: [173, 219, 151],

    hexagonInsideInConsideration: [145, 179, 235],
    hexagonInsideVisited: [73, 134, 235],
    hexagonInsideFinalPath: [0, 34, 89],

    hexagonInsideWall: [43, 10, 191],
    hexagonInsideStart: [16, 179, 59],
    hexagonInsideEnd: [230, 100, 64],
  };
}
