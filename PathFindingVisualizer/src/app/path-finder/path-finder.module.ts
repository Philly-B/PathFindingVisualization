import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { GraphControlsComponent } from './presentation/graph-controls/graph-controls.component';
import { GraphViewComponent } from './presentation/graph-view/graph-view.component';
import { GraphOverviewComponent } from './presentation/graph-overview/graph-overview.component';
import { AstarControlsComponent } from './presentation/astar-controls/astar-controls.component';
import { AstarSpeedComponent } from './presentation/astar-speed/astar-speed.component';
import { AstarInfoComponent } from './presentation/astar-info/astar-info.component';
import { AstarOverviewComponent } from './presentation/astar-overview/astar-overview.component';



@NgModule({
  declarations: [
    OverviewComponent,
    GraphControlsComponent,
    GraphViewComponent,
    GraphOverviewComponent,
    AstarControlsComponent,
    AstarSpeedComponent,
    AstarInfoComponent,
    AstarOverviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OverviewComponent
  ]
})
export class PathFinderModule { }
