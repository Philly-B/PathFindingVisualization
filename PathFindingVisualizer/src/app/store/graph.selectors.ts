import { createSelector } from '@ngrx/store';
import { GraphState } from './graph.reducer';

export interface AppState {
  graph: GraphState;
}

export const selectGraphFeature = (state: AppState) => state.graph;

export const selectFeatureStartPosition = createSelector(
  selectGraphFeature,
  (state: GraphState) => state.startPosition
);

export const selectFeatureEndPosition = createSelector(selectGraphFeature, (state: GraphState) => state.endPosition);

export const selectFeatureWalls = createSelector(selectGraphFeature, (state: GraphState) => state.walls);
