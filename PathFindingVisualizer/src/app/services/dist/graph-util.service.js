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
var Hexagon_1 = require("../path-finder/model/Hexagon");
var GraphUtilService = /** @class */ (function () {
    function GraphUtilService() {
        this.initGraph = function (N) {
            var graph = [];
            for (var row = 0; row < N; row++) {
                var currRow = [];
                for (var col = 0; col < N; col++) {
                    currRow.push(new Hexagon_1.Hexagon(undefined, row, col));
                }
                graph.push(currRow);
            }
            return graph;
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
