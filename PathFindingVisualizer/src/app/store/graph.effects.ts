import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  finalizeModifyWalls,
  finalizeSetEnd,
  finalizeSetStart,
  FINALIZE_SET_WALLS,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  SET_END,
  SET_START,
} from './graph.actions';

@Injectable()
export class GraphEffects {
  onlyOneControlEnabled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INIT_SET_START, INIT_SET_END, INIT_MODIFY_WALLS),
      switchMap((currentInit: Action) => this.getAllActionsBut(currentInit.type))
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

  private getAllActionsBut = (typeToExclude: string): Action[] => {
    const result = [finalizeSetStart(), finalizeSetEnd(), finalizeModifyWalls()];
    for (let i = 0; i < result.length; i++) {
      if (result[i].type === typeToExclude) {
        result.splice(i, 1);
      }
    }
    return result;
  };

  constructor(private actions$: Actions) {}
}
