import { createSelector } from '@ngrx/store';
import { GraphState } from './graph.reducer';
import { selectGraphState } from '../app.reducer';

export const selectFeatureWalls = createSelector(selectGraphState, (state: GraphState) => state.walls);
