export class ColorSettings {
  hexagonBorder: string;
  hexagonInsidePassable: string;

  hexagonInsideInConsideration: string;
  hexagonInsideVisited: string;
  hexagonInsideFinalPath: string;

  hexagonInsideWall: string;
  hexagonInsideStart: string;
  hexagonInsideEnd: string;

  static initialSettings: ColorSettings = {
    hexagonBorder: '#ffffff',
    hexagonInsidePassable: '#addb97',

    hexagonInsideInConsideration: '#91b3eb',
    hexagonInsideVisited: '#4986eb',
    hexagonInsideFinalPath: '#002259',

    hexagonInsideWall: '#2b0abf',
    hexagonInsideStart: '#10b33b',
    hexagonInsideEnd: '#e66440',
  };
}
