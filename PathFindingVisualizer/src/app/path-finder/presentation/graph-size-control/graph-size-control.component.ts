import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { modifyGridSize } from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';

@Component({
  selector: 'app-graph-size-control',
  templateUrl: './graph-size-control.component.html',
  styleUrls: ['./graph-size-control.component.scss'],
})
export class GraphSizeControlComponent implements OnInit {
  defaultValue = 25;
  value;

  constructor(private store: Store<{ graph: GraphState }>) {
    this.value = this.defaultValue;
  }

  ngOnInit(): void {}

  graphSizeChanged = ($event) => {
    this.value = $event.target.value;
    this.store.dispatch(modifyGridSize({ newGridSize: this.value }));
  };
}
