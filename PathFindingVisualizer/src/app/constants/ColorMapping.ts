import { GraphCell, GraphCellConstraint } from '../model/GraphCell';
// HEXAGON
const hexagonBorder = 255;
const hexagonInsidePassable = [173, 219, 151];

const hexagonInsideInConsideration = [145, 179, 235];
const hexagonInsideVisited = [73, 134, 235];
const hexagonInsideFinalPath = [0, 34, 89];

const hexagonInsideWall = [43, 10, 191];
const hexagonInsideStart = [16, 179, 59];
const hexagonInsideEnd = [230, 100, 64];

export {
  hexagonBorder,
  hexagonInsidePassable,
  hexagonInsideFinalPath,
  hexagonInsideInConsideration,
  hexagonInsideVisited,
  hexagonInsideWall,
  hexagonInsideStart,
  hexagonInsideEnd,
};

export const getColorForHexagon = (graphCell: GraphCell): number[] => {
  switch (graphCell.graphCellConstraint) {
    case GraphCellConstraint.START:
      return hexagonInsideStart;
    case GraphCellConstraint.END:
      return hexagonInsideEnd;
    case GraphCellConstraint.WALL:
      return hexagonInsideWall;
    case GraphCellConstraint.IN_CONSIDERATION:
      return hexagonInsideInConsideration;
    case GraphCellConstraint.VISITED:
      return hexagonInsideVisited;
    case GraphCellConstraint.FINAL_PATH:
      return hexagonInsideFinalPath;
    default:
      return hexagonInsidePassable;
  }
};
