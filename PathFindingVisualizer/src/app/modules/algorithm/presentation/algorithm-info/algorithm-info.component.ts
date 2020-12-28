import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAlgorithmStore, selectFeatureAlgorithm } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AlgorithmProviderService } from '../../algorithms/algorithm-provider.service';

@Component({
  selector: 'app-algorithm-info',
  template: '<span>{{description}}</span>',
})
export class AlgorithmInfoComponent implements OnChanges {
  @Input() algorithm: string;

  description: string;

  constructor(private algorithmProvider: AlgorithmProviderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['algorithm']) {
      this.updateDescription();
    }
  }

  private updateDescription = (): void => {
    if (this.algorithm) {
      this.description = this.algorithmProvider.getDescription(this.algorithm);
    } else {
      this.description = '';
    }
  };
}
