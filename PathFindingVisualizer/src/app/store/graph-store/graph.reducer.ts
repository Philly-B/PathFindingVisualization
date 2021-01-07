import { createReducer, on } from '@ngrx/store';
import {
  createGraphControlSettingsCopy,
  GraphControlMode,
  GraphControlSettings,
  initialGraphControlSettings,
} from 'src/app/model/GraphControlSettings';
import { INITIAL_NUMBER_OF_HEX_PER_ROW } from '../../constants/GeneralConstants';
import { GraphCellConstraint } from '../../model/GraphCell';
import { RowColumnPair } from '../../model/RowColumnPair';
import {
  setEnd,
  setStart,
  setWall,
  removeWall,
  updateGraphCell,
  resetAlgorithmData,
  setGraphState,
  setGridSize,
  removeAllWalls,
  triggerStartButton,
  triggerEndButton,
  triggerModifyWallsButton,
  triggerRemoveAllWallsButton,
} from './graph.actions';

export class GraphState {
  gridSize: number;
  startPosition: RowColumnPair;
  endPosition: RowColumnPair;
  walls: RowColumnPair[];

  inConsideration: RowColumnPair[];
  visited: RowColumnPair[];
  finalPath: RowColumnPair[];

  graphControlSettings: GraphControlSettings;
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  gridSize: INITIAL_NUMBER_OF_HEX_PER_ROW,
  walls: [],

  inConsideration: [],
  visited: [],
  finalPath: [],

  graphControlSettings: initialGraphControlSettings,
};

export const GRAPH_STATE_LOCAL_STORAGE_KEY = 'graph-state';

const graphReducerInternal = createReducer(
  initialState,
  on(setStart, (state, { startPosition }) => ({ ...createNewState(state), startPosition })),
  on(setWall, (state, { wall }) => ({ ...createNewState(state), walls: duplicateAndAddWall(state.walls, wall) })),
  on(removeWall, (state, { exWall }) => ({ ...createNewState(state), walls: duplicateAndRemove(state.walls, exWall) })),
  on(setEnd, (state, { endPosition }) => ({ ...createNewState(state), endPosition })),
  on(removeAllWalls, (state) => ({ ...createNewState(state), walls: [] })),

  on(triggerStartButton, (state) => ({
    ...createNewState(state),
    graphControlSettings: handleSetting(state.graphControlSettings, nameOf<GraphControlSettings>('setStart')),
  })),
  on(triggerEndButton, (state) => ({
    ...createNewState(state),
    graphControlSettings: handleSetting(state.graphControlSettings, nameOf<GraphControlSettings>('setEnd')),
  })),
  on(triggerModifyWallsButton, (state) => ({
    ...createNewState(state),
    graphControlSettings: handleSetting(state.graphControlSettings, nameOf<GraphControlSettings>('modifyWalls')),
  })),
  on(triggerRemoveAllWallsButton, (state) => ({
    ...createNewState(state),
    graphControlSettings: handleSetting(state.graphControlSettings, nameOf<GraphControlSettings>('removeAllWalls')),
  })),

  on(updateGraphCell, (state, { cell, newConstraint }) => addChangeCellToCorrectList(state, cell, newConstraint)),
  on(resetAlgorithmData, (state) => ({ ...createNewState(state), visited: [], inConsideration: [], finalPath: [] })),

  on(setGraphState, (state, { newState }) => ({ ...createNewState(state), ...newState })),
  on(setGridSize, (state, { gridSize }) => createStateWithNewGridSize(state, gridSize))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}

