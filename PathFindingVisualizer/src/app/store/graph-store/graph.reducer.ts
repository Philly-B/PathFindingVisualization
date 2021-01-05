import { createReducer, on } from '@ngrx/store';
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
} from './graph.actions';

export class GraphState {
  gridSize: number;
  startPosition: RowColumnPair;
  endPosition: RowColumnPair;
  walls: RowColumnPair[];

  inConsideration: RowColumnPair[];
  visited: RowColumnPair[];
  finalPath: RowColumnPair[];
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
  gridSize: INITIAL_NUMBER_OF_HEX_PER_ROW,

  inConsideration: [],
  visited: [],
  finalPath: [],
};

export const GRAPH_STATE_LOCAL_STORAGE_KEY = 'graph-state';

// TODO every array should be duplicated!
const graphReducerInternal = createReducer(
  initialState,
  on(setStart, (state, { startPosition }) => ({ ...state, startPosition })),

  on(setWall, (state, { wall }) => ({ ...state, walls: duplicateAndAddWall(state.walls, wall) })),
  on(removeWall, (state, { exWall }) => ({ ...state, walls: duplicateAndRemove(state.walls, exWall) })),

  on(setEnd, (state, { endPosition }) => ({ ...state, endPosition })),

  on(updateGraphCell, (state, { cell, newConstraint }) => addChangeCellToCorrectList(state, cell, newConstraint)),
  on(resetAlgorithmData, (state) => ({ ...state, visited: [], inConsideration: [], finalPath: [] })),

  on(setGraphState, (state, { newState }) => ({ ...state, ...newState })),
  on(setGridSize, (state, { gridSize }) => createStateWithNewGridSize(state, gridSize))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}

const createStateWithNewGridSize = (state: GraphState, gridSize: number): GraphState => {
  const newGraphState = { ...state, gridSize };
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
}

const isOutOfBounds = (gridSize: number, cell: RowColumnPair): boolean => {
  return cell.column >= gridSize || cell.row >= gridSize;
}

const addChangeCellToCorrectList = (
  state: GraphState,
  cell: RowColumnPair,
  newConstraint: GraphCellConstraint
): GraphState => {
  const newState: GraphState = {
    ...state,
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

const duplicateAndRemove = (walls: RowColumnPair[], exWall: RowColumnPair): RowColumnPair[] => {
  const nextWalls = duplicateArray(walls);
  for (let i = 0; i < nextWalls.length; i++) {
    if (RowColumnPair.equals(nextWalls[i], exWall)) {
      nextWalls.splice(i, 1);
    }
  }
  return nextWalls;
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
