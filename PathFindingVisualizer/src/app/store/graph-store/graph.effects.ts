import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GraphControlMode, GraphControlSettings } from 'src/app/model/GraphControlSettings';
import { GraphDrawingMode } from 'src/app/model/GraphDrawingMode';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppState } from '../app.reducer';
import {
  GraphActionsTypes,
  LOAD_FROM_LOCAL_STORAGE,
  REMOVE_ALL_WALLS,
  saveToLocalStorageDone,
  setGraphState,
  SAVE_TO_LOCAL_STORAGE,
  SET_END,
  SET_START,
  REMOVE_WALL,
  saveToLocalStorage,
  reloadGraphState,
  SET_WALL,
  SET_GRID_SIZE,
  RESET_ALGORITHM_DATA,
  TRIGGER_END_BUTTON,
  TRIGGER_REMOVE_ALL_WALLS_BUTTON,
  TRIGGER_MODIFY_WALLS_BUTTON,
  TRIGGER_START_BUTTON,
  triggerStartButton,
  triggerEndButton,
  setGraphDrawingMode,
  SET_GRAPH_DRAWING_MODE,
  ENABLE_GRAPH_CONTROLS,
  DISABLE_GRAPH_CONTROLS,
} from './graph.actions';
import { GraphState, GRAPH_STATE_LOCAL_STORAGE_KEY } from './graph.reducer';
import { selectGraphState } from './graph.selectors';

@Injectable()
export class GraphEffects {
  constructor(
    private actions$: Actions<GraphActionsTypes>,
    private store$: Store<AppState>,
    private localStorage: LocalStorageService
  ) {}

  setDrawingModeLoop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TRIGGER_START_BUTTON, TRIGGER_END_BUTTON, TRIGGER_MODIFY_WALLS_BUTTON),
      withLatestFrom(this.store$.select(selectGraphState)),
      map(([a, graphState]) => {
        if (
          this.anyGraphControlTrue(graphState.graphControlSettings) &&
          graphState.graphDrawingMode !== GraphDrawingMode.CONTINUOUS_REDRAW
        ) {
          return setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.CONTINUOUS_REDRAW });
        } else if (
          this.noGraphControlTrue(graphState.graphControlSettings) &&
          graphState.graphDrawingMode !== GraphDrawingMode.STATIC_IMAGE
        ) {
          return setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.STATIC_IMAGE });
        }
        return undefined;
      }),
      filter((a) => a !== undefined)
    )
  );

  setDrawingModeOnce$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REMOVE_ALL_WALLS),
      map((a) => setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.REDRAW_ONCE }))
    )
  );

  setStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_START),
      withLatestFrom(this.store$.select(selectGraphState)),
      filter(([a, state]) => state.graphControlSettings.setStart === GraphControlMode.ENABLED),
      map((a) => triggerStartButton())
    )
  );

  setEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_END),
      withLatestFrom(this.store$.select(selectGraphState)),
      filter(([a, state]) => state.graphControlSettings.setEnd === GraphControlMode.ENABLED),
      map((a) => triggerEndButton())
    )
  );

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SET_START,
        SET_END,
        REMOVE_ALL_WALLS,
        REMOVE_WALL,
        SET_WALL,
        SET_GRID_SIZE,
        RESET_ALGORITHM_DATA,
        TRIGGER_END_BUTTON,
        TRIGGER_REMOVE_ALL_WALLS_BUTTON,
        TRIGGER_MODIFY_WALLS_BUTTON,
        TRIGGER_START_BUTTON,
        SET_GRAPH_DRAWING_MODE
      ),
      map((a) => saveToLocalStorage())
    )
  );

  saveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_TO_LOCAL_STORAGE),
      withLatestFrom(this.store$.select(selectGraphState)),
      map(([action, store]) => this.localStorage.persistState(GRAPH_STATE_LOCAL_STORAGE_KEY, store)),
      map((a) => saveToLocalStorageDone())
    )
  );

  loadFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_FROM_LOCAL_STORAGE),
      switchMap((a) => [
        setGraphState({ newState: this.localStorage.getState<GraphState>(GRAPH_STATE_LOCAL_STORAGE_KEY) }),
        reloadGraphState(),
      ])
    )
  );

  private anyGraphControlTrue = (graphControlSettings: GraphControlSettings): boolean => {
    return (
      graphControlSettings.setStart === GraphControlMode.ENABLED ||
      graphControlSettings.setEnd === GraphControlMode.ENABLED ||
      graphControlSettings.modifyWalls === GraphControlMode.ENABLED
    );
  };

  private noGraphControlTrue = (graphControlSettings: GraphControlSettings): boolean => {
    return (
      graphControlSettings.setStart !== GraphControlMode.ENABLED &&
      graphControlSettings.setEnd !== GraphControlMode.ENABLED &&
      graphControlSettings.modifyWalls !== GraphControlMode.ENABLED
    );
  };
}
