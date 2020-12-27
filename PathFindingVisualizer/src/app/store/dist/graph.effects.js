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
var graph_actions_1 = require("./graph.actions");
var graph_selectors_1 = require("./graph.selectors");
var GraphEffects = /** @class */ (function () {
    function GraphEffects(actions$, store$, graphUtils) {
        var _this = this;
        this.actions$ = actions$;
        this.store$ = store$;
        this.graphUtils = graphUtils;
        this.onlyOneControlEnabled$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.INIT_SET_START, graph_actions_1.INIT_SET_END, graph_actions_1.INIT_MODIFY_WALLS), operators_1.switchMap(function (currentInit) { return _this.finalizeOthers(currentInit.type); }));
        });
        this.setStart$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.SET_START), operators_1.map(function () { return graph_actions_1.finalizeSetStart(); }));
        });
        this.setEnd$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.SET_END), operators_1.map(function () { return graph_actions_1.finalizeSetEnd(); }));
        });
        this.removeAllWalls$ = effects_1.createEffect(function () {
            return _this.actions$.pipe(effects_1.ofType(graph_actions_1.REMOVE_ALL_WALLS), operators_1.withLatestFrom(_this.store$.select(graph_selectors_1.selectGraphFeature)), operators_1.map(function (_a) {
                var a = _a[0], store = _a[1];
                return store.walls;
            }), operators_1.concatAll(), operators_1.map(function (exWall) { return graph_actions_1.removeWall({ exWall: exWall }); }));
        });
        this.finalizeOthers = function (typeToRun) {
            if (typeToRun === graph_actions_1.initiateSetStart.type) {
                return [graph_actions_1.finalizeSetEnd(), graph_actions_1.finalizeModifyWalls()];
            }
            else if (typeToRun === graph_actions_1.initiateSetEnd.type) {
                return [graph_actions_1.finalizeSetStart(), graph_actions_1.finalizeModifyWalls()];
            }
            else if (typeToRun === graph_actions_1.initiateModifyWalls.type) {
                return [graph_actions_1.finalizeSetStart(), graph_actions_1.finalizeSetEnd()];
            }
            throw new Error('Unknown type to handle ' + typeToRun);
        };
    }
    GraphEffects = __decorate([
        core_1.Injectable()
    ], GraphEffects);
    return GraphEffects;
}());
exports.GraphEffects = GraphEffects;
