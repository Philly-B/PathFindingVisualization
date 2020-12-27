import { createReducer, on } from '@ngrx/store';
import { GraphCellConstraint } from '../model/GraphCell';
import { RowColumnPair } from '../model/RowColumnPair';
import {
  setEnd,
  setStart,
  initiateSetStart,
  initiateSetEnd,
  initiateModifyWalls,
  finalizeModifyWalls,
  finalizeSetStart,
  finalizeSetEnd,
  setWall,
  removeWall,
  updateGraphCell,
  resetAlgorithmData,
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
  N: 15,

  inConsideration: [],
  visited: [],
  finalPath: [],
};

// TODO every array should be duplicated!
const graphReducerInternal = createReducer(
  initialState,
  on(initiateSetStart, (state) => ({ ...state })),
  on(setStart, (state, { startPosition }) => ({ ...state, startPosition })),
  on(finalizeSetStart, (state) => ({ ...state })),

  on(initiateModifyWalls, (state) => ({ ...state })),
  on(setWall, (state, { wall }) => ({ ...state, walls: duplicateAndAddWall(state.walls, wall) })),
  on(removeWall, (state, { exWall }) => ({ ...state, walls: duplicateAndRemoveWall(state.walls, exWall) })),
  on(finalizeModifyWalls, (state) => ({ ...state })),

  on(initiateSetEnd, (state) => ({ ...state })),
  on(setEnd, (state, { endPosition }) => ({ ...state, endPosition })),
  on(finalizeSetEnd, (state) => ({ ...state })),

  on(updateGraphCell, (state, { cell, newConstraint }) => addChangeCellToCorrectList(state, cell, newConstraint)),
  on(resetAlgorithmData, (state) => ({ ...state, visited: [], inConsideration: [], finalPath: [] }))
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
      break;
    }
  }
  return nextWalls;
};
const duplicateAndAddWall = (walls: RowColumnPair[], newWall: RowColumnPair): RowColumnPair[] => {
  const nextWalls = duplicateArray(walls);
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
