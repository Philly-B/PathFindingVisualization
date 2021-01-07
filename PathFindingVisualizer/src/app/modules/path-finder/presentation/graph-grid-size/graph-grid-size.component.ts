import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinct, switchMap, take } from 'rxjs/operators';
import { GraphControlMode, GraphControlSettings } from 'src/app/model/GraphControlSettings';
import { AppState } from 'src/app/store/app.reducer';
import { reloadGraphState, setGridSize } from 'src/app/store/graph-store/graph.actions';
import { selectGraphControlSettings, selectGridSize } from 'src/app/store/graph-store/graph.selectors';

@Component({
  selector: 'app-graph-grid-size',
  templateUrl: './graph-grid-size.component.html',
  styleUrls: ['./graph-grid-size.component.scss'],
})
export class GraphGridSizeComponent implements OnInit, OnDestroy {
  initialGridSize: number;
  min = 5;
  max = 40;
  stepSize = 5;

  disabled = false;

  private subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {
    this.initialGridSize = -1;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.store
      .select(selectGridSize)
      .pipe(take(1))
      .subscribe((gridSize) => (this.initialGridSize = gridSize));

    this.subscriptions.add(
      this.store
        .select(reloadGraphState)
        .pipe(
          switchMap(() => this.store.select(selectGridSize)),
          distinct()
        )
        .subscribe((gridSize) => (this.initialGridSize = gridSize))
    );

    this.subscriptions.add(
      this.store.select(selectGraphControlSettings).subscribe(this.setDisabledBasedOnGraphControls)
    );
  }

  valueChanged = (event) => {
    const gridSize = event.target.value;
    this.store.dispatch(setGridSize({ gridSize }));
  };

  private setDisabledBasedOnGraphControls = (graphControlSettings: GraphControlSettings): void => {
    this.disabled =
      graphControlSettings.setStart === GraphControlMode.ENABLED ||
      graphControlSettings.setEnd === GraphControlMode.ENABLED ||
      graphControlSettings.modifyWalls === GraphControlMode.ENABLED ||
      graphControlSettings.removeAllWalls === GraphControlMode.ENABLED;
  };
}
