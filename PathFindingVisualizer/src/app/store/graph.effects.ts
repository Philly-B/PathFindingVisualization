import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs/operators';
import { Graph } from '../model/Graph';
import { GraphUtilService } from '../services/graph-util.service';
import {
  finalizeModifyWalls,
  finalizeSetEnd,
  finalizeSetStart,
  GraphActionsTypes,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  MODIFY_GRID_SIZE,
  setNewGraph,
  SET_END,
  SET_START,
} from './graph.actions';

@Injectable()
export class GraphEffects {
  constructor(private actions$: Actions<GraphActionsTypes>, private graphUtils: GraphUtilService) {}

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

  setGraphSize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MODIFY_GRID_SIZE),
      map((action) => setNewGraph({ graph: new Graph(this.graphUtils.initGraph(action.newGridSize)) }))
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
}
