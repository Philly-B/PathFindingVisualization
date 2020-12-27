"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.P5UtilService = void 0;
var core_1 = require("@angular/core");
var ColorMapping = require("src/app/constants/ColorMapping");
var P5UtilService = /** @class */ (function () {
    function P5UtilService() {
        var _this = this;
        this.graphDefinition = function (picture, graph, settings, hexagonClickedCallback) {
            var pictureShift = {
                x: settings.hexagonSizePx * 1.8,
                y: settings.hexagonSizePx * 3,
                z: 0
            };
            picture.setup = function () {
                var canvas = picture.createCanvas(settings.canvasSizePx, settings.canvasSizePx);
                picture.angleMode(picture.RADIANS);
            };
            picture.draw = function () {
                picture.background(ColorMapping.background);
                _this.drawHexagons(picture, graph.grid, pictureShift, settings);
            };
            picture.mouseClicked = function () {
                _this.handleMouseEvent(graph.grid, settings, hexagonClickedCallback, picture);
            };
            picture.mouseDragged = function () {
                _this.handleMouseEvent(graph.grid, settings, hexagonClickedCallback, picture);
            };
        };
        this.pixelToHex = function (graph, picture, x, y, settings) {
            for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
                var hexRow = graph_1[_i];
                for (var _a = 0, hexRow_1 = hexRow; _a < hexRow_1.length; _a++) {
                    var currHex = hexRow_1[_a];
                    var dist = picture.sqrt(picture.pow(x - currHex.center.x, 2) + picture.pow(y - currHex.center.y, 2));
                    if (dist <= settings.hexagonSizePx) {
                        return currHex;
                    }
                }
            }
            return undefined;
        };
        this.handleMouseEvent = function (graph, settings, hexagonClickedCallback, picture) {
            var hexagonClicked = _this.pixelToHex(graph, picture, picture.mouseX, picture.mouseY, settings);
            if (hexagonClicked === undefined) {
                return false;
            }
            hexagonClickedCallback(hexagonClicked);
            return false;
        };
        this.drawHexagons = function (picture, graph, pictureShift, settings) {
            for (var row = 0; row < graph.length; row++) {
                var colShift = row % 2 === 1 ? 1 : 0;
                for (var col = 0; col < graph[row].length; col++) {
                    var centerOfHexagonPx = _this.hexToPixel(picture, col + colShift, row, pictureShift, settings);
                    graph[row][col].center = centerOfHexagonPx;
                    _this.drawOneHexagon(picture, graph[row][col], settings);
                }
            }
        };
        this.drawOneHexagon = function (picture, hexagon, settings) {
            var points = [];
            for (var i = 0; i < 6; i++) {
                points.push(_this.hexCorner(picture, hexagon.center, i, settings));
            }
            picture.stroke(ColorMapping.hexagonBorder);
            picture.strokeWeight(settings.hexagonLinesBetweenSizePx);
            picture.beginShape();
            for (var i = 0; i <= points.length; i++) {
                picture.fill(ColorMapping.getColorForHexagon(hexagon));
                picture.vertex(points[i % points.length].x, points[i % points.length].y);
            }
            picture.endShape();
        };
        /**
         * Index of points is clockwise and starts with 0 at the bottom right corner of a hexagon
         */
        this.hexCorner = function (picture, center, indexOfPoint, settings) {
            var angleDeg = 60 * indexOfPoint + 30;
            var angleRad = (picture.PI / 180) * angleDeg;
            return picture.createVector(center.x + settings.hexagonSizePx * picture.cos(angleRad), center.y + settings.hexagonSizePx * picture.sin(angleRad));
        };
    }
    P5UtilService.prototype.hexToPixel = function (picture, col, row, pictureShift, settings) {
        var isUnevenRow = row % 2 === 1;
        var x = (picture.sqrt(3) * col + (picture.sqrt(3) / 2) * (isUnevenRow ? 0 : 1)) * settings.hexagonSizePx;
        var y = (3 / 2) * row * settings.hexagonSizePx;
        return picture.createVector(x + pictureShift.x, y + pictureShift.y);
    };
    P5UtilService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], P5UtilService);
    return P5UtilService;
}());
exports.P5UtilService = P5UtilService;
