import { createAction, props, union } from '@ngrx/store';
import { GraphCellConstraint } from '../../model/GraphCell';
import { RowColumnPair } from '../../model/RowColumnPair';
import { GraphState } from './graph.reducer';

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
export const finalizeSetWalls = createAction(FINALIZE_SET_WALLS);

export const SET_GRID_SIZE = '[Graph Component] set grid size';
export const setGridSize = createAction(SET_GRID_SIZE, props<{ gridSize: number }>());

// PERSISTENCE
export const SAVE_TO_LOCAL_STORAGE = '[Graph Component] save to local storage';
export const saveToLocalStorage = createAction(SAVE_TO_LOCAL_STORAGE);

export const SAVE_TO_LOCAL_STORAGE_DONE = '[Graph Component] save to local storage done';
export const saveToLocalStorageDone = createAction(SAVE_TO_LOCAL_STORAGE_DONE);

export const LOAD_FROM_LOCAL_STORAGE = '[Graph Component] load from local storage';
export const loadFromLocalStorage = createAction(LOAD_FROM_LOCAL_STORAGE);

export const SET_GRAPH_STATE = '[Graph Component] set graph state';
export const setGraphState = createAction(SET_GRAPH_STATE, props<{ newState: GraphState }>());

export const RELOAD_GRAPH_STATE = '[Graph Component] reload graph state';
export const reloadGraphState = createAction(RELOAD_GRAPH_STATE);

// ALGORITHM RELATED
export const UPDATE_GRAPH_CELL = '[Graph Component] algorithm update cell';
export const updateGraphCell = createAction(
  UPDATE_GRAPH_CELL,
  props<{ cell: RowColumnPair; newConstraint: GraphCellConstraint }>()
);

export const RESET_ALGORITHM_DATA = '[Graph Component] reset algorithm data';
export const resetAlgorithmData = createAction(RESET_ALGORITHM_DATA);

const all = union({
  reloadGraphState,
  setStart,
  setEnd,
  setWall,
  removeWall,
  updateGraphCell,
  resetAlgorithmData,
  setGridSize,
  removeAllWalls,
  saveToLocalStorage,
  loadFromLocalStorage,
});

export type GraphActionsTypes = typeof all;
