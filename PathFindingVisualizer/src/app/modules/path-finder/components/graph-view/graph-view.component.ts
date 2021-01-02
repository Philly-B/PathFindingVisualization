import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { P5Settings } from 'src/app/p5-additionals/models/P5Settings';
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
import { switchMap, switchMapTo, take } from 'rxjs/operators';
import { SettingsState } from 'src/app/store/settings-store/settings.reducer';
import { UPDATE_COLOR_SETTINGS } from 'src/app/store/settings-store/settings.actions';
import { selectSettingsState } from 'src/app/store/settings-store/settings.selectors';
import { selectGraphState } from 'src/app/store/graph-store/graph.selectors';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styles: [''],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  p5Settings: P5Settings;
  graph: Graph;

  private subscriptions = new Subscription();

  private setNextClickedHexagonToStart = false;
  private setNextClickedHexagonToEnd = false;
  private isModifyWallsEnabled = false;

  constructor(
    private graphUtilService: GraphUtilService,
    private store: Store<AppState>,
    private actions: Actions<GraphActionsTypes>
  ) {
    this.store
      .select(selectSettingsState)
      .pipe(take(1))
      .subscribe((settings) => this.initP5(settings));
  }

  private initP5 = (settings: SettingsState): void => {
    this.p5Settings = {
      N: INITIAL_NUMBER_OF_HEX_PER_ROW,
      canvasSizePx: CANVAS_SIZE_PX,
      hexagonSizePx: HEXAGON_SIZE_PX,
      hexagonLinesBetweenSizePx: 3,
      colorSettings: settings.colorSettings,
    };
    this.graph = new Graph(this.graphUtilService.initGraph(this.p5Settings.N));
    console.log('init done');
  };

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
        .pipe(ofType(RELOAD_GRAPH_STATE), switchMapTo(this.store.select(selectGraphState)))
        .subscribe((newGraphState) => this.reinitAll(newGraphState))
    );

    this.subscriptions.add(
      this.store
        .select(selectGraphState)
        .pipe(take(1))
        .subscribe((initialState) => this.reinitAll(initialState))
    );

    this.subscriptions.add(
      this.actions
        .pipe(
          ofType(UPDATE_COLOR_SETTINGS),
          switchMap(() => this.store.select(selectSettingsState))
        )
        .subscribe((settingsState) => {
          this.p5Settings.colorSettings = settingsState.colorSettings;
        })
    );
  }

  handleHexagonClickEvent = (hexagonClicked: GraphCell): void => {
    const referenceToGraphCell = new RowColumnPair(hexagonClicked.row, hexagonClicked.column);
    if (this.setNextClickedHexagonToStart) {
      this.handleStart(hexagonClicked, referenceToGraphCell);
    } else if (this.setNextClickedHexagonToEnd) {
      this.handleEnd(hexagonClicked, referenceToGraphCell);
    } else if (this.isModifyWallsEnabled) {
      if (Date.now() - hexagonClicked.lastChange < MOUSE_DRAG_WALL_TIMEOUT_MS) {
        return;
      }
      this.handleWall(hexagonClicked, referenceToGraphCell);
    }
  };

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

  private handleWall(hexagonClicked: GraphCell, referenceToGraphCell: RowColumnPair) {
    hexagonClicked.lastChange = Date.now();
    if (hexagonClicked.graphCellConstraint === GraphCellConstraint.WALL) {
      hexagonClicked.graphCellConstraint = GraphCellConstraint.PASSABLE;
      this.store.dispatch(removeWall({ exWall: referenceToGraphCell }));
    } else {
      hexagonClicked.graphCellConstraint = GraphCellConstraint.WALL;
      this.store.dispatch(setWall({ wall: referenceToGraphCell }));
    }
  }

  private handleEnd(hexagonClicked: GraphCell, referenceToGraphCell: RowColumnPair) {
    if (hexagonClicked.graphCellConstraint === GraphCellConstraint.END) {
      this.graph.grid[hexagonClicked.row][hexagonClicked.column].graphCellConstraint = GraphCellConstraint.PASSABLE;
      this.store.dispatch(setEnd({ endPosition: undefined }));
    } else {
      this.setExclusiveConstraint(referenceToGraphCell, GraphCellConstraint.END);
      this.store.dispatch(setEnd({ endPosition: referenceToGraphCell }));
    }
  }

  private handleStart(hexagonClicked: GraphCell, referenceToGraphCell: RowColumnPair) {
    if (hexagonClicked.graphCellConstraint === GraphCellConstraint.START) {
      this.graph.grid[hexagonClicked.row][hexagonClicked.column].graphCellConstraint = GraphCellConstraint.PASSABLE;
      this.store.dispatch(setStart({ startPosition: undefined }));
    } else {
      this.setExclusiveConstraint(referenceToGraphCell, GraphCellConstraint.START);
      this.store.dispatch(setStart({ startPosition: referenceToGraphCell }));
    }
  }

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