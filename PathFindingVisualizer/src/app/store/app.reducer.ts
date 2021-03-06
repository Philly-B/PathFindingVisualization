import { AlgorithmEffects } from './algorithm-store/algorithm.effects';
import { algorithmReducer, AlgorithmState } from './algorithm-store/algorithm.reducer';
import { GraphEffects } from './graph-store/graph.effects';
import { SettingsEffects } from './settings-store/settings.effects';
import { graphReducer, GraphState } from './graph-store/graph.reducer';
import { settingsReducer, SettingsState } from './settings-store/settings.reducer';

export interface AppState {
  graph: GraphState;
  algorithm: AlgorithmState;
  settings: SettingsState;
}

export const AppReducers = { graph: graphReducer, algorithm: algorithmReducer, settings: settingsReducer };
export const AppEffects = [GraphEffects, AlgorithmEffects, SettingsEffects];
