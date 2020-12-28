import { createSelector } from '@ngrx/store';
import { GraphState } from './graph.reducer';

export interface AppState {
  graph: GraphState;
}

export const selectGraphFeature = (state: AppState) => state.graph;

export const selectFeatureAlgorithmSpeed = createSelector(
  selectGraphFeature,
  (state: GraphState) => state.algorithmSpeed
);

export const selectFeatureWalls = createSelector(selectGraphFeature, (state: GraphState) => state.walls);
