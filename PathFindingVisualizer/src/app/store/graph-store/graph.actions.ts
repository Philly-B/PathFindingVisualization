import { createAction, props, union } from '@ngrx/store';
import { Graph } from '../../model/Graph';
import { GraphCellConstraint } from '../../model/GraphCell';
import { RowColumnPair } from '../../model/RowColumnPair';

export const INIT_SET_START = '[Graph Component] initiate set start';
export const initiateSetStart = createAction(INIT_SET_START);
export const SET_START = '[Graph Component] set start';
export const setStart = createAction(SET_START, props<{ startPosition: RowColumnPair }>());
export const FINALIZE_SET_START = '[Graph Component] finalize set start';
export const finalizeSetStart = createAction(FINALIZE_SET_START);

export const INIT_SET_END = '[Graph Component] initiate set end';
export const initiateSetEnd = createAction(INIT_SET_END);
export const SET_END = '[Graph Component] set end';
export const setEnd = createAction(SET_END, props<{ endPosition: RowColumnPair }>());
export const FINALIZE_SET_END = '[Graph Component] finalize set end';
export const finalizeSetEnd = createAction(FINALIZE_SET_END);

export const INIT_MODIFY_WALLS = '[Graph Component] initiate modify walls';
export const initiateModifyWalls = createAction(INIT_MODIFY_WALLS);

export const SET_WALL = '[Graph Component] set wall';
export const setWall = createAction(SET_WALL, props<{ wall: RowColumnPair }>());

export const REMOVE_WALL = '[Graph Component] remove wall';
export const removeWall = createAction(REMOVE_WALL, props<{ exWall: RowColumnPair }>());
export const REMOVE_ALL_WALLS = '[Graph Component] remove all walls';
export const removeAllWalls = createAction(REMOVE_ALL_WALLS);

export const FINALIZE_SET_WALLS = '[Graph Component] finalize modify walls';
export const finalizeModifyWalls = createAction(FINALIZE_SET_WALLS);

// ALGORITHM RELATED
export const UPDATE_GRAPH_CELL = '[Graph Component] algorithm update cell';
export const updateGraphCell = createAction(
  UPDATE_GRAPH_CELL,
  props<{ cell: RowColumnPair; newConstraint: GraphCellConstraint }>()
);

export const RESET_ALGORITHM_DATA = '[Graph Component] reset algorithm data';
export const resetAlgorithmData = createAction(RESET_ALGORITHM_DATA);

const all = union({
  initiateSetStart,
  setStart,
  finalizeSetStart,
  initiateSetEnd,
  setEnd,
  finalizeSetEnd,
  initiateModifyWalls,
  setWall,
  removeWall,
  finalizeModifyWalls,
  updateGraphCell,
  resetAlgorithmData,
  removeAllWalls,
});

export type GraphActionsTypes = typeof all;
