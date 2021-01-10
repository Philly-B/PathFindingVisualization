import { createReducer, on } from '@ngrx/store';
import { AlgorithmProcessingState } from 'src/app/model/AlgorithmProcessingState';
import { INITIAL_ALGORITHM_SPEED } from '../../constants/GeneralConstants';
import { setAlgorithm, setAlgorithmSpeed, setAlgorithmState } from './algorithm.actions';

export class AlgorithmState {
  algorithmSpeed: number;
  algorithm: string;
  algorithmProcessingState: AlgorithmProcessingState;
}

export const initialState: AlgorithmState = {
  algorithmSpeed: INITIAL_ALGORITHM_SPEED,
  algorithm: undefined,
  algorithmProcessingState: AlgorithmProcessingState.NONE,
};

export const ALGORITHM_STATE_LOCAL_STORAGE_KEY = 'algorithm-state';

const algorithmReducerInternal = createReducer(
  initialState,
  on(setAlgorithmSpeed, (state, { speed }) => ({ ...state, algorithmSpeed: speed })),
  on(setAlgorithm, (state, { algorithm }) => ({ ...state, algorithm })),

  on(setAlgorithmState, (state, { newState }) => ({ ...state, ...newState }))
);

export function algorithmReducer(state, action) {
  return algorithmReducerInternal(state, action);
}
