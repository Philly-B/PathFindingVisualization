"use strict";
exports.__esModule = true;
exports.getColorForHexagon = exports.hexagonInsideEnd = exports.hexagonInsideStart = exports.hexagonInsideWall = exports.hexagonInsideVisited = exports.hexagonInsideInConsideration = exports.hexagonInsideFinalPath = exports.hexagonInsidePassable = exports.hexagonBorder = void 0;
var GraphCell_1 = require("../model/GraphCell");
// HEXAGON
var hexagonBorder = 255;
exports.hexagonBorder = hexagonBorder;
var hexagonInsidePassable = [173, 219, 151];
exports.hexagonInsidePassable = hexagonInsidePassable;
var hexagonInsideInConsideration = [145, 179, 235];
exports.hexagonInsideInConsideration = hexagonInsideInConsideration;
var hexagonInsideVisited = [73, 134, 235];
exports.hexagonInsideVisited = hexagonInsideVisited;
var hexagonInsideFinalPath = [0, 34, 89];
exports.hexagonInsideFinalPath = hexagonInsideFinalPath;
var hexagonInsideWall = [43, 10, 191];
exports.hexagonInsideWall = hexagonInsideWall;
var hexagonInsideStart = [16, 179, 59];
exports.hexagonInsideStart = hexagonInsideStart;
var hexagonInsideEnd = [230, 100, 64];
exports.hexagonInsideEnd = hexagonInsideEnd;
exports.getColorForHexagon = function (graphCell) {
    switch (graphCell.graphCellConstraint) {
        case GraphCell_1.GraphCellConstraint.START:
            return hexagonInsideStart;
        case GraphCell_1.GraphCellConstraint.END:
            return hexagonInsideEnd;
        case GraphCell_1.GraphCellConstraint.WALL:
            return hexagonInsideWall;
        case GraphCell_1.GraphCellConstraint.IN_CONSIDERATION:
            return hexagonInsideInConsideration;
        case GraphCell_1.GraphCellConstraint.VISITED:
            return hexagonInsideVisited;
        case GraphCell_1.GraphCellConstraint.FINAL_PATH:
            return hexagonInsideFinalPath;
        default:
            return hexagonInsidePassable;
    }
};
