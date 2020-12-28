"use strict";
exports.__esModule = true;
exports.selectFeatureWalls = exports.selectFeatureAlgorithmSpeed = exports.selectGraphFeature = void 0;
var store_1 = require("@ngrx/store");
exports.selectGraphFeature = function (state) { return state.graph; };
exports.selectFeatureAlgorithmSpeed = store_1.createSelector(exports.selectGraphFeature, function (state) { return state.algorithmSpeed; });
exports.selectFeatureWalls = store_1.createSelector(exports.selectGraphFeature, function (state) { return state.walls; });
