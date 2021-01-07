import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphInteractionService {
  private graphControlEvents = new Subject<GraphControlsEvent>();

  addNewGraphControlEvent(event: GraphControlsEvent): void {
    this.graphControlEvents.next(event);
  }

  getGraphControlEventsObservable(): Observable<GraphControlsEvent> {
    return this.graphControlEvents.asObservable();
  }
}

export enum GraphControlsEvent {
  SET_START,
  SET_END,
  SET_WALLS,
  REMOVE_ALL_WALLS,
}
