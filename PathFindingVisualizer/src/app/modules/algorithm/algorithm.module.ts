import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmControlsComponent } from './presentation/algorithm-controls/algorithm-controls.component';
import { AlgorithmInfoComponent } from './presentation/algorithm-info/algorithm-info.component';
import { AlgorithmSpeedComponent } from './presentation/algorithm-speed/algorithm-speed.component';
import { AlgorithmOverviewComponent } from './presentation/algorithm-overview/astar-overview.component';

@NgModule({
  declarations: [
    AlgorithmControlsComponent,
    AlgorithmInfoComponent,
    AlgorithmSpeedComponent,
    AlgorithmOverviewComponent,
  ],
  imports: [CommonModule],
  exports: [AlgorithmOverviewComponent],
})
export class AlgorithmModule {}
