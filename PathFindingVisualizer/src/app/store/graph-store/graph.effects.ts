import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { concatAll, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppState } from '../app.reducer';
import {
  finalizeSetEnd,
  finalizeSetStart,
  GraphActionsTypes,
  initiateModifyWalls,
  initiateSetEnd,
  initiateSetStart,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  LOAD_FROM_LOCAL_STORAGE,
  removeWall,
  REMOVE_ALL_WALLS,
  saveToLocalStorageDone,
  setGraphState,
  SAVE_TO_LOCAL_STORAGE,
  finalizeSetWalls,
  SET_END,
  SET_START,
  FINALIZE_SET_END,
  FINALIZE_SET_START,
  FINALIZE_SET_WALLS,
  REMOVE_WALL,
  saveToLocalStorage,
  reloadGraphState,
  SET_WALL,
  SET_GRID_SIZE,
} from './graph.actions';
import { GraphState, GRAPH_STATE_LOCAL_STORAGE_KEY } from './graph.reducer';
import { selectGraphState } from './graph.selectors';

@Injectable()
export class GraphEffects {
  constructor(
    private actions$: Actions<GraphActionsTypes>,
    private store$: Store<AppState>,
    private localStorage: LocalStorageService
  ) { }

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FINALIZE_SET_END, FINALIZE_SET_START, FINALIZE_SET_WALLS, REMOVE_WALL, SET_WALL, SET_GRID_SIZE),
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

  onlyOneControlEnabled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INIT_SET_START, INIT_SET_END, INIT_MODIFY_WALLS),
      switchMap((currentInit: Action) => this.finalizeOthers(currentInit.type))
    )
  );

  setStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_START),
      map(() => finalizeSetStart())
    )
  );

  setEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_END),
      map(() => finalizeSetEnd())
    )
  );

  removeAllWalls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(REMOVE_ALL_WALLS),
      withLatestFrom(this.store$.select(selectGraphState)),
      map(([a, store]) => store.walls),
      concatAll(),
      map((exWall) => removeWall({ exWall }))
    )
  );

  private finalizeOthers = (typeToRun: string): Action[] => {
    if (typeToRun === initiateSetStart.type) {
      return [finalizeSetEnd(), finalizeSetWalls()];
    } else if (typeToRun === initiateSetEnd.type) {
      return [finalizeSetStart(), finalizeSetWalls()];
    } else if (typeToRun === initiateModifyWalls.type) {
      return [finalizeSetStart(), finalizeSetEnd()];
    }
    throw new Error('Unknown type to handle ' + typeToRun);
  };
}
