import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { act, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as p5 from 'p5';
import { Subscription } from 'rxjs';
import { P5Settings } from 'src/app/p5-additionals/models/P5Settings';
import { P5UtilService } from 'src/app/p5-additionals/utils/p5-util.service';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import {
  FINALIZE_SET_END,
  FINALIZE_SET_START,
  FINALIZE_SET_WALLS,
  GraphActionsTypes,
  INIT_MODIFY_WALLS,
  INIT_SET_END,
  INIT_SET_START,
  RELOAD_GRAPH_STATE,
  removeWall,
  REMOVE_WALL,
  RESET_ALGORITHM_DATA,
  setEnd,
  setStart,
  setWall,
  UPDATE_GRAPH_CELL,
} from 'src/app/store/graph-store/graph.actions';
import { GraphState } from 'src/app/store/graph-store/graph.reducer';
import {
  CANVAS_SIZE_PX,
  HEXAGON_SIZE_PX,
  INITIAL_NUMBER_OF_HEX_PER_ROW,
  MOUSE_DRAG_WALL_TIMEOUT_MS,
} from 'src/app/constants/GeneralConstants';
import { Graph } from 'src/app/model/Graph';
import { GraphCell, GraphCellConstraint } from 'src/app/model/GraphCell';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { AppState } from 'src/app/store/app.reducer';
import { switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { selectGraphFeature } from 'src/app/store/graph-store/graph.selectors';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  private p5Settings: P5Settings;
  private graph: Graph;
  private p5Graph: p5;

  private subscriptions = new Subscription();

  private setNextClickedHexagonToStart = false;
  private setNextClickedHexagonToEnd = false;
  private isModifyWallsEnabled = false;

  constructor(
    private el: ElementRef,
    private p5UtilService: P5UtilService,
    private graphUtilService: GraphUtilService,
    private store: Store<AppState>,
    private actions: Actions<GraphActionsTypes>
  ) {
    this.p5Settings = {
      N: INITIAL_NUMBER_OF_HEX_PER_ROW,
      canvasSizePx: CANVAS_SIZE_PX,
      hexagonSizePx: HEXAGON_SIZE_PX,
      hexagonLinesBetweenSizePx: 3,
    };
    this.graph = new Graph(graphUtilService.initGraph(this.p5Settings.N));
    const graphDefinition = (picture) =>
      this.p5UtilService.graphDefinition(picture, this.graph, this.p5Settings, this.handleHexagonClickEvent);
    this.p5Graph = new p5(graphDefinition, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    // TODO Do this in a useful way
    this.subscriptions.add(
      this.actions.pipe(ofType(INIT_SET_START)).subscribe((a) => (this.setNextClickedHexagonToStart = true))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(FINALIZE_SET_START)).subscribe((a) => (this.setNextClickedHexagonToStart = false))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(INIT_SET_END)).subscribe((a) => (this.setNextClickedHexagonToEnd = true))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(FINALIZE_SET_END)).subscribe((a) => (this.setNextClickedHexagonToEnd = false))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(INIT_MODIFY_WALLS)).subscribe((a) => (this.isModifyWallsEnabled = true))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(FINALIZE_SET_WALLS)).subscribe((a) => (this.isModifyWallsEnabled = false))
    );

    this.subscriptions.add(
      this.actions.pipe(ofType(UPDATE_GRAPH_CELL)).subscribe((a) => this.updateGraphCell(a.cell, a.newConstraint))
    );

    this.subscriptions.add(
      this.actions.pipe(ofType(RESET_ALGORITHM_DATA)).subscribe((a) => this.resetAlgorithmDataInGraph())
    );

    this.subscriptions.add(this.actions.pipe(ofType(REMOVE_WALL)).subscribe((a) => this.removeWall(a.exWall)));

    this.subscriptions.add(
      this.actions
        .pipe(ofType(RELOAD_GRAPH_STATE), switchMapTo(this.store.select(selectGraphFeature)))
        .subscribe((newGraphState) => this.reinitAll(newGraphState))
    );

    this.subscriptions.add(
      this.store
        .select(selectGraphFeature)
        .pipe(take(1))
        .subscribe((initialState) => this.reinitAll(initialState))
    );
  }

  private reinitAll = (newGraphState: GraphState): void => {
    this.resetAlgorithmDataInGraph();

    this.setExclusiveConstraint(newGraphState.startPosition, GraphCellConstraint.START);
    this.setExclusiveConstraint(newGraphState.endPosition, GraphCellConstraint.END);
    newGraphState.walls.forEach((wall) => this.updateGraphCell(wall, GraphCellConstraint.WALL));
    newGraphState.visited.forEach((wall) => this.updateGraphCell(wall, GraphCellConstraint.VISITED));
    newGraphState.inConsideration.forEach((wall) => this.updateGraphCell(wall, GraphCellConstraint.IN_CONSIDERATION));
    newGraphState.finalPath.forEach((wall) => this.updateGraphCell(wall, GraphCellConstraint.FINAL_PATH));
  };

  private resetAlgorithmDataInGraph = (): void => {
    for (const graphRow of this.graph.grid) {
      for (const graphCell of graphRow) {
        if (
          graphCell.graphCellConstraint === GraphCellConstraint.IN_CONSIDERATION ||
          graphCell.graphCellConstraint === GraphCellConstraint.VISITED ||
          graphCell.graphCellConstraint === GraphCellConstraint.FINAL_PATH
        ) {
          graphCell.graphCellConstraint = GraphCellConstraint.PASSABLE;
        }
      }
    }
  };

  private updateGraphCell = (rowCol: RowColumnPair, newConstraint: GraphCellConstraint): void => {
    const cell = this.graph.grid[rowCol.row][rowCol.column];
    if (
      cell.graphCellConstraint !== GraphCellConstraint.START &&
      cell.graphCellConstraint !== GraphCellConstraint.END
    ) {
      cell.graphCellConstraint = newConstraint;
    }
  };

  private handleHexagonClickEvent = (hexagonClicked: GraphCell): void => {
    const referenceToGraphCell = new RowColumnPair(hexagonClicked.row, hexagonClicked.column);
    if (this.setNextClickedHexagonToStart) {
      this.setExclusiveConstraint(referenceToGraphCell, GraphCellConstraint.START);
      this.store.dispatch(setStart({ startPosition: referenceToGraphCell }));
    } else if (this.setNextClickedHexagonToEnd) {
      this.setExclusiveConstraint(referenceToGraphCell, GraphCellConstraint.END);
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

  private setExclusiveConstraint(cell: RowColumnPair, constraint: GraphCellConstraint): void {
    if (cell === undefined) {
      return;
    }

    this.graphUtilService.setGraphConstraintOfGraphCell(this.graph.grid, constraint, GraphCellConstraint.PASSABLE);
    this.graph.grid[cell.row][cell.column].graphCellConstraint = constraint;
  }

  private removeWall = (wallToRemove: RowColumnPair): void => {
    this.graph.grid[wallToRemove.row][wallToRemove.column].graphCellConstraint = GraphCellConstraint.PASSABLE;
  };
}
