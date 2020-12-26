"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphSizeControlComponent = void 0;
var core_1 = require("@angular/core");
var graph_actions_1 = require("src/app/store/graph.actions");
var GraphSizeControlComponent = /** @class */ (function () {
    function GraphSizeControlComponent(store) {
        var _this = this;
        this.store = store;
        this.defaultValue = 25;
        this.graphSizeChanged = function ($event) {
            _this.value = $event.target.value;
            _this.store.dispatch(graph_actions_1.modifyGridSize({ newGridSize: _this.value }));
        };
        this.value = this.defaultValue;
    }
    GraphSizeControlComponent.prototype.ngOnInit = function () { };
    GraphSizeControlComponent = __decorate([
        core_1.Component({
            selector: 'app-graph-size-control',
            templateUrl: './graph-size-control.component.html',
            styleUrls: ['./graph-size-control.component.scss']
        })
    ], GraphSizeControlComponent);
    return GraphSizeControlComponent;
}());
exports.GraphSizeControlComponent = GraphSizeControlComponent;
