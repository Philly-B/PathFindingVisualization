import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { P5Settings } from 'src/app/p5-additionals/models/P5Settings';
import { GraphUtilService } from 'src/app/services/graph-util.service';
import {
  GraphActionsTypes,
  RELOAD_GRAPH_STATE,
  removeAllWalls,
  removeWall,
  RESET_ALGORITHM_DATA,
  setEnd,
  setStart,
  setWall,
  triggerRemoveAllWallsButton,
  UPDATE_GRAPH_CELL,
} from 'src/app/store/graph-store/graph.actions';
import { GraphState } from 'src/app/store/graph-store/graph.reducer';
import {
  CANVAS_SIZE_PX,
  mapGridSizeToHexagonSize,
  MOUSE_DRAG_WALL_TIMEOUT_MS,
} from 'src/app/constants/GeneralConstants';
import { Graph } from 'src/app/model/Graph';
import { GraphCell, GraphCellConstraint } from 'src/app/model/GraphCell';
import { RowColumnPair } from 'src/app/model/RowColumnPair';
import { AppState } from 'src/app/store/app.reducer';
import { distinct, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { SettingsState } from 'src/app/store/settings-store/settings.reducer';
import { selectSettingsState } from 'src/app/store/settings-store/settings.selectors';
import {
  selectGraphState,
  selectGridSize,
  selectGraphControlSettings,
} from 'src/app/store/graph-store/graph.selectors';
import { GraphControlMode, GraphControlSettings } from 'src/app/model/GraphControlSettings';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styles: [''],
})
export class GraphViewComponent implements OnInit, OnDestroy {
  p5Settings: P5Settings;
  graph: Graph;

  private subscriptions = new Subscription();
  private gridSize: number;

  private setNextClickedHexagonToStart = false;
  private setNextClickedHexagonToEnd = false;
  private isModifyWallsEnabled = false;

  constructor(
    private graphUtilService: GraphUtilService,
    private store: Store<AppState>,
    private actions: Actions<GraphActionsTypes>
  ) {
    this.graph = new Graph([]);
    this.p5Settings = new P5Settings();
    this.p5Settings.canvasSizePx = CANVAS_SIZE_PX;
    this.p5Settings.hexagonLinesBetweenSizePx = 3;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectGraphControlSettings).pipe(distinct()).subscribe(this.handleGraphControlsEvent)
    );

    // algorithm related events
    this.subscriptions.add(
      this.actions.pipe(ofType(UPDATE_GRAPH_CELL)).subscribe((a) => this.updateGraphCell(a.cell, a.newConstraint))
    );
    this.subscriptions.add(
      this.actions.pipe(ofType(RESET_ALGORITHM_DATA)).subscribe((a) => this.resetAlgorithmDataInGraph())
    );

    // initialize
    this.subscriptions.add(
      this.actions
        .pipe(ofType(RELOAD_GRAPH_STATE), switchMapTo(this.store.select(selectGraphState)), distinct())
        .subscribe((newGraphState) => this.reInitAll(newGraphState))
    );

    this.subscriptions.add(
      this.store
        .select(selectGridSize)
        .pipe(
          distinct(),
          tap((gridSize) => (this.gridSize = gridSize)),
          tap((gridSize) => (this.graph = undefined)),
          switchMap(() => this.store.select(selectGraphState).pipe(take(1)))
        )
        .subscribe((graphState) => {
          setTimeout(() => this.reInitAll(graphState));
        })
    );

    // settings
    this.subscriptions.add(
      this.store.select(selectSettingsState).subscribe((settings) => this.updateP5Settings(settings))
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

  private handleGraphControlsEvent = (graphControlSettings: GraphControlSettings): void => {
    this.setNextClickedHexagonToStart = graphControlSettings.setStart === GraphControlMode.ENABLED;
    this.setNextClickedHexagonToEnd = graphControlSettings.setEnd === GraphControlMode.ENABLED;
    this.isModifyWallsEnabled = graphControlSettings.modifyWalls === GraphControlMode.ENABLED;

    if (graphControlSettings.removeAllWalls === GraphControlMode.ENABLED) {
      this.graphUtilService.setGraphConstraintOfGraphCell(
        this.graph.grid,
        GraphCellConstraint.WALL,
        GraphCellConstraint.PASSABLE
      );
      this.store.dispatch(triggerRemoveAllWallsButton());
      this.store.dispatch(removeAllWalls());
    }
  };

  private updateP5Settings = (settings: SettingsState): void => {
    this.p5Settings.hexagonSizePx = mapGridSizeToHexagonSize(this.gridSize);
    this.p5Settings.colorSettings = settings.colorSettings;
  };

  private reInitAll = (newGraphState: GraphState): void => {
    if (this.graph === undefined) {
      this.p5Settings.hexagonSizePx = mapGridSizeToHexagonSize(this.gridSize);
      this.graph = new Graph(this.graphUtilService.initGraph(this.gridSize));
    }

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
      if (hexagonClicked.graphCellConstraint === GraphCellConstraint.START) {
        this.store.dispatch(setStart({ startPosition: undefined }));
      } else if (hexagonClicked.graphCellConstraint === GraphCellConstraint.END) {
        this.store.dispatch(setEnd({ endPosition: undefined }));
      }
      hexagonClicked.graphCellConstraint = GraphCellConstraint.WALL;
      this.store.dispatch(setWall({ wall: referenceToGraphCell }));
    }
  }

  private handleEnd(hexagonClicked: GraphCell, referenceToGraphCell: RowColumnPair) {
    if (hexagonClicked.graphCellConstraint === GraphCellConstraint.END) {
      this.graph.grid[hexagonClicked.row][hexagonClicked.column].graphCellConstraint = GraphCellConstraint.PASSABLE;
      this.store.dispatch(setEnd({ endPosition: undefined }));
    } else {
      if (hexagonClicked.graphCellConstraint === GraphCellConstraint.START) {
        this.store.dispatch(setStart({ startPosition: undefined }));
      } else if (hexagonClicked.graphCellConstraint === GraphCellConstraint.WALL) {
        this.store.dispatch(removeWall({ exWall: referenceToGraphCell }));
      }
      this.setExclusiveConstraint(referenceToGraphCell, GraphCellConstraint.END);
      this.store.dispatch(setEnd({ endPosition: referenceToGraphCell }));
    }
  }

  private handleStart(hexagonClicked: GraphCell, referenceToGraphCell: RowColumnPair) {
    if (hexagonClicked.graphCellConstraint === GraphCellConstraint.START) {
      this.graph.grid[hexagonClicked.row][hexagonClicked.column].graphCellConstraint = GraphCellConstraint.PASSABLE;
      this.store.dispatch(setStart({ startPosition: undefined }));
    } else {
      if (hexagonClicked.graphCellConstraint === GraphCellConstraint.END) {
        this.store.dispatch(setEnd({ endPosition: undefined }));
      } else if (hexagonClicked.graphCellConstraint === GraphCellConstraint.WALL) {
        this.store.dispatch(removeWall({ exWall: referenceToGraphCell }));
      }
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
}
