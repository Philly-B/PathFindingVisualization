"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PathFinderModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var overview_component_1 = require("./overview/overview.component");
var graph_controls_component_1 = require("./presentation/graph-controls/graph-controls.component");
var graph_view_component_1 = require("./presentation/graph-view/graph-view.component");
var graph_overview_component_1 = require("./presentation/graph-overview/graph-overview.component");
var astar_controls_component_1 = require("./presentation/astar-controls/astar-controls.component");
var astar_speed_component_1 = require("./presentation/astar-speed/astar-speed.component");
var astar_info_component_1 = require("./presentation/astar-info/astar-info.component");
var astar_overview_component_1 = require("./presentation/astar-overview/astar-overview.component");
var PathFinderModule = /** @class */ (function () {
    function PathFinderModule() {
    }
    PathFinderModule = __decorate([
        core_1.NgModule({
            declarations: [
                overview_component_1.OverviewComponent,
                graph_controls_component_1.GraphControlsComponent,
                graph_view_component_1.GraphViewComponent,
                graph_overview_component_1.GraphOverviewComponent,
                astar_controls_component_1.AstarControlsComponent,
                astar_speed_component_1.AstarSpeedComponent,
                astar_info_component_1.AstarInfoComponent,
                astar_overview_component_1.AstarOverviewComponent,
            ],
            imports: [common_1.CommonModule],
            exports: [overview_component_1.OverviewComponent]
        })
    ], PathFinderModule);
    return PathFinderModule;
}());
exports.PathFinderModule = PathFinderModule;
