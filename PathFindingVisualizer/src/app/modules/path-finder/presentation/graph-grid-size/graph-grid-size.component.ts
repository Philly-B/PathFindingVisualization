import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinct, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { reloadGraphState, setGridSize } from 'src/app/store/graph-store/graph.actions';
import { selectGridSize } from 'src/app/store/graph-store/graph.selectors';

@Component({
  selector: 'app-graph-grid-size',
  templateUrl: './graph-grid-size.component.html',
  styleUrls: ['./graph-grid-size.component.scss']
})
export class GraphGridSizeComponent implements OnInit, OnDestroy {

  initialGridSize: number;
  min = 5;
  max = 40;
  stepSize = 5;

  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.initialGridSize = -1;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store
      .select(selectGridSize)
      .pipe(take(1))
      .subscribe((gridSize) => (this.initialGridSize = gridSize));

    this.subscription = this.store
      .select(reloadGraphState)
      .pipe(
        switchMap(() => this.store.select(selectGridSize)),
        distinct())
      .subscribe((gridSize) => (this.initialGridSize = gridSize));
  }

  valueChanged = (event) => {
    const gridSize = event.target.value;
    this.store.dispatch(setGridSize({ gridSize }));
  };

}
