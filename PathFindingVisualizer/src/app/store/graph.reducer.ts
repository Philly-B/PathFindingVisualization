import { createReducer, on } from '@ngrx/store';
import { P5Vector } from '../p5Additionals/models/P5Vector';
import { Hexagon } from '../path-finder/model/Hexagon';
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
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
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
