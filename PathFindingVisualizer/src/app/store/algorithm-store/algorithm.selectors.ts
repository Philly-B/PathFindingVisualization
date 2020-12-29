import { createSelector } from '@ngrx/store';
import { selectAlgorithmState } from '../app.reducer';
import { AlgorithmState } from './algorithm.reducer';

export const selectFeatureAlgorithmSpeed = createSelector(
  selectAlgorithmState,
  (state: AlgorithmState) => state.algorithmSpeed
);

export const selectFeatureAlgorithm = createSelector(selectAlgorithmState, (state: AlgorithmState) => state.algorithm);
