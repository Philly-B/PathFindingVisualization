import { Component, EventEmitter, Output } from '@angular/core';
import { GraphControlsEvent, GraphInteractionService } from '../../services/graph-interaction.service';

@Component({
  selector: 'app-graph-controls',
  templateUrl: './graph-controls.component.html',
  styleUrls: ['./graph-controls.component.scss'],
})
export class GraphControlsComponent {
  constructor(private graphInteractionService: GraphInteractionService) {}

  setStart = () => {
    this.graphInteractionService.addNewGraphControlEvent(GraphControlsEvent.SET_START);
  };

  removeAllWalls = () => {
    this.graphInteractionService.addNewGraphControlEvent(GraphControlsEvent.REMOVE_ALL_WALLS);
  };

  modifyWalls = () => {
    this.graphInteractionService.addNewGraphControlEvent(GraphControlsEvent.SET_WALLS);
  };

  setEnd = () => {
    this.graphInteractionService.addNewGraphControlEvent(GraphControlsEvent.SET_END);
  };
}
