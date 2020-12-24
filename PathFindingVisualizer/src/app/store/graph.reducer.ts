import { createReducer, on } from '@ngrx/store';
import { P5Vector } from '../p5Additionals/models/P5Vector';
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
  startPosition: P5Vector;
  endPosition: P5Vector;
  walls: P5Vector[];
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
};

const graphReducerInternal = createReducer(
  initialState,
  on(initiateSetStart, (state) => ({ ...state })),
  on(setStart, (state, { newStart }) => ({ ...state, startPosition: newStart })),
  on(finalizeSetStart, (state) => ({ ...state })),

  on(initiateModifyWalls, (state) => ({ ...state })),
  on(modifyWalls, (state, { newWalls }) => ({ ...state, walls: newWalls })),
  on(finalizeModifyWalls, (state) => ({ ...state })),

  on(initiateSetEnd, (state) => ({ ...state })),
  on(setEnd, (state, { newEnd }) => ({ ...state, startPosition: newEnd })),
  on(finalizeSetEnd, (state) => ({ ...state }))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}
