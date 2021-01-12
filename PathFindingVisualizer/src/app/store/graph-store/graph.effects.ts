import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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
} from './graph.actions';
import { SettingsActionsTypes, UPDATE_COLOR_SETTINGS } from 'src/app/store/settings-store/settings.actions';
import { GraphState, GRAPH_STATE_LOCAL_STORAGE_KEY } from './graph.reducer';
import { selectGraphState } from './graph.selectors';

@Injectable()
export class GraphEffects {
  constructor(
    private graphActions$: Actions<GraphActionsTypes>,
    private settingsActions$: Actions<SettingsActionsTypes>,
    private store$: Store<AppState>,
    private localStorage: LocalStorageService
  ) { }

  setDrawingModeLoop$ = createEffect(() =>
    this.graphActions$.pipe(
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
    this.graphActions$.pipe(
      ofType(REMOVE_ALL_WALLS),
      map((a) => setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.REDRAW_ONCE }))
    )
  );

  setDrawingModeOnceForSettings$ = createEffect(() =>
    this.settingsActions$.pipe(
      ofType(UPDATE_COLOR_SETTINGS),
      map((a) => setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.REDRAW_ONCE }))
    )
  );

  setStart$ = createEffect(() =>
    this.graphActions$.pipe(
      ofType(SET_START),
      withLatestFrom(this.store$.select(selectGraphState)),
      filter(([a, state]) => state.graphControlSettings.setStart === GraphControlMode.ENABLED),
      map((a) => triggerStartButton())
    )
  );

  setEnd$ = createEffect(() =>
    this.graphActions$.pipe(
      ofType(SET_END),
      withLatestFrom(this.store$.select(selectGraphState)),
      filter(([a, state]) => state.graphControlSettings.setEnd === GraphControlMode.ENABLED),
      map((a) => triggerEndButton())
    )
  );

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.graphActions$.pipe(
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
    this.graphActions$.pipe(
      ofType(SAVE_TO_LOCAL_STORAGE),
      withLatestFrom(this.store$.select(selectGraphState)),
      map(([action, store]) => this.localStorage.persistState(GRAPH_STATE_LOCAL_STORAGE_KEY, store)),
      map((a) => saveToLocalStorageDone())
    )
  );

  loadFromLocalStorage$ = createEffect(() =>
    this.graphActions$.pipe(
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
