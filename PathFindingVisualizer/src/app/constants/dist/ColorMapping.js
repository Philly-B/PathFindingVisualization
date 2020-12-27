"use strict";
exports.__esModule = true;
exports.getColorForHexagon = exports.hexagonInsideEnd = exports.hexagonInsideStart = exports.hexagonInsideWall = exports.hexagonInsideFinalPath = exports.hexagonInsidePassable = exports.hexagonBorder = exports.background = void 0;
var GraphCell_1 = require("../model/GraphCell");
// GENERAL
var background = [219, 237, 255];
exports.background = background;
// HEXAGON
var hexagonBorder = 255;
exports.hexagonBorder = hexagonBorder;
var hexagonInsidePassable = [173, 219, 151];
exports.hexagonInsidePassable = hexagonInsidePassable;
var hexagonInsideFinalPath = [98, 156, 70];
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
        default:
            return hexagonInsidePassable;
    }
};
