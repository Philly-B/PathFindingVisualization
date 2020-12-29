import { ColorSettings } from '../model/ColorSettings';
import { GraphCell, GraphCellConstraint } from '../model/GraphCell';

export const getColorForHexagon = (graphCell: GraphCell, colorSettings: ColorSettings): number[] => {
  switch (graphCell.graphCellConstraint) {
    case GraphCellConstraint.START:
      return colorSettings.hexagonInsideStart;
    case GraphCellConstraint.END:
      return colorSettings.hexagonInsideEnd;
    case GraphCellConstraint.WALL:
      return colorSettings.hexagonInsideWall;
    case GraphCellConstraint.IN_CONSIDERATION:
      return colorSettings.hexagonInsideInConsideration;
    case GraphCellConstraint.VISITED:
      return colorSettings.hexagonInsideVisited;
    case GraphCellConstraint.FINAL_PATH:
      return colorSettings.hexagonInsideFinalPath;
    default:
      return colorSettings.hexagonInsidePassable;
  }
};

export const getSettingLabelForField = (fieldName: string): string => {
  switch (fieldName) {
    case 'hexagonInsideStart':
      return 'Start cell';
    case 'hexagonInsideEnd':
      return 'End cell';
    case 'hexagonInsideWall':
      return 'Wall cells';
    case 'hexagonInsideInConsideration':
      return 'Considered but not visited cells';
    case 'hexagonInsideVisited':
      return 'Visited cells';
    case 'hexagonInsideFinalPath':
      return 'Final path cells';
    default:
      return undefined;
  }
};
