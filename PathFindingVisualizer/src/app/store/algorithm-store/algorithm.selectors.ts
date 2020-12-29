import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AlgorithmState } from './algorithm.reducer';

export const selectAlgorithmState = (state: AppState) => state.algorithm;

export const selectFeatureAlgorithmSpeed = createSelector(
  selectAlgorithmState,
  (state: AlgorithmState) => state.algorithmSpeed
);

export const selectFeatureAlgorithm = createSelector(selectAlgorithmState, (state: AlgorithmState) => state.algorithm);
