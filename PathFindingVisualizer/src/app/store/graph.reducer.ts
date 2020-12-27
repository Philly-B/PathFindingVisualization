import { createReducer, on } from '@ngrx/store';
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
} from './graph.actions';

export class GraphState {
  N: number;
  startPosition: RowColumnPair;
  endPosition: RowColumnPair;
  walls: RowColumnPair[];
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
  N: 15,
};

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
  on(finalizeSetEnd, (state) => ({ ...state }))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}

const duplicateAndRemoveWall = (walls: RowColumnPair[], exWall: RowColumnPair): RowColumnPair[] => {
  const nextWalls = duplicateWalls(walls);
  for (let i = 0; i < nextWalls.length; i++) {
    if (RowColumnPair.equals(nextWalls[i], exWall)) {
      nextWalls.splice(i, 1);
      break;
    }
  }
  return nextWalls;
};
const duplicateAndAddWall = (walls: RowColumnPair[], newWall: RowColumnPair): RowColumnPair[] => {
  const nextWalls = duplicateWalls(walls);
  nextWalls.push(newWall);
  return nextWalls;
};

const duplicateWalls = (walls: RowColumnPair[]): RowColumnPair[] => {
  const wallsCopy: RowColumnPair[] = [];
  for (const wall of walls) {
    wallsCopy.push(new RowColumnPair(wall.row, wall.column));
  }
  return wallsCopy;
};
