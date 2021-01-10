import { createAction, props, union } from '@ngrx/store';
import { AlgorithmProcessingState } from 'src/app/model/AlgorithmProcessingState';
import { AlgorithmState } from './algorithm.reducer';

export const SET_ALGORITHM_SPEED = '[Algorithm Module] set algorithm speed';
export const setAlgorithmSpeed = createAction(SET_ALGORITHM_SPEED, props<{ speed: number }>());

export const SET_ALGORITHM = '[Algorithm Module] set algorithm';
export const setAlgorithm = createAction(SET_ALGORITHM, props<{ algorithm: string }>());

export const SET_ALGORITHM_PROCESSING_STATE = '[Algorithm Module] set algorithm processing state';
export const setAlgorithmProcessingState = createAction(
  SET_ALGORITHM_PROCESSING_STATE,
  props<{ processingState: AlgorithmProcessingState }>()
);

// PERSISTENCE
export const SAVE_TO_LOCAL_STORAGE = '[Algorithm Module] save to local storage';
export const saveToLocalStorage = createAction(SAVE_TO_LOCAL_STORAGE);

export const SAVE_TO_LOCAL_STORAGE_DONE = '[Algorithm Module] save to local storage done';
export const saveToLocalStorageDone = createAction(SAVE_TO_LOCAL_STORAGE_DONE);

export const LOAD_FROM_LOCAL_STORAGE = '[Algorithm Module] load from local storage';
export const loadFromLocalStorage = createAction(LOAD_FROM_LOCAL_STORAGE);

export const SET_ALGORITHM_STATE = '[Algorithm Module] set algorithm state';
export const setAlgorithmState = createAction(SET_ALGORITHM_STATE, props<{ newState: AlgorithmState }>());

export const RELOAD_ALGORITHM_STATE = '[Algorithm Module] reload algorithm state';
export const reloadAlgorithmState = createAction(RELOAD_ALGORITHM_STATE);

const all = union({
  setAlgorithmSpeed,
  setAlgorithm,
  setAlgorithmProcessingState,

  saveToLocalStorage,
  saveToLocalStorageDone,
  loadFromLocalStorage,
  setAlgorithmState,
  reloadAlgorithmState,
});

export type AlgorithmActionsTypes = typeof all;
