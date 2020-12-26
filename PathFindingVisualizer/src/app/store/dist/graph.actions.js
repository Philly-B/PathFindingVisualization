"use strict";
exports.__esModule = true;
exports.setNewGraph = exports.SET_NEW_GRAPH = exports.modifyGridSize = exports.MODIFY_GRID_SIZE = exports.finalizeModifyWalls = exports.FINALIZE_SET_WALLS = exports.modifyWalls = exports.MODIFY_WALLS = exports.initiateModifyWalls = exports.INIT_MODIFY_WALLS = exports.finalizeSetEnd = exports.FINALIZE_SET_END = exports.setEnd = exports.SET_END = exports.initiateSetEnd = exports.INIT_SET_END = exports.finalizeSetStart = exports.FINALIZE_SET_START = exports.setStart = exports.SET_START = exports.initiateSetStart = exports.INIT_SET_START = void 0;
var store_1 = require("@ngrx/store");
exports.INIT_SET_START = '[Graph Component] initiate set start';
exports.initiateSetStart = store_1.createAction(exports.INIT_SET_START);
exports.SET_START = '[Graph Component] set start';
exports.setStart = store_1.createAction(exports.SET_START, store_1.props());
exports.FINALIZE_SET_START = '[Graph Component] finalize set start';
exports.finalizeSetStart = store_1.createAction(exports.FINALIZE_SET_START);
exports.INIT_SET_END = '[Graph Component] initiate set end';
exports.initiateSetEnd = store_1.createAction(exports.INIT_SET_END);
exports.SET_END = '[Graph Component] set end';
exports.setEnd = store_1.createAction(exports.SET_END, store_1.props());
exports.FINALIZE_SET_END = '[Graph Component] finalize set end';
exports.finalizeSetEnd = store_1.createAction(exports.FINALIZE_SET_END);
exports.INIT_MODIFY_WALLS = '[Graph Component] initiate modify walls';
exports.initiateModifyWalls = store_1.createAction(exports.INIT_MODIFY_WALLS);
exports.MODIFY_WALLS = '[Graph Component] modify walls';
exports.modifyWalls = store_1.createAction(exports.MODIFY_WALLS, store_1.props());
exports.FINALIZE_SET_WALLS = '[Graph Component] finalize modify walls';
exports.finalizeModifyWalls = store_1.createAction(exports.FINALIZE_SET_WALLS);
exports.MODIFY_GRID_SIZE = '[Graph Component] modify grid size';
exports.modifyGridSize = store_1.createAction(exports.MODIFY_GRID_SIZE, store_1.props());
exports.SET_NEW_GRAPH = '[Graph Component] set new graph';
exports.setNewGraph = store_1.createAction(exports.SET_NEW_GRAPH, store_1.props());
var all = store_1.union({
    initiateSetStart: exports.initiateSetStart,
    setStart: exports.setStart,
    finalizeSetStart: exports.finalizeSetStart,
    initiateSetEnd: exports.initiateSetEnd,
    setEnd: exports.setEnd,
    finalizeSetEnd: exports.finalizeSetEnd,
    initiateModifyWalls: exports.initiateModifyWalls,
    modifyWalls: exports.modifyWalls,
    finalizeModifyWalls: exports.finalizeModifyWalls,
    modifyGridSize: exports.modifyGridSize,
    setNewGraph: exports.setNewGraph
});
