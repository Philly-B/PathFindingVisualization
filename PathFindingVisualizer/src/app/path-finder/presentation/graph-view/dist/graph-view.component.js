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
var p5 = require("p5");
var rxjs_1 = require("rxjs");
var Graph_1 = require("../../model/Graph");
var GraphViewComponent = /** @class */ (function () {
    function GraphViewComponent(el, p5UtilService, graphUtilService, store, actions) {
        this.el = el;
        this.p5UtilService = p5UtilService;
        this.graphUtilService = graphUtilService;
        this.store = store;
        this.actions = actions;
        this.subscriptions = new rxjs_1.Subscription();
        this.handleHexagonClickEvent = function (hexagonClicked) {
            console.log(hexagonClicked);
        };
        var hexagonSizePx = 15;
        var canvasSizePx = 450;
        this.p5Settings = {
            N: Math.floor(canvasSizePx / (hexagonSizePx * 1.8)),
            canvasSizePx: canvasSizePx,
            hexagonSizePx: hexagonSizePx,
            hexagonLinesBetweenSizePx: 3
        };
        this.hexGrid = new Graph_1.Graph();
        this.hexGrid.graph = this.graphUtilService.initGraph(this.p5Settings.N);
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
