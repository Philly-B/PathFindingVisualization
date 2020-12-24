import { createAction, props } from '@ngrx/store';
import { RowColumnPair } from '../path-finder/model/RowColumnPair';

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
export const MODIFY_WALLS = '[Graph Component] modify walls';
export const modifyWalls = createAction(MODIFY_WALLS, props<{ walls: RowColumnPair[] }>());
export const FINALIZE_SET_WALLS = '[Graph Component] finalize modify walls';
export const finalizeModifyWalls = createAction(FINALIZE_SET_WALLS);
