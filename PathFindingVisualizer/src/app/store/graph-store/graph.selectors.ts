import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { GraphState } from './graph.reducer';

export const selectGraphFeature = (state: AppState) => state.graph;

export const selectFeatureWalls = createSelector(selectGraphFeature, (state: GraphState) => state.walls);
