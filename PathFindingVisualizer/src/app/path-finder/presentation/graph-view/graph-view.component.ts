import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as p5 from 'p5';
import { Subscription } from 'rxjs';
import { P5Settings } from 'src/app/p5Additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5Additionals/utils/p5-util.service';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import {
  FINALIZE_SET_END,
  FINALIZE_SET_START,
  FINALIZE_SET_WALLS,
  GraphActionsTypes,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  removeWall,
  setEnd,
  setStart,
  setWall,
} from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';
import { RowColumnPair } from '../../../model/RowColumnPair';
import { MOUSE_DRAG_WALL_TIMEOUT_MS } from 'src/app/constants/GeneralConstants';
import { Graph } from 'src/app/model/Graph';
import { GraphCell, GraphCellConstraint } from 'src/app/model/GraphCell';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  private hexagonSizePx = 15;
  private canvasSizePx = 450;

  private p5Settings: P5Settings;
  private graph: Graph;

  private subscriptions = new Subscription();

  private setNextClickedHexagonToStart = false;
  private setNextClickedHexagonToEnd = false;
  private isModifyWallsEnabled = false;

  constructor(
    private el: ElementRef,
    private p5UtilService: P5UtilService,
    private graphUtilService: GraphUtilService,
    private store: Store<{ graph: GraphState }>,
    private actions: Actions<GraphActionsTypes>
  ) {
    this.p5Settings = {
      N: 15,
      canvasSizePx: this.canvasSizePx,
      hexagonSizePx: this.hexagonSizePx,
      hexagonLinesBetweenSizePx: 3,
    };
    this.graph = new Graph(graphUtilService.initGraph(this.p5Settings.N));
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(picture, this.graph, this.p5Settings, this.handleHexagonClickEvent);
    const p5Graph = new p5(graphDefinition, this.el.nativeElement);

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

  ngOnInit(): void {}

  private handleHexagonClickEvent = (hexagonClicked: GraphCell): void => {
    const referenceToGraphCell = new RowColumnPair(hexagonClicked.row, hexagonClicked.column);
    if (this.setNextClickedHexagonToStart) {
      this.graphUtilService.setGraphConstraintOfGraphCell(
        this.graph.grid,
        GraphCellConstraint.START,
        GraphCellConstraint.PASSABLE
      );
      hexagonClicked.graphCellConstraint = GraphCellConstraint.START;
      this.store.dispatch(setStart({ startPosition: referenceToGraphCell }));
    } else if (this.setNextClickedHexagonToEnd) {
      this.graphUtilService.setGraphConstraintOfGraphCell(
        this.graph.grid,
        GraphCellConstraint.END,
        GraphCellConstraint.PASSABLE
      );
      hexagonClicked.graphCellConstraint = GraphCellConstraint.END;
      this.store.dispatch(setEnd({ endPosition: referenceToGraphCell }));
    } else if (this.isModifyWallsEnabled) {
      if (Date.now() - hexagonClicked.lastChange < MOUSE_DRAG_WALL_TIMEOUT_MS) {
        return;
      }
      hexagonClicked.lastChange = Date.now();
      if (hexagonClicked.graphCellConstraint === GraphCellConstraint.WALL) {
        hexagonClicked.graphCellConstraint = GraphCellConstraint.PASSABLE;
        this.store.dispatch(removeWall({ exWall: referenceToGraphCell }));
      } else {
        hexagonClicked.graphCellConstraint = GraphCellConstraint.WALL;
        this.store.dispatch(setWall({ wall: referenceToGraphCell }));
      }
    }
  };
}
