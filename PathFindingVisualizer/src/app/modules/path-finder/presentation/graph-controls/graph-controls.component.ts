import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { GraphControlMode, GraphControlSettings } from 'src/app/model/GraphControlSettings';
import { AppState } from 'src/app/store/app.reducer';
import {
  triggerEndButton,
  triggerModifyWallsButton,
  triggerRemoveAllWallsButton,
  triggerStartButton,
} from 'src/app/store/graph-store/graph.actions';
import { selectGraphControlSettings } from 'src/app/store/graph-store/graph.selectors';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss'],
})
export class GraphControlsComponent implements OnDestroy {
  private subscriptions = new Subscription();

  setStartDisabled = false;
  setEndDisabled = false;
  modifyWallsDisabled = false;
  removeAllWallsDisabled = false;

  constructor(private store: Store<AppState>) {
    this.subscriptions.add(store.select(selectGraphControlSettings).pipe(distinct()).subscribe(this.setButtonStates));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setStart = () => {
    this.store.dispatch(triggerStartButton());
  };

  removeAllWalls = () => {
    this.store.dispatch(triggerRemoveAllWallsButton());
  };

  modifyWalls = () => {
    this.store.dispatch(triggerModifyWallsButton());
  };

  setEnd = () => {
    this.store.dispatch(triggerEndButton());
  };

  private setButtonStates = (graphControlSettings: GraphControlSettings): void => {
    this.setStartDisabled = graphControlSettings.setStart === GraphControlMode.DISABLED;
    this.setEndDisabled = graphControlSettings.setEnd === GraphControlMode.DISABLED;
    this.modifyWallsDisabled = graphControlSettings.modifyWalls === GraphControlMode.DISABLED;
    this.removeAllWallsDisabled = graphControlSettings.removeAllWalls === GraphControlMode.DISABLED;
  };
}
