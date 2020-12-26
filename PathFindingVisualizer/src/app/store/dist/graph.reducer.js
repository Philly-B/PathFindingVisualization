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
    walls: [],
    graph: undefined
};
var graphReducerInternal = store_1.createReducer(exports.initialState, store_1.on(graph_actions_1.initiateSetStart, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.setStart, function (state, _a) {
    var startPosition = _a.startPosition;
    return (__assign(__assign({}, state), { startPosition: startPosition }));
}), store_1.on(graph_actions_1.finalizeSetStart, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.initiateModifyWalls, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.modifyWalls, function (state, _a) {
    var walls = _a.walls;
    return (__assign(__assign({}, state), { walls: walls }));
}), store_1.on(graph_actions_1.finalizeModifyWalls, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.initiateSetEnd, function (state) { return (__assign({}, state)); }), store_1.on(graph_actions_1.setEnd, function (state, _a) {
    var endPosition = _a.endPosition;
    return (__assign(__assign({}, state), { endPosition: endPosition }));
}), store_1.on(graph_actions_1.finalizeSetEnd, function (state) { return (__assign({}, state)); }));
function graphReducer(state, action) {
    return graphReducerInternal(state, action);
}
exports.graphReducer = graphReducer;
