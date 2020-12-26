import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import * as p5 from 'p5';
import { Subscription } from 'rxjs';
import { P5Settings } from 'src/app/p5Additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5Additionals/utils/p5-util.service';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import {
  FINALIZE_SET_END,
  FINALIZE_SET_START,
  FINALIZE_SET_WALLS,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  modifyWalls,
  setEnd,
  setStart,
} from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';
import { VisualizedGraph } from '../../model/VisualizedGraph';
import { Hexagon } from '../../model/Hexagon';
import { RowColumnPair } from '../../model/RowColumnPair';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  private p5Settings: P5Settings;
  private hexGrid: VisualizedGraph;

  private subscriptions = new Subscription();

  private setNextClickedHexagonToStart = false;
  private setNextClickedHexagonToEnd = false;
  private isModifyWallsEnabled = false;

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

    this.hexGrid = new VisualizedGraph();
    this.hexGrid.graph = this.graphUtilService.initGraph(this.p5Settings.N);

    this.subscriptions.add(
      actions.pipe(ofType(INIT_SET_START)).subscribe((a) => (this.setNextClickedHexagonToStart = true))
    );
    this.subscriptions.add(
      actions.pipe(ofType(FINALIZE_SET_START)).subscribe((a) => (this.setNextClickedHexagonToStart = false))
    );
    this.subscriptions.add(
      actions.pipe(ofType(INIT_SET_END)).subscribe((a) => (this.setNextClickedHexagonToEnd = true))
    );
    this.subscriptions.add(
      actions.pipe(ofType(FINALIZE_SET_END)).subscribe((a) => (this.setNextClickedHexagonToEnd = false))
    );
    this.subscriptions.add(
      actions.pipe(ofType(INIT_MODIFY_WALLS)).subscribe((a) => (this.isModifyWallsEnabled = true))
    );
    this.subscriptions.add(
      actions.pipe(ofType(FINALIZE_SET_WALLS)).subscribe((a) => (this.isModifyWallsEnabled = false))
    );
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
    if (this.setNextClickedHexagonToStart) {
      this.graphUtilService.setFieldOfHexagon(this.hexGrid.graph, 'isStart', false);
      hexagonClicked.isStart = true;
      hexagonClicked.isEnd = false;
      hexagonClicked.isWall = false;
      this.store.dispatch(setStart({ startPosition: new RowColumnPair(hexagonClicked.row, hexagonClicked.column) }));
    } else if (this.setNextClickedHexagonToEnd) {
      this.graphUtilService.setFieldOfHexagon(this.hexGrid.graph, 'isEnd', false);
      hexagonClicked.isStart = false;
      hexagonClicked.isEnd = true;
      hexagonClicked.isWall = false;
      this.store.dispatch(setEnd({ endPosition: new RowColumnPair(hexagonClicked.row, hexagonClicked.column) }));
    } else if (this.isModifyWallsEnabled) {
      hexagonClicked.isStart = false;
      hexagonClicked.isEnd = false;
      hexagonClicked.isWall = true;
      const allWalls = this.graphUtilService.getAllWalls(this.hexGrid.graph);
      this.store.dispatch(modifyWalls({ walls: allWalls }));
    }
  };
}
