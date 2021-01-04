import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as p5 from 'p5';
import { Subject } from 'rxjs';
import { Graph } from 'src/app/model/Graph';
import { GraphCell } from 'src/app/model/GraphCell';
import { P5Settings } from 'src/app/p5-additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5-additionals/utils/p5-util.service';

@Component({
  selector: 'app-graph-grid-view',
  templateUrl: './graph-grid-view.component.html',
})
export class GraphGridViewComponent implements OnInit {
  @Input() graph: Graph;
  @Input() p5Settings: P5Settings;

  @Output() hexagonClicked = new EventEmitter<GraphCell>();

  private p5Graph: p5;
  private triggerRedraw = new Subject<void>();
  private enableRedraw = new Subject<void>();
  private disableRedraw = new Subject<void>();

  constructor(private el: ElementRef, private p5UtilService: P5UtilService) { }

  ngOnInit(): void {
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(picture,
        this.graph,
        this.p5Settings,
        this.handleHexagonClickEvent,
        this.triggerRedraw,
        this.enableRedraw,
        this.disableRedraw);
    this.p5Graph = new p5(graphDefinition, this.el.nativeElement);
  }

  redrawOfGrid = (): void => {

    this.triggerRedraw.next();
  }

  enableAutoRedraw = (): void => {
    this.enableRedraw.next();
  }

  stopAutoRedraw = (): void => {
    this.enableRedraw.next();
  }

  private handleHexagonClickEvent = (graphCell: GraphCell): void => {
    this.hexagonClicked.emit(graphCell);
  };
}
