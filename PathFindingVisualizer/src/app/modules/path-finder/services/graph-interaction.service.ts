import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphInteractionService {
  private graphControlSettingsEvents = new Subject<GraphControlSettings>();
  private graphControlSettings = initialGraphControlSettings;

  constructor() {
    this.graphControlSettingsEvents.next(this.graphControlSettings);
  }

  addEventForStateHandled(event: GraphControlsEvent) {
    this.addEventForClickOnControlButton(event);
  }

  addEventForClickOnControlButton(event: GraphControlsEvent): void {
    switch (event) {
      case GraphControlsEvent.SET_START:
        this.handleSetting(this.nameOf<GraphControlSettings>('setStart'));
        break;
      case GraphControlsEvent.SET_END:
        this.handleSetting(this.nameOf<GraphControlSettings>('setEnd'));
        break;
      case GraphControlsEvent.MODIFY_WALLS:
        this.handleSetting(this.nameOf<GraphControlSettings>('modifyWalls'));
        break;
      case GraphControlsEvent.REMOVE_ALL_WALLS:
        this.handleSetting(this.nameOf<GraphControlSettings>('removeAllWalls'));
        break;
    }
    this.graphControlSettingsEvents.next(this.graphControlSettings);
  }

  getGraphControlSettingsEventsObservable(): Observable<GraphControlSettings> {
    return this.graphControlSettingsEvents.asObservable();
  }

  private handleSetting(setting: string): void {
    if (this.graphControlSettings[setting] === GraphControlMode.ENABLED) {
      this.setAllStatesTo(GraphControlMode.NONE);
    } else {
      this.setAllStatesTo(GraphControlMode.DISABLED);
      this.graphControlSettings[setting] = GraphControlMode.ENABLED;
    }
  }

  private setAllStatesTo(newState: GraphControlMode): void {
    this.graphControlSettings.setStart = newState;
    this.graphControlSettings.setEnd = newState;
    this.graphControlSettings.modifyWalls = newState;
    this.graphControlSettings.removeAllWalls = newState;
  }

  private nameOf = <T>(name: keyof T) => name;
}

export enum GraphControlsEvent {
  SET_START,
  SET_END,
  MODIFY_WALLS,
  REMOVE_ALL_WALLS,
}

export class GraphControlSettings {
  setStart: GraphControlMode;
  setEnd: GraphControlMode;
  modifyWalls: GraphControlMode;
  removeAllWalls: GraphControlMode;
}

export enum GraphControlMode {
  NONE,
  ENABLED,
  DISABLED,
}

const initialGraphControlSettings: GraphControlSettings = {
  setStart: GraphControlMode.NONE,
  setEnd: GraphControlMode.NONE,
  modifyWalls: GraphControlMode.NONE,
  removeAllWalls: GraphControlMode.NONE,
};
