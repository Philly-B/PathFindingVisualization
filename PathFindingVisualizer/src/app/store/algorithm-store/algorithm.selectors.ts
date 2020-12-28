import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AlgorithmState } from './algorithm.reducer';

export const selectAlgorithmStore = (state: AppState) => state.algorithm;

export const selectFeatureAlgorithmSpeed = createSelector(
  selectAlgorithmStore,
  (state: AlgorithmState) => state.algorithmSpeed
);

export const selectFeatureAlgorithm = createSelector(selectAlgorithmStore, (state: AlgorithmState) => state.algorithm);
