import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AlgorithmProcessingState } from 'src/app/model/AlgorithmProcessingState';
import { GraphDrawingMode } from 'src/app/model/GraphDrawingMode';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AppState } from '../app.reducer';
import { setGraphDrawingMode } from '../graph-store/graph.actions';
import {
  SET_ALGORITHM,
  SET_ALGORITHM_SPEED,
  AlgorithmActionsTypes,
  saveToLocalStorage,
  saveToLocalStorageDone,
  SAVE_TO_LOCAL_STORAGE,
  LOAD_FROM_LOCAL_STORAGE,
  reloadAlgorithmState,
  setAlgorithmState,
  SET_ALGORITHM_PROCESSING_STATE,
} from './algorithm.actions';
import { AlgorithmState, ALGORITHM_STATE_LOCAL_STORAGE_KEY } from './algorithm.reducer';
import { selectAlgorithmState } from './algorithm.selectors';

@Injectable()
export class AlgorithmEffects {
  constructor(
    private actions$: Actions<AlgorithmActionsTypes>,
    private store$: Store<AppState>,
    private localStorage: LocalStorageService
  ) {}

  setDrawingModeLoopWhileAlgorithm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_ALGORITHM_PROCESSING_STATE),
      map((a) => {
        if (a.processingState === AlgorithmProcessingState.RUNNING) {
          return setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.CONTINUOUS_REDRAW });
        }
        return setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.STATIC_IMAGE });
      })
    )
  );

  setDrawingModeWhenResetting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_ALGORITHM_PROCESSING_STATE),
      filter((a) => a.processingState === AlgorithmProcessingState.NONE),
      map((a) => setGraphDrawingMode({ graphDrawingMode: GraphDrawingMode.REDRAW_ONCE }))
    )
  );

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_ALGORITHM, SET_ALGORITHM_SPEED),
      map((a) => saveToLocalStorage())
    )
  );

  saveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_TO_LOCAL_STORAGE),
      withLatestFrom(this.store$.select(selectAlgorithmState)),
      map(([action, store]) => this.localStorage.persistState(ALGORITHM_STATE_LOCAL_STORAGE_KEY, store)),
      map((a) => saveToLocalStorageDone())
    )
  );

  loadFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_FROM_LOCAL_STORAGE),
      switchMap((a) => [
        setAlgorithmState({ newState: this.localStorage.getState<AlgorithmState>(ALGORITHM_STATE_LOCAL_STORAGE_KEY) }),
        reloadAlgorithmState(),
      ])
    )
  );
}
