"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphViewComponent = void 0;
var core_1 = require("@angular/core");
var effects_1 = require("@ngrx/effects");
var p5 = require("p5");
var rxjs_1 = require("rxjs");
var graph_actions_1 = require("src/app/store/graph.actions");
var RowColumnPair_1 = require("../../../model/RowColumnPair");
var GeneralConstants_1 = require("src/app/constants/GeneralConstants");
var Graph_1 = require("src/app/model/Graph");
var GraphCell_1 = require("src/app/model/GraphCell");
var GraphViewComponent = /** @class */ (function () {
    function GraphViewComponent(el, p5UtilService, graphUtilService, store, actions) {
        var _this = this;
        this.el = el;
        this.p5UtilService = p5UtilService;
        this.graphUtilService = graphUtilService;
        this.store = store;
        this.actions = actions;
        this.hexagonSizePx = 15;
        this.canvasSizePx = 450;
        this.subscriptions = new rxjs_1.Subscription();
        this.setNextClickedHexagonToStart = false;
        this.setNextClickedHexagonToEnd = false;
        this.isModifyWallsEnabled = false;
        this.updateGraphCell = function (rowCol, newConstraint) {
            var cell = _this.graph.grid[rowCol.row][rowCol.column];
            if (cell.graphCellConstraint !== GraphCell_1.GraphCellConstraint.START &&
                cell.graphCellConstraint !== GraphCell_1.GraphCellConstraint.END) {
                cell.graphCellConstraint = newConstraint;
            }
        };
        this.handleHexagonClickEvent = function (hexagonClicked) {
            var referenceToGraphCell = new RowColumnPair_1.RowColumnPair(hexagonClicked.row, hexagonClicked.column);
            console.log(hexagonClicked);
            if (_this.setNextClickedHexagonToStart) {
                _this.graphUtilService.setGraphConstraintOfGraphCell(_this.graph.grid, GraphCell_1.GraphCellConstraint.START, GraphCell_1.GraphCellConstraint.PASSABLE);
                hexagonClicked.graphCellConstraint = GraphCell_1.GraphCellConstraint.START;
                _this.store.dispatch(graph_actions_1.setStart({ startPosition: referenceToGraphCell }));
            }
            else if (_this.setNextClickedHexagonToEnd) {
                _this.graphUtilService.setGraphConstraintOfGraphCell(_this.graph.grid, GraphCell_1.GraphCellConstraint.END, GraphCell_1.GraphCellConstraint.PASSABLE);
                hexagonClicked.graphCellConstraint = GraphCell_1.GraphCellConstraint.END;
                _this.store.dispatch(graph_actions_1.setEnd({ endPosition: referenceToGraphCell }));
            }
            else if (_this.isModifyWallsEnabled) {
                if (Date.now() - hexagonClicked.lastChange < GeneralConstants_1.MOUSE_DRAG_WALL_TIMEOUT_MS) {
                    return;
                }
                hexagonClicked.lastChange = Date.now();
                if (hexagonClicked.graphCellConstraint === GraphCell_1.GraphCellConstraint.WALL) {
                    hexagonClicked.graphCellConstraint = GraphCell_1.GraphCellConstraint.PASSABLE;
                    _this.store.dispatch(graph_actions_1.removeWall({ exWall: referenceToGraphCell }));
                }
                else {
                    hexagonClicked.graphCellConstraint = GraphCell_1.GraphCellConstraint.WALL;
                    _this.store.dispatch(graph_actions_1.setWall({ wall: referenceToGraphCell }));
                }
            }
        };
        this.p5Settings = {
            N: 15,
            canvasSizePx: this.canvasSizePx,
            hexagonSizePx: this.hexagonSizePx,
            hexagonLinesBetweenSizePx: 3
        };
        this.graph = new Graph_1.Graph(graphUtilService.initGraph(this.p5Settings.N));
        var graphDefinition = function (picture) {
            return _this.p5UtilService.graphDefinition(picture, _this.graph, _this.p5Settings, _this.handleHexagonClickEvent);
        };
        var p5Graph = new p5(graphDefinition, this.el.nativeElement);
        // TODO Do this in a useful way
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_SET_START)).subscribe(function (a) { return (_this.setNextClickedHexagonToStart = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_START)).subscribe(function (a) { return (_this.setNextClickedHexagonToStart = false); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_SET_END)).subscribe(function (a) { return (_this.setNextClickedHexagonToEnd = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_END)).subscribe(function (a) { return (_this.setNextClickedHexagonToEnd = false); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_MODIFY_WALLS)).subscribe(function (a) { return (_this.isModifyWallsEnabled = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_WALLS)).subscribe(function (a) { return (_this.isModifyWallsEnabled = false); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.UPDATE_GRAPH_CELL)).subscribe(function (a) { return _this.updateGraphCell(a.cell, a.newConstraint); }));
    }
    GraphViewComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    GraphViewComponent.prototype.ngOnInit = function () { };
    GraphViewComponent = __decorate([
        core_1.Component({
            selector: 'app-graph-view',
            templateUrl: './graph-view.component.html',
            styleUrls: ['./graph-view.component.scss']
        })
    ], GraphViewComponent);
    return GraphViewComponent;
}());
exports.GraphViewComponent = GraphViewComponent;
