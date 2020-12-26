import { createReducer, on } from '@ngrx/store';
import { Graph } from '../model/Graph';
import { RowColumnPair } from '../path-finder/visualisation-model/RowColumnPair';
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
  modifyGridSize,
  setNewGraph,
} from './graph.actions';

export class GraphState {
  startPosition: RowColumnPair;
  endPosition: RowColumnPair;
  walls: RowColumnPair[];
  graph: Graph;
  graphSize: number;
}

export const initialState: GraphState = {
  startPosition: undefined,
  endPosition: undefined,
  walls: [],
  graph: undefined,
  graphSize: 25,
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
  on(finalizeSetEnd, (state) => ({ ...state })),

  on(modifyGridSize, (state, { newGridSize }) => ({ ...state, graphSize: newGridSize })),
  on(setNewGraph, (state, { graph }) => ({ ...state, graph }))
);

export function graphReducer(state, action) {
  return graphReducerInternal(state, action);
}
