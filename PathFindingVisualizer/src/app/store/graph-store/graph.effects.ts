import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { concatAll, map, mergeMap, switchMap, tap, toArray, withLatestFrom } from 'rxjs/operators';
import { GraphUtilService } from '../../services/graph-util.service';
import { AppState } from '../app.reducer';
import {
  finalizeModifyWalls,
  finalizeSetEnd,
  finalizeSetStart,
  GraphActionsTypes,
  initiateModifyWalls,
  initiateSetEnd,
  initiateSetStart,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  removeWall,
  REMOVE_ALL_WALLS,
  SET_END,
  SET_START,
} from './graph.actions';
import { selectGraphFeature } from './graph.selectors';

@Injectable()
export class GraphEffects {
  constructor(
    private actions$: Actions<GraphActionsTypes>,
    private store$: Store<AppState>,
    private graphUtils: GraphUtilService
  ) {}

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
      withLatestFrom(this.store$.select(selectGraphFeature)),
      map(([a, store]) => store.walls),
      concatAll(),
      map((exWall) => removeWall({ exWall }))
    )
  );

  private finalizeOthers = (typeToRun: string): Action[] => {
    if (typeToRun === initiateSetStart.type) {
      return [finalizeSetEnd(), finalizeModifyWalls()];
    } else if (typeToRun === initiateSetEnd.type) {
      return [finalizeSetStart(), finalizeModifyWalls()];
    } else if (typeToRun === initiateModifyWalls.type) {
      return [finalizeSetStart(), finalizeSetEnd()];
    }
    throw new Error('Unknown type to handle ' + typeToRun);
  };
}
