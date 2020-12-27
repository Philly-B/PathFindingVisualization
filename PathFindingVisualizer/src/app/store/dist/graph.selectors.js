"use strict";
exports.__esModule = true;
exports.selectFeatureWalls = exports.selectFeatureEndPosition = exports.selectFeatureStartPosition = exports.selectFeature = void 0;
var store_1 = require("@ngrx/store");
exports.selectFeature = function (state) { return state.graph; };
exports.selectFeatureStartPosition = store_1.createSelector(exports.selectFeature, function (state) { return state.startPosition; });
exports.selectFeatureEndPosition = store_1.createSelector(exports.selectFeature, function (state) { return state.endPosition; });
exports.selectFeatureWalls = store_1.createSelector(exports.selectFeature, function (state) { return state.walls; });
