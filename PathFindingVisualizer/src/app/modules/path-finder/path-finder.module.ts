import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphControlsComponent } from './presentation/graph-controls/graph-controls.component';
import { GraphViewComponent } from './components/graph-view/graph-view.component';
import { GraphOverviewComponent } from './presentation/graph-overview/graph-overview.component';
import { GraphGridViewComponent } from './presentation/graph-grid-view/graph-grid-view.component';
import { GraphGridSizeComponent } from './presentation/graph-grid-size/graph-grid-size.component';

@NgModule({
  declarations: [GraphControlsComponent, GraphViewComponent, GraphGridViewComponent, GraphOverviewComponent, GraphGridSizeComponent],
  imports: [CommonModule],
  exports: [GraphOverviewComponent],
})
export class PathFinderModule {}
