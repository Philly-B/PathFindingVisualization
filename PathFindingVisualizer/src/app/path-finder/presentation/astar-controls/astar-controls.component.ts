import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  END_FIELD_ID,
  IN_CONSIDERATION_FIELD_ID,
  FINAL_PATH_FIELD_ID,
  START_FIELD_ID,
  VISITED_FIELD_ID,
  WALL_FIELD_ID,
} from 'src/app/constants/AlgorithmConstants';
import { EndNotDefinedError, StartNotDefinedError } from 'src/app/errors/AlgorithmErrors';
import { BaseError } from 'src/app/errors/BaseError';
import { GraphCellConstraint } from 'src/app/model/GraphCell';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { AStarAlgorithm, AStarAlgorithmOptions } from 'src/app/PathFindingStrategies/AStarAlgorithm';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import { FINALIZE_SET_WALLS, updateGraphCell } from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';

@Component({
  selector: 'app-astar-controls',
  templateUrl: './astar-controls.component.html',
  styleUrls: ['./astar-controls.component.scss'],
})
export class AstarControlsComponent implements OnInit, OnDestroy {
  private astartAlgorithm: AStarAlgorithm;
  private astartOptions: AStarAlgorithmOptions;

  private subscriptions = new Subscription();

  constructor(
    private store: Store<{ graph: GraphState }>,
    private actions: ActionsSubject,
    private graphUtilService: GraphUtilService
  ) {
    this.astartAlgorithm = new AStarAlgorithm();
    this.astartOptions = new AStarAlgorithmOptions();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {}

  run = (): void => {
    this.store.pipe(take(1)).subscribe((state) => this.runAlgorithmFor(state));
  };
  stop() {}
  reset() {}

  private runAlgorithmFor(state: { graph: GraphState }): void {
    const graphState = state.graph;

    this.assertContainsStartAndEnd(graphState);

    const graph = this.graphUtilService.initGraphForAlgorithm(graphState.N);
    this.initGraphFromState(graph, graphState);

    const resultPath = this.astartAlgorithm.runAlgorithm(graph, this.astartOptions, this.dispatchGraphState);
    if (resultPath.length === 0) {
      return;
    }
    console.log('result', resultPath);
    for (const resultCell of resultPath) {
      this.dispatchGraphState(resultCell, FINAL_PATH_FIELD_ID);
    }
  }

  private dispatchGraphState = (cell: RowColumnPair, newState: number): void => {
    const newConstraint: GraphCellConstraint = this.mapAlgorithmNumberToGraphConstraint(newState);

    this.store.dispatch(updateGraphCell({ cell, newConstraint }));
  };

  private mapAlgorithmNumberToGraphConstraint(newState: number): GraphCellConstraint {
    switch (newState) {
      case IN_CONSIDERATION_FIELD_ID:
        return GraphCellConstraint.IN_CONSIDERATION;
      case VISITED_FIELD_ID:
        return GraphCellConstraint.VISITED;
      case FINAL_PATH_FIELD_ID:
        return GraphCellConstraint.FINAL_PATH;
    }
    // TODO better error handling
    throw new BaseError();
  }

  private assertContainsStartAndEnd(graphState: GraphState) {
    if (graphState.startPosition === undefined) {
      throw new StartNotDefinedError();
    }
    if (graphState.endPosition === undefined) {
      throw new EndNotDefinedError();
    }
    // TODO handle this in a useful way
  }

  private initGraphFromState(graph: number[][], graphState: GraphState) {
    graph[graphState.startPosition.row][graphState.startPosition.column] = START_FIELD_ID;
    graph[graphState.endPosition.row][graphState.endPosition.column] = END_FIELD_ID;

    for (const wall of graphState.walls) {
      graph[wall.row][wall.column] = WALL_FIELD_ID;
    }
  }
}
