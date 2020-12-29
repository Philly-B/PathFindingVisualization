import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmControlsComponent } from './presentation/algorithm-controls/algorithm-controls.component';
import { AlgorithmInfoComponent } from './presentation/algorithm-info/algorithm-info.component';
import { AlgorithmSpeedComponent } from './presentation/algorithm-speed/algorithm-speed.component';
import { AlgorithmOverviewComponent } from './presentation/algorithm-overview/algorithm-overview.component';
import { AlgorithmSelectionComponent } from './presentation/algorithm-selection/algorithm-selection.component';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AlgorithmControlsComponent,
    AlgorithmInfoComponent,
    AlgorithmSpeedComponent,
    AlgorithmOverviewComponent,
    AlgorithmSelectionComponent,
  ],
  imports: [CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatSliderModule],
  exports: [AlgorithmOverviewComponent, AlgorithmInfoComponent],
})
export class AlgorithmModule {}
