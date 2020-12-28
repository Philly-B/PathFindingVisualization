import { createAction, props, union } from '@ngrx/store';

export const SET_ALGORITHM_SPEED = '[Algorithm Module] set algorithm speed';
export const setAlgorithmSpeed = createAction(SET_ALGORITHM_SPEED, props<{ speed: number }>());

export const SET_ALGORITHM = '[Algorithm Module] set algorithm';
export const setAlgorithm = createAction(SET_ALGORITHM_SPEED, props<{ algorithm: string }>());

const all = union({
  setAlgorithmSpeed,
  setAlgorithm,
});

export type GraphActionsTypes = typeof all;
