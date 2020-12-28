import { Component, OnDestroy } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { concatAll, switchMap, take, tap } from 'rxjs/operators';
import {
  FINALIZE_SET_END,
  FINALIZE_SET_START,
  FINALIZE_SET_WALLS,
  initiateModifyWalls,
  initiateSetEnd,
  initiateSetStart,
  removeAllWalls,
  removeWall,
} from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';
import { selectFeatureWalls } from 'src/app/store/graph.selectors';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss'],
})
export class GraphControlsComponent implements OnDestroy {
  startIsActivated = false;
  modifyWallsActivated = false;
  setEndActivated = false;

  private subscriptions = new Subscription();

  constructor(private store: Store<{ graph: GraphState }>, private actions: ActionsSubject) {
    this.subscriptions.add(actions.pipe(ofType(FINALIZE_SET_START)).subscribe((a) => (this.startIsActivated = false)));
    this.subscriptions.add(actions.pipe(ofType(FINALIZE_SET_END)).subscribe((a) => (this.setEndActivated = false)));
    this.subscriptions.add(
      actions.pipe(ofType(FINALIZE_SET_WALLS)).subscribe((a) => (this.modifyWallsActivated = false))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setStart = () => {
    if (this.startIsActivated) {
      return;
    }
    this.startIsActivated = true;
    this.store.dispatch(initiateSetStart());
  };

  clearWalls = () => {
    this.store.dispatch(removeAllWalls());
  };

  modifyWalls = () => {
    if (this.modifyWallsActivated) {
      return;
    }
    this.modifyWallsActivated = true;
    this.store.dispatch(initiateModifyWalls());
  };

  setEnd = () => {
    if (this.setEndActivated) {
      return;
    }
    this.setEndActivated = true;
    this.store.dispatch(initiateSetEnd());
  };
}