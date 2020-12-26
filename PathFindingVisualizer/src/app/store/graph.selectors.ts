import { createSelector } from '@ngrx/store';
import { GraphState } from './graph.reducer';

export interface AppState {
  graph: GraphState;
}

export const selectFeature = (state: AppState) => state.graph;

export const selectFeatureStartPosition = createSelector(selectFeature, (state: GraphState) => state.startPosition);

export const selectFeatureEndPosition = createSelector(selectFeature, (state: GraphState) => state.startPosition);

export const selectFeatureWalls = createSelector(selectFeature, (state: GraphState) => state.startPosition);