import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { GraphUtilService } from 'src/app/services/graph-util.service';
import { selectFeatureAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { resetAlgorithmData, updateGraphCell } from 'src/app/store/graph-store/graph.actions';
import { GraphState } from 'src/app/store/graph-store/graph.reducer';
import { AbstractAlgorithm } from '../../algorithms/AbstractAlgorithm';
import { AlgorithmProviderService } from '../../algorithms/algorithm-provider.service';
import { AlgorithmOptions } from '../../algorithms/AlgorithmOptions';

@Component({
  selector: 'app-algorithm-controls',
  templateUrl: './algorithm-controls.component.html',
  styleUrls: ['./algorithm-controls.component.scss'],
})
export class AlgorithmControlsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() algorithm: string;

  private algorithmImpl: AbstractAlgorithm;
  private options: AlgorithmOptions;

  private subscriptions = new Subscription();

  allDisabled = true;
  private stopped: boolean;
  private done: boolean;

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private graphUtilService: GraphUtilService,
    private algorithmProvider: AlgorithmProviderService
  ) {
    this.subscriptions.add(
      store.select(selectFeatureAlgorithmSpeed).subscribe((algorithmSpeed) => this.setAlgorithmSpeed(algorithmSpeed))
    );
  }

  private setAlgorithmSpeed = (algorithmSpeed: number): void => {
    if (this.options === undefined) {
      this.options = new AlgorithmOptions(algorithmSpeed);
    } else {
      this.options.algorithmSpeed = algorithmSpeed;
    }
    this.updateAllDisabled();
  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['algorithm']) {
      this.reset();
    }
    this.updateAllDisabled();
  }

  ngOnInit(): void {}

  run = (): void => {
    this.stopped = false;
    if (this.algorithmImpl === undefined) {
      this.store.pipe(take(1)).subscribe((state) => this.initiateAlgorithm(state));
    } else {
      this.runAlgorithm();
    }
  };
  stop() {
    this.stopped = true;
  }
  reset() {
    this.algorithmImpl = undefined;
    this.stopped = false;
    this.done = false;
    this.store.dispatch(resetAlgorithmData());
  }

  private updateAllDisabled() {
    this.allDisabled = this.options === undefined || this.algorithm === undefined;
  }
  private async runAlgorithm() {
    while (!this.done && !this.stopped) {
      this.runOneIterationOfAlgorithm();
      await new Promise((resolve) => setTimeout(resolve, this.options.algorithmSpeed));
    }
  }

  private runOneIterationOfAlgorithm = () => {
    if (this.algorithmImpl && !this.done && this.algorithmImpl.finished) {
      this.stopped = true;
      this.done = true;
      for (const resultCell of this.algorithmImpl.result) {
        this.dispatchGraphState(resultCell, FINAL_PATH_FIELD_ID);
      }
    } else if (this.algorithmImpl && !this.done && !this.algorithmImpl.finished) {
      this.algorithmImpl.continueAlgorithm();
    }
  };

  private initiateAlgorithm = (state: AppState): void => {
    const graphState = state.graph;
    this.assertContainsStartAndEnd(graphState);

    const graph = this.graphUtilService.initGraphForAlgorithm(graphState.N);
    this.initGraphFromState(graph, graphState);

    this.stopped = false;
    this.algorithmImpl = this.algorithmProvider.createNewInstance(
      this.algorithm,
      graph,
      this.options,
      this.dispatchGraphState
    );
    this.runAlgorithm();
  };

  private dispatchGraphState = (cell: RowColumnPair, newState: number): boolean => {
    const newConstraint: GraphCellConstraint = this.mapAlgorithmNumberToGraphConstraint(newState);

    this.store.dispatch(updateGraphCell({ cell, newConstraint }));

    return true;
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
