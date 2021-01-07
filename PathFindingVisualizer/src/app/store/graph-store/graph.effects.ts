import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
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

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_START, SET_END, REMOVE_ALL_WALLS, REMOVE_WALL, SET_WALL, SET_GRID_SIZE, RESET_ALGORITHM_DATA),
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
}
