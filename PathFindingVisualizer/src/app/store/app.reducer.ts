import { algorithmReducer, AlgorithmState } from './algorithm-store/algorithm.reducer';
import { graphReducer, GraphState } from './graph-store/graph.reducer';

export interface AppState {
  graph: GraphState;
  algorithm: AlgorithmState;
}

export const AppReducers = { graph: graphReducer, algorithm: algorithmReducer };
