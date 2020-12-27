"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.graphReducer = exports.initialState = exports.GraphState = void 0;
var store_1 = require("@ngrx/store");
var RowColumnPair_1 = require("../model/RowColumnPair");
var graph_actions_1 = require("./graph.actions");
var GraphState = /** @class */ (function () {
    function GraphState() {
    }
    return GraphState;
}());
exports.GraphState = GraphState;
exports.initialState = {
    startPosition: undefined,
    endPosition: undefined,
    walls: []
};
var graphReducerInternal = store_1.createReducer(exports.initialState, store_1.on(graph_actions_1.initiateSetStart, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.setStart, function (state, _a) {
    var startPosition = _a.startPosition;
    return (__assign(__assign({}, state), { startPosition: startPosition }));
}), store_1.on(graph_actions_1.finalizeSetStart, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.initiateModifyWalls, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.setWall, function (state, _a) {
    var wall = _a.wall;
    return (__assign(__assign({}, state), { walls: duplicateAndAddWall(state.walls, wall) }));
}), store_1.on(graph_actions_1.removeWall, function (state, _a) {
    var exWall = _a.exWall;
    return (__assign(__assign({}, state), { walls: duplicateAndRemoveWall(state.walls, exWall) }));
}), store_1.on(graph_actions_1.finalizeModifyWalls, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.initiateSetEnd, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.setEnd, function (state, _a) {
    var endPosition = _a.endPosition;
    return (__assign(__assign({}, state), { endPosition: endPosition }));
}), store_1.on(graph_actions_1.finalizeSetEnd, function (state) { return (__assign({}, state)); }));
function graphReducer(state, action) {
    return graphReducerInternal(state, action);
}
exports.graphReducer = graphReducer;
var duplicateAndRemoveWall = function (walls, exWall) {
    var nextWalls = duplicateWalls(walls);
    for (var i = 0; i < nextWalls.length; i++) {
        if (RowColumnPair_1.RowColumnPair.equals(nextWalls[i], exWall)) {
            nextWalls.splice(i, 1);
            break;
        }
    }
    return nextWalls;
};
var duplicateAndAddWall = function (walls, newWall) {
    var nextWalls = duplicateWalls(walls);
    nextWalls.push(newWall);
    return nextWalls;
};
var duplicateWalls = function (walls) {
    var wallsCopy = [];
    for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
        var wall = walls_1[_i];
        wallsCopy.push(new RowColumnPair_1.RowColumnPair(wall.row, wall.column));
    }
    return wallsCopy;
};
