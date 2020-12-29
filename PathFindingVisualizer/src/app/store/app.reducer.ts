import { AlgorithmEffects } from './algorithm-store/algorithm.effects';
import { algorithmReducer, AlgorithmState } from './algorithm-store/algorithm.reducer';
import { GraphEffects } from './graph-store/graph.effects';
import { graphReducer, GraphState } from './graph-store/graph.reducer';
import { settingsReducer, SettingsState } from './settings-store/settings.reducer';

export interface AppState {
  graph: GraphState;
  algorithm: AlgorithmState;
  settings: SettingsState;
}

export const selectSettingsState = (state: AppState) => state.settings;
export const selectGraphState = (state: AppState) => state.graph;
export const selectAlgorithmState = (state: AppState) => state.algorithm;

export const AppReducers = { graph: graphReducer, algorithm: algorithmReducer, settings: settingsReducer };
export const AppEffects = [GraphEffects, AlgorithmEffects];
