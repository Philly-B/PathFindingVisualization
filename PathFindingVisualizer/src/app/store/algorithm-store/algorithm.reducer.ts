import { createReducer, on } from '@ngrx/store';
import { INITIAL_ALGORITHM_SPEED } from '../../constants/GeneralConstants';
import { setAlgorithm, setAlgorithmSpeed } from './algorithm.actions';

export class AlgorithmState {
  algorithmSpeed: number;
  algorithm: string;
}

export const initialState: AlgorithmState = {
  algorithmSpeed: INITIAL_ALGORITHM_SPEED,
  algorithm: undefined,
};

const algorithmReducerInternal = createReducer(
  initialState,
  on(setAlgorithmSpeed, (state, { speed }) => ({ ...state, algorithmSpeed: speed })),
  on(setAlgorithm, (state, { algorithm }) => ({ ...state, algorithm }))
);

export function algorithmReducer(state, action) {
  return algorithmReducerInternal(state, action);
}
