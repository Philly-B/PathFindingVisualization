import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  GraphControlMode,
  GraphControlSettings,
  GraphControlsEvent,
  GraphInteractionService,
} from '../../services/graph-interaction.service';

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

  constructor(private graphInteractionService: GraphInteractionService) {
    this.subscriptions.add(
      graphInteractionService.getGraphControlSettingsEventsObservable().subscribe(this.setButtonStates)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setStart = () => {
    this.graphInteractionService.addEventForClickOnControlButton(GraphControlsEvent.SET_START);
  };

  removeAllWalls = () => {
    this.graphInteractionService.addEventForClickOnControlButton(GraphControlsEvent.REMOVE_ALL_WALLS);
  };

  modifyWalls = () => {
    this.graphInteractionService.addEventForClickOnControlButton(GraphControlsEvent.MODIFY_WALLS);
  };

  setEnd = () => {
    this.graphInteractionService.addEventForClickOnControlButton(GraphControlsEvent.SET_END);
  };

  private setButtonStates = (graphControlSettings: GraphControlSettings): void => {
    this.setStartDisabled = graphControlSettings.setStart === GraphControlMode.DISABLED;
    this.setEndDisabled = graphControlSettings.setEnd === GraphControlMode.DISABLED;
    this.modifyWallsDisabled = graphControlSettings.modifyWalls === GraphControlMode.DISABLED;
    this.removeAllWallsDisabled = graphControlSettings.removeAllWalls === GraphControlMode.DISABLED;
  };
}
