import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { GraphState } from './graph.reducer';

export const selectGraphState = (state: AppState) => state.graph;
export const selectFeatureWalls = createSelector(selectGraphState, (state: GraphState) => state.walls);
