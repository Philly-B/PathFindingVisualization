"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphUtilService = void 0;
var core_1 = require("@angular/core");
var AlgorithmConstants_1 = require("../constants/AlgorithmConstants");
var GraphCell_1 = require("../model/GraphCell");
var RowColumnPair_1 = require("../model/RowColumnPair");
var GraphUtilService = /** @class */ (function () {
    function GraphUtilService() {
        var _this = this;
        this.initGraph = function (N) {
            var graph = [];
            for (var row = 0; row < N; row++) {
                var currRow = [];
                var sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
                for (var col = 0; col < sizeOfNForRow; col++) {
                    currRow.push(new GraphCell_1.GraphCell(row, col));
                }
                graph.push(currRow);
            }
            return graph;
        };
        this.initGraphForAlgorithm = function (N) {
            var graph = [];
            for (var row = 0; row < N; row++) {
                var currRow = [];
                var sizeOfNForRow = row % 2 === 1 ? N - 1 : N;
                for (var col = 0; col < sizeOfNForRow; col++) {
                    currRow.push(AlgorithmConstants_1.PASSABLE_FIELD_ID);
                }
                graph.push(currRow);
            }
            return graph;
        };
        this.getAllWalls = function (graph) {
            var walls = [];
            _this.doSomethingForEveryHex(graph, function (hexagon) { return walls.push(new RowColumnPair_1.RowColumnPair(hexagon.row, hexagon.column)); }, function (hexagon) { return hexagon.graphCellConstraint === GraphCell_1.GraphCellConstraint.WALL; });
            return walls;
        };
        this.setGraphConstraintOfGraphCell = function (graph, oldValue, newValue) {
            _this.doSomethingForEveryHex(graph, function (hexagon) { return (hexagon.graphCellConstraint = newValue); }, function (hexagon) { return hexagon.graphCellConstraint === oldValue; });
        };
        this.doSomethingForEveryHex = function (graph, hexagonConsumer, hexagonFilter) {
            for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
                var hexRow = graph_1[_i];
                for (var _a = 0, hexRow_1 = hexRow; _a < hexRow_1.length; _a++) {
                    var hexagon = hexRow_1[_a];
                    if (hexagonFilter === undefined || hexagonFilter(hexagon)) {
                        hexagonConsumer(hexagon);
                    }
                }
            }
        };
    }
    GraphUtilService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], GraphUtilService);
    return GraphUtilService;
}());
exports.GraphUtilService = GraphUtilService;
