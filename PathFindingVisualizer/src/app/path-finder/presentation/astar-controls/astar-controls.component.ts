import { Component, OnDestroy, OnInit } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Graph } from 'src/app/model/Graph';
import { AStarAlgorithm, AStarAlgorithmOptions } from 'src/app/PathFindingStrategies/AStarAlgorithm';
import { setNewGraph } from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';

@Component({
  selector: 'app-astar-controls',
  templateUrl: './astar-controls.component.html',
  styleUrls: ['./astar-controls.component.scss'],
})
export class AstarControlsComponent implements OnInit, OnDestroy {
  graph: Graph;

  private astartAlgorithm: AStarAlgorithm;
  private astartOptions: AStarAlgorithmOptions;

  private subscriptions = new Subscription();

  constructor(private store: Store<{ graph: GraphState }>, private actions: ActionsSubject) {
    this.astartAlgorithm = new AStarAlgorithm();
    this.astartOptions = new AStarAlgorithmOptions();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions.pipe(ofType(setNewGraph)).subscribe((newGraph) => (this.graph = newGraph.graph))
    );
  }

  run = (): void => {
    if (this.graph === undefined) {
      return;
    }

    const resultPath = this.astartAlgorithm.runAlgorithm(this.graph, this.astartOptions);
    if (resultPath.length === 0) {
      return;
    }
    // TODO how do we do it?!
  };
  stop() {}
  reset() {}
}
