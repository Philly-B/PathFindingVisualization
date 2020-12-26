"use strict";

exports.__esModule = true;
exports.GraphCellConstraint = exports.GraphCell = void 0;

var GraphCell =
/** @class */
function () {
  function GraphCell() {}

  return GraphCell;
}();

exports.GraphCell = GraphCell;
var GraphCellConstraint;

(function (GraphCellConstraint) {
  GraphCellConstraint[GraphCellConstraint["WALL"] = 0] = "WALL";
  GraphCellConstraint[GraphCellConstraint["START"] = 1] = "START";
  GraphCellConstraint[GraphCellConstraint["END"] = 2] = "END";
  GraphCellConstraint[GraphCellConstraint["PASSABLE"] = 3] = "PASSABLE";
  GraphCellConstraint[GraphCellConstraint["FINAL_PATH"] = 4] = "FINAL_PATH";
})(GraphCellConstraint = exports.GraphCellConstraint || (exports.GraphCellConstraint = {}));