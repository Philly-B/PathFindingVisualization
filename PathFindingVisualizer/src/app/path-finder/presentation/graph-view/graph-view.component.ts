import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import * as p5 from 'p5';
import { Subscription } from 'rxjs';
import { P5MouseClickEvent } from 'src/app/p5Additionals/models/P5MouseClickEvent';
import { P5Settings } from 'src/app/p5Additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5Additionals/utils/p5-util.service';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import { GraphState } from 'src/app/store/graph.reducer';
import { Graph } from '../../model/Graph';
import { Hexagon } from '../../model/Hexagon';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  private p5Settings: P5Settings;
  private hexGrid: Graph;

  private subscriptions = new Subscription();

  constructor(
    private el: ElementRef,
    private p5UtilService: P5UtilService,
    private graphUtilService: GraphUtilService,
    private store: Store<{ graph: GraphState }>,
    private actions: ActionsSubject
  ) {
    const hexagonSizePx = 15;
    const canvasSizePx = 450;
    this.p5Settings = {
      N: Math.floor(canvasSizePx / (hexagonSizePx * 1.8)),
      canvasSizePx,
      hexagonSizePx,
      hexagonLinesBetweenSizePx: 3,
    };

    this.hexGrid = new Graph();
    this.hexGrid.graph = this.graphUtilService.initGraph(this.p5Settings.N);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(picture, this.hexGrid.graph, this.p5Settings, this.handleHexagonClickEvent);
    const graph = new p5(graphDefinition, this.el.nativeElement);
  }

  private handleHexagonClickEvent = (hexagonClicked: Hexagon): void => {
    console.log(hexagonClicked);
  };
}
