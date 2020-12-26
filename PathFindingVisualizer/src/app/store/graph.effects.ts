import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Graph } from '../model/Graph';
import { GraphCell, GraphCellConstraint } from '../model/GraphCell';
import { GraphUtilService } from '../services/graph-util.service';
import {
  finalizeModifyWalls,
  finalizeSetEnd,
  finalizeSetStart,
  FINALIZE_SET_WALLS,
  GraphActionsTypes,
  initiateModifyWalls,
  initiateSetEnd,
  initiateSetStart,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  MODIFY_GRID_SIZE,
  MODIFY_WALLS,
  setNewGraph,
  SET_END,
  SET_START,
} from './graph.actions';
import { GraphState } from './graph.reducer';

@Injectable()
export class GraphEffects {
  constructor(
    private actions$: Actions<GraphActionsTypes>,
    private store$: Store<GraphState>,
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
      withLatestFrom(this.store$),
      map(([action, state]) => setNewGraph({ graph: this.createNewGraph(state) })),
      map(() => finalizeSetStart())
    )
  );

  setEnd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_END),
      withLatestFrom(this.store$),
      map(([action, state]) => setNewGraph({ graph: this.createNewGraph(state) })),
      map(() => finalizeSetEnd())
    )
  );

  setWalls$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FINALIZE_SET_WALLS),
      withLatestFrom(this.store$),
      map(([action, state]) => setNewGraph({ graph: this.createNewGraph(state) }))
    )
  );

  setGraphSize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MODIFY_GRID_SIZE),
      map((action) => setNewGraph({ graph: new Graph(this.graphUtils.initGraph(action.newGridSize)) }))
    )
  );

  private createNewGraph(graphState: GraphState): Graph {
    const newGraph = this.graphUtils.initGraph(graphState.graphSize);
    if (graphState.startPosition) {
      newGraph[graphState.startPosition.row][graphState.startPosition.column].graphCellConstraint =
        GraphCellConstraint.START;
    }
    if (graphState.endPosition) {
      newGraph[graphState.endPosition.row][graphState.endPosition.column].graphCellConstraint = GraphCellConstraint.END;
    }
    if (graphState.walls && graphState.walls.length > 0) {
      for (const wallCell of graphState.walls) {
        newGraph[wallCell.row][wallCell.column].graphCellConstraint = GraphCellConstraint.WALL;
      }
    }
    return new Graph(newGraph);
  }

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
