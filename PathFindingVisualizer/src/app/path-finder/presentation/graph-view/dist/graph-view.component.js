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
var VisualizedGraph_1 = require("../../model/VisualizedGraph");
var RowColumnPair_1 = require("../../model/RowColumnPair");
var GraphViewComponent = /** @class */ (function () {
    function GraphViewComponent(el, p5UtilService, graphUtilService, store, actions) {
        var _this = this;
        this.el = el;
        this.p5UtilService = p5UtilService;
        this.graphUtilService = graphUtilService;
        this.store = store;
        this.actions = actions;
        this.subscriptions = new rxjs_1.Subscription();
        this.setNextClickedHexagonToStart = false;
        this.setNextClickedHexagonToEnd = false;
        this.isModifyWallsEnabled = false;
        this.handleHexagonClickEvent = function (hexagonClicked) {
            if (_this.setNextClickedHexagonToStart) {
                _this.graphUtilService.setFieldOfHexagon(_this.hexGrid.graph, 'isStart', false);
                hexagonClicked.isStart = true;
                hexagonClicked.isEnd = false;
                hexagonClicked.isWall = false;
                _this.store.dispatch(graph_actions_1.setStart({ startPosition: new RowColumnPair_1.RowColumnPair(hexagonClicked.row, hexagonClicked.column) }));
            }
            else if (_this.setNextClickedHexagonToEnd) {
                _this.graphUtilService.setFieldOfHexagon(_this.hexGrid.graph, 'isEnd', false);
                hexagonClicked.isStart = false;
                hexagonClicked.isEnd = true;
                hexagonClicked.isWall = false;
                _this.store.dispatch(graph_actions_1.setEnd({ endPosition: new RowColumnPair_1.RowColumnPair(hexagonClicked.row, hexagonClicked.column) }));
            }
            else if (_this.isModifyWallsEnabled) {
                hexagonClicked.isStart = false;
                hexagonClicked.isEnd = false;
                hexagonClicked.isWall = true;
                var allWalls = _this.graphUtilService.getAllWalls(_this.hexGrid.graph);
                _this.store.dispatch(graph_actions_1.modifyWalls({ walls: allWalls }));
            }
        };
        var hexagonSizePx = 15;
        var canvasSizePx = 450;
        this.p5Settings = {
            N: Math.floor(canvasSizePx / (hexagonSizePx * 1.8)),
            canvasSizePx: canvasSizePx,
            hexagonSizePx: hexagonSizePx,
            hexagonLinesBetweenSizePx: 3
        };
        this.hexGrid = new VisualizedGraph_1.VisualizedGraph();
        this.hexGrid.graph = this.graphUtilService.initGraph(this.p5Settings.N);
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_SET_START)).subscribe(function (a) { return (_this.setNextClickedHexagonToStart = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_START)).subscribe(function (a) { return (_this.setNextClickedHexagonToStart = false); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_SET_END)).subscribe(function (a) { return (_this.setNextClickedHexagonToEnd = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_END)).subscribe(function (a) { return (_this.setNextClickedHexagonToEnd = false); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.INIT_MODIFY_WALLS)).subscribe(function (a) { return (_this.isModifyWallsEnabled = true); }));
        this.subscriptions.add(actions.pipe(effects_1.ofType(graph_actions_1.FINALIZE_SET_WALLS)).subscribe(function (a) { return (_this.isModifyWallsEnabled = false); }));
    }
    GraphViewComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    GraphViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        var graphDefinition = function (picture) {
            return _this.p5UtilService.graphDefinition(picture, _this.hexGrid.graph, _this.p5Settings, _this.handleHexagonClickEvent);
        };
        var graph = new p5(graphDefinition, this.el.nativeElement);
    };
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
