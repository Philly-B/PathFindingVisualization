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
} from './graph.actions';

export class GraphState {
  N: number;
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
  N: INITIAL_NUMBER_OF_HEX_PER_ROW,

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
  on(removeWall, (state, { exWall }) => ({ ...state, walls: duplicateAndRemoveWall(state.walls, exWall) })),

  on(setEnd, (state, { endPosition }) => ({ ...state, endPosition })),

  on(updateGraphCell, (state, { cell, newConstraint }) => addChangeCellToCorrectList(state, cell, newConstraint)),
  on(resetAlgorithmData, (state) => ({ ...state, visited: [], inConsideration: [], finalPath: [] })),

  on(setGraphState, (state, { newState }) => ({ ...state, ...newState }))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}

const addChangeCellToCorrectList = (
  state: GraphState,
  cell: RowColumnPair,
  newConstraint: GraphCellConstraint
): GraphState => {
  const newState: GraphState = {
    ...state,
    visited: duplicateArray(state.visited),
    inConsideration: duplicateArray(state.inConsideration),
    finalPath: duplicateArray(state.finalPath),
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

const duplicateAndRemoveWall = (walls: RowColumnPair[], exWall: RowColumnPair): RowColumnPair[] => {
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
