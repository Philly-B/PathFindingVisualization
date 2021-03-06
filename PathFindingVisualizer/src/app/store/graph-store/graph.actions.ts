import { createAction, props, union } from '@ngrx/store';
import { GraphDrawingMode } from 'src/app/model/GraphDrawingMode';
import { GraphCellConstraint } from '../../model/GraphCell';
import { RowColumnPair } from '../../model/RowColumnPair';
import { GraphState } from './graph.reducer';

export const SET_START = '[Graph Component] set start';
export const setStart = createAction(SET_START, props<{ startPosition: RowColumnPair }>());

export const SET_END = '[Graph Component] set end';
export const setEnd = createAction(SET_END, props<{ endPosition: RowColumnPair }>());

export const SET_WALL = '[Graph Component] set wall';
export const setWall = createAction(SET_WALL, props<{ wall: RowColumnPair }>());

export const REMOVE_WALL = '[Graph Component] remove wall';
export const removeWall = createAction(REMOVE_WALL, props<{ exWall: RowColumnPair }>());
export const REMOVE_ALL_WALLS = '[Graph Component] remove all walls';
export const removeAllWalls = createAction(REMOVE_ALL_WALLS);

export const TRIGGER_START_BUTTON = '[Graph Component] trigger start button';
export const triggerStartButton = createAction(TRIGGER_START_BUTTON);

export const TRIGGER_END_BUTTON = '[Graph Component] trigger end button';
export const triggerEndButton = createAction(TRIGGER_END_BUTTON);

export const TRIGGER_MODIFY_WALLS_BUTTON = '[Graph Component] trigger modify walls button';
export const triggerModifyWallsButton = createAction(TRIGGER_MODIFY_WALLS_BUTTON);

export const TRIGGER_REMOVE_ALL_WALLS_BUTTON = '[Graph Component] trigger remove all walls button';
export const triggerRemoveAllWallsButton = createAction(TRIGGER_REMOVE_ALL_WALLS_BUTTON);

export const SET_GRID_SIZE = '[Graph Component] set grid size';
export const setGridSize = createAction(SET_GRID_SIZE, props<{ gridSize: number }>());

export const SET_GRAPH_DRAWING_MODE = '[Graph Component] set graph drawing mode';
export const setGraphDrawingMode = createAction(
  SET_GRAPH_DRAWING_MODE,
  props<{ graphDrawingMode: GraphDrawingMode }>()
);

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
export const DISABLE_GRAPH_CONTROLS = '[Graph Component] disable all graph controls';
export const disableGraphControls = createAction(DISABLE_GRAPH_CONTROLS);

export const ENABLE_GRAPH_CONTROLS = '[Graph Component] enable all graph controls';
export const enableGraphControls = createAction(ENABLE_GRAPH_CONTROLS);

export const UPDATE_GRAPH_CELL = '[Graph Component] algorithm update cell';
export const updateGraphCell = createAction(
  UPDATE_GRAPH_CELL,
  props<{ cell: RowColumnPair; newConstraint: GraphCellConstraint }>()
);

export const RESET_ALGORITHM_DATA = '[Graph Component] reset algorithm data';
export const resetAlgorithmData = createAction(RESET_ALGORITHM_DATA);

const all = union({
  // data modification
  setStart,
  setEnd,
  setWall,
  removeWall,
  removeAllWalls,
  setGridSize,
  setGraphDrawingMode,

  // graph controls
  triggerStartButton,
  triggerEndButton,
  triggerModifyWallsButton,
  triggerRemoveAllWallsButton,

  // algorithm related
  updateGraphCell,
  resetAlgorithmData,
  disableGraphControls,
  enableGraphControls,

  // persistence
  reloadGraphState,
  saveToLocalStorage,
  loadFromLocalStorage,
});

export type GraphActionsTypes = typeof all;
