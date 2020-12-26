"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphEffects = void 0;
var core_1 = require("@angular/core");
var effects_1 = require("@ngrx/effects");
var operators_1 = require("rxjs/operators");
var Graph_1 = require("../model/Graph");
var graph_actions_1 = require("./graph.actions");
var GraphEffects = /** @class */ (function () {
    function GraphEffects(actions$, graphUtils) {
        var _this = this;
        this.actions$ = actions$;
        this.graphUtils = graphUtils;
        this.onlyOneControlEnabled$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.INIT_SET_START, graph_actions_1.INIT_SET_END, graph_actions_1.INIT_MODIFY_WALLS), operators_1.switchMap(function (currentInit) { return _this.getAllActionsBut(currentInit.type); }));
        });
        this.setStart$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.SET_START), operators_1.map(function () { return graph_actions_1.finalizeSetStart(); }));
        });
        this.setEnd$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.SET_END), operators_1.map(function () { return graph_actions_1.finalizeSetEnd(); }));
        });
        this.setGraphSize$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.MODIFY_GRID_SIZE), operators_1.map(function (action) { return graph_actions_1.setNewGraph({ graph: new Graph_1.Graph(_this.graphUtils.initGraph(action.newGridSize)) }); }));
        });
        this.getAllActionsBut = function (typeToExclude) {
            var result = [graph_actions_1.finalizeSetStart(), graph_actions_1.finalizeSetEnd(), graph_actions_1.finalizeModifyWalls()];
            for (var i = 0; i < result.length; i++) {
                if (result[i].type === typeToExclude) {
                    result.splice(i, 1);
                }
            }
            return result;
        };
    }
    GraphEffects = __decorate([
        core_1.Injectable()
    ], GraphEffects);
    return GraphEffects;
}());
exports.GraphEffects = GraphEffects;
