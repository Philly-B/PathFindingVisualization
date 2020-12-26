import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
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
  GraphActionsTypes,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  modifyWalls,
  setEnd,
  setNewGraph,
  setStart,
  SET_NEW_GRAPH,
} from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';
import { selectGraphSize } from 'src/app/store/graph.selectors';
import { VisualizedGraph } from '../../visualisation-model/VisualizedGraph';
import { Hexagon } from '../../visualisation-model/Hexagon';
import { RowColumnPair } from '../../visualisation-model/RowColumnPair';
import { MOUSE_DRAG_WALL_TIMEOUT_MS } from 'src/app/constants/GeneralConstants';
import { Graph } from 'src/app/model/Graph';
import { GraphCellConstraint } from 'src/app/model/GraphCell';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  private hexagonSizePx = 15;
  private canvasSizePx = 450;

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
    private actions: Actions<GraphActionsTypes>
  ) {
    this.hexGrid = new VisualizedGraph();
    this.p5Settings = {
      N: 10,
      canvasSizePx: this.canvasSizePx,
      hexagonSizePx: this.hexagonSizePx,
      hexagonLinesBetweenSizePx: 3,
    };
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(picture, this.hexGrid, this.p5Settings, this.handleHexagonClickEvent);
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

    this.subscriptions.add(actions.pipe(ofType(SET_NEW_GRAPH)).subscribe((a) => this.initVisualisationGraph(a.graph)));
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectGraphSize).subscribe((graphSize) => this.initVisualisationGraphWithNewSize(graphSize))
    );
  }

  private initVisualisationGraphWithNewSize = (graphSize: number): void => {
    this.p5Settings.N = graphSize;

    this.initVisualisationGraph();
  };

  private initVisualisationGraph = (graph?: Graph): void => {
    this.hexGrid.graph = this.graphUtilService.initVisualisationGraph(this.p5Settings.N);

    if (graph) {
      for (let row = 0; row < graph.grid.length; row++) {
        for (let col = 0; col < graph.grid[row].length; col++) {
          const currentCell = graph.grid[row][col];
          this.hexGrid.graph[row][col].isStart = currentCell.graphCellConstraint === GraphCellConstraint.START;
          this.hexGrid.graph[row][col].isEnd = currentCell.graphCellConstraint === GraphCellConstraint.END;
          this.hexGrid.graph[row][col].isWall = currentCell.graphCellConstraint === GraphCellConstraint.WALL;
        }
      }
    }
  };

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
      if (Date.now() - hexagonClicked.lastChange < MOUSE_DRAG_WALL_TIMEOUT_MS) {
        return;
      }
      hexagonClicked.lastChange = Date.now();
      hexagonClicked.isWall = !hexagonClicked.isWall;
      hexagonClicked.isStart = false;
      hexagonClicked.isEnd = false;
      const allWalls = this.graphUtilService.getAllWalls(this.hexGrid.graph);
      this.store.dispatch(modifyWalls({ walls: allWalls }));
    }
  };
}