const createStateWithNewGridSize = (state: GraphState, gridSize: number): GraphState => {
  const newGraphState = { ...createNewState(state), gridSize };
  const wallsCopy = duplicateArray(state.walls);

  if (newGraphState.startPosition !== undefined && isOutOfBounds(gridSize, newGraphState.startPosition)) {
    newGraphState.startPosition = undefined;
  }
  if (newGraphState.endPosition !== undefined && isOutOfBounds(gridSize, newGraphState.endPosition)) {
    newGraphState.endPosition = undefined;
  }
  var i = wallsCopy.length;
  while (i--) {
    if (isOutOfBounds(gridSize, wallsCopy[i])) {
      wallsCopy.splice(i, 1);
    }
  }
  newGraphState.walls = wallsCopy;
  return newGraphState;
};

const isOutOfBounds = (gridSize: number, cell: RowColumnPair): boolean => {
  return cell.column >= gridSize || cell.row >= gridSize;
};

const addChangeCellToCorrectList = (
  state: GraphState,
  cell: RowColumnPair,
  newConstraint: GraphCellConstraint
): GraphState => {
  const newState: GraphState = {
    ...createNewState(state),
    visited: duplicateAndRemove(state.visited, cell),
    inConsideration: duplicateAndRemove(state.inConsideration, cell),
    finalPath: duplicateAndRemove(state.finalPath, cell),
  };

  switch (newConstraint) {
    case GraphCellConstraint.IN_CONSIDERATION:
      newState.inConsideration.push(cell);
      break;
    case GraphCellConstraint.VISITED:
      newState.visited.push(cell);
      break;
    case GraphCellConstraint.FINAL_PATH:
      newState.finalPath.push(cell);
  }

  return newState;
};

const duplicateAndRemove = (array: RowColumnPair[], exWall: RowColumnPair): RowColumnPair[] => {
  const nextArray = duplicateArray(array);
  for (let i = array.length - 1; i >= 0; i--) {
    if (RowColumnPair.equals(nextArray[i], exWall)) {
      nextArray.splice(i, 1);
      break;
    }
  }
  return nextArray;
};
const duplicateAndAddWall = (walls: RowColumnPair[], newWall: RowColumnPair): RowColumnPair[] => {
  const nextWalls = duplicateArray(walls);
  for (const nextWall of nextWalls) {
    if (RowColumnPair.equals(nextWall, newWall)) {
      return;
    }
  }
  nextWalls.push(newWall);
  return nextWalls;
};

const duplicateArray = (walls: RowColumnPair[]): RowColumnPair[] => {
  const wallsCopy: RowColumnPair[] = [];
  for (const wall of walls) {
    wallsCopy.push(new RowColumnPair(wall.row, wall.column));
  }
  return wallsCopy;
};

const createNewState = (oldState: GraphState): GraphState => {
  const newState: GraphState = {
    startPosition: RowColumnPair.copy(oldState.startPosition),
    endPosition: RowColumnPair.copy(oldState.endPosition),
    gridSize: oldState.gridSize,
    walls: duplicateArray(oldState.walls),
    inConsideration: duplicateArray(oldState.inConsideration),
    visited: duplicateArray(oldState.visited),
    finalPath: duplicateArray(oldState.finalPath),
    graphControlSettings: createGraphControlSettingsCopy(oldState.graphControlSettings),
  };
  return newState;
};

const handleSetting = (graphControlSettings: GraphControlSettings, setting: string): GraphControlSettings => {
  const newGraphControlSettings = createGraphControlSettingsCopy(graphControlSettings);
  if (newGraphControlSettings[setting] === GraphControlMode.ENABLED) {
    setAllStatesTo(newGraphControlSettings, GraphControlMode.NONE);
  } else {
    setAllStatesTo(newGraphControlSettings, GraphControlMode.DISABLED);
    newGraphControlSettings[setting] = GraphControlMode.ENABLED;
  }
  return newGraphControlSettings;
};

const setAllStatesTo = (graphControlSettings: GraphControlSettings, newState: GraphControlMode): void => {
  graphControlSettings.setStart = newState;
  graphControlSettings.setEnd = newState;
  graphControlSettings.modifyWalls = newState;
  graphControlSettings.removeAllWalls = newState;
};

const nameOf = <T>(name: keyof T) => name;
