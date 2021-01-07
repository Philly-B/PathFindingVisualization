export class GraphControlSettings {
  setStart: GraphControlMode;
  setEnd: GraphControlMode;
  modifyWalls: GraphControlMode;
  removeAllWalls: GraphControlMode;
}

export const createGraphControlSettingsCopy = (graphControlSettings: GraphControlSettings): GraphControlSettings => {
  return {
    setStart: graphControlSettings.setStart,
    setEnd: graphControlSettings.setEnd,
    modifyWalls: graphControlSettings.modifyWalls,
    removeAllWalls: graphControlSettings.removeAllWalls,
  } as GraphControlSettings;
};

export enum GraphControlMode {
  NONE,
  ENABLED,
  DISABLED,
}

export const initialGraphControlSettings: GraphControlSettings = {
  setStart: GraphControlMode.NONE,
  setEnd: GraphControlMode.NONE,
  modifyWalls: GraphControlMode.NONE,
  removeAllWalls: GraphControlMode.NONE,
};
