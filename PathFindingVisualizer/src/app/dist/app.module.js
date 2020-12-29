"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
var app_component_1 = require("./app.component");
var path_finder_module_1 = require("src/app/modules/path-finder/path-finder.module");
var effects_1 = require("@ngrx/effects");
var graph_effects_1 = require("./store/graph-store/graph.effects");
var algorithm_module_1 = require("./modules/algorithm/algorithm.module");
var app_reducer_1 = require("./store/app.reducer");
var animations_1 = require("@angular/platform-browser/animations");
var toolbar_1 = require("@angular/material/toolbar");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var forms_1 = require("@angular/forms");
var icon_1 = require("@angular/material/icon");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var ngx_toastr_1 = require("ngx-toastr");
var GeneralConstants_1 = require("./constants/GeneralConstants");
var algorithm_effects_1 = require("./store/algorithm-store/algorithm.effects");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule,
                path_finder_module_1.PathFinderModule,
                algorithm_module_1.AlgorithmModule,
                icon_1.MatIconModule,
                toolbar_1.MatToolbarModule,
                slide_toggle_1.MatSlideToggleModule,
                form_field_1.MatFormFieldModule,
                forms_1.ReactiveFormsModule,
                input_1.MatInputModule,
                ngx_toastr_1.ToastrModule.forRoot(GeneralConstants_1.NOTIFICATION_SETTINGS),
                store_1.StoreModule.forRoot(app_reducer_1.AppReducers),
                effects_1.EffectsModule.forRoot([]),
                effects_1.EffectsModule.forFeature([graph_effects_1.GraphEffects, algorithm_effects_1.AlgorithmEffects]),
                animations_1.BrowserAnimationsModule,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
