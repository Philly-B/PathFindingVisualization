import { createReducer, on } from '@ngrx/store';
import { Graph } from '../model/Graph';
import { RowColumnPair } from '../path-finder/model/RowColumnPair';
import {
  modifyWalls,
  setEnd,
  setStart,
  initiateSetStart,
  initiateSetEnd,
  initiateModifyWalls,
  finalizeModifyWalls,
  finalizeSetStart,
  finalizeSetEnd,
} from './graph.actions';

export class GraphState {
  startPosition: RowColumnPair;
  endPosition: RowColumnPair;
  walls: RowColumnPair[];
  graph: Graph;
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
  graph: undefined,
};

const graphReducerInternal = createReducer(
  initialState,
  on(initiateSetStart, (state) => ({ ...state })),
  on(setStart, (state, { startPosition }) => ({ ...state, startPosition })),
  on(finalizeSetStart, (state) => ({ ...state })),

  on(initiateModifyWalls, (state) => ({ ...state })),
  on(modifyWalls, (state, { walls }) => ({ ...state, walls })),
  on(finalizeModifyWalls, (state) => ({ ...state })),

  on(initiateSetEnd, (state) => ({ ...state })),
  on(setEnd, (state, { endPosition }) => ({ ...state, endPosition })),
  on(finalizeSetEnd, (state) => ({ ...state }))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}
