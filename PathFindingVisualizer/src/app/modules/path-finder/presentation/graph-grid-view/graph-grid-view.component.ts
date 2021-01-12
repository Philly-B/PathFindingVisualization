import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as p5 from 'p5';
import { map } from 'rxjs/operators';
import { Graph } from 'src/app/model/Graph';
import { GraphCell } from 'src/app/model/GraphCell';
import { P5Settings } from 'src/app/p5-additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5-additionals/utils/p5-util.service';
import { AppState } from 'src/app/store/app.reducer';
import { selectGraphState } from 'src/app/store/graph-store/graph.selectors';

@Component({
  selector: 'app-graph-grid-view',
  templateUrl: './graph-grid-view.component.html',
})
export class GraphGridViewComponent implements OnInit {
  @Input() graph: Graph;
  @Input() p5Settings: P5Settings;

  @Output() hexagonClicked = new EventEmitter<GraphCell>();

  private p5Graph: p5;

  constructor(private el: ElementRef, private p5UtilService: P5UtilService, private store: Store<AppState>) { }

  ngOnInit(): void {
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(
        picture,
        this.graph,
        this.p5Settings,
        this.handleHexagonClickEvent,
        this.store.select(selectGraphState).pipe(map(graphState => graphState.graphDrawingMode))
      );
    this.p5Graph = new p5(graphDefinition, this.el.nativeElement);
  }

  private handleHexagonClickEvent = (graphCell: GraphCell): void => {
    this.hexagonClicked.emit(graphCell);
  };
}
