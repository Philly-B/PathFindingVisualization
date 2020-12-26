import { createSelector } from '@ngrx/store';
import { GraphState } from './graph.reducer';

export interface AppState {
  graph: GraphState;
}

export const selectFeature = (state: AppState) => state.graph;

export const selectFeatureStartPosition = createSelector(selectFeature, (state: GraphState) => state.startPosition);

export const selectFeatureEndPosition = createSelector(selectFeature, (state: GraphState) => state.endPosition);

export const selectFeatureWalls = createSelector(selectFeature, (state: GraphState) => state.walls);

export const selectGraphSize = createSelector(selectFeature, (state: GraphState) => state.graphSize);
