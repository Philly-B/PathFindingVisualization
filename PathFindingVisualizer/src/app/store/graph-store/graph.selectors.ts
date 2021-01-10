import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { GraphState } from './graph.reducer';

export const selectGraphState = (state: AppState) => state.graph;
export const selectFeatureWalls = createSelector(selectGraphState, (state: GraphState) => state.walls);

export const selectGridSize = createSelector(selectGraphState, (state: GraphState) => state.gridSize);

export const selectGraphControlSettings = createSelector(
  selectGraphState,
  (state: GraphState) => state.graphControlSettings
);

export const selectGraphDrawingMode = createSelector(selectGraphState, (state: GraphState) => state.graphDrawingMode);
