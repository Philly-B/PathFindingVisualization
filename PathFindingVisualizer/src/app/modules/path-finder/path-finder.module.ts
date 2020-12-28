import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphControlsComponent } from './presentation/graph-controls/graph-controls.component';
import { GraphViewComponent } from './presentation/graph-view/graph-view.component';
import { GraphOverviewComponent } from './presentation/graph-overview/graph-overview.component';

@NgModule({
  declarations: [GraphControlsComponent, GraphViewComponent, GraphOverviewComponent],
  imports: [CommonModule],
  exports: [GraphOverviewComponent],
})
export class PathFinderModule {}
