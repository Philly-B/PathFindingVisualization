import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { algorithmReducer } from 'src/app/store/algorithm-store/algorithm.reducer';
import { selectAlgorithmStore, selectFeatureAlgorithm } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { AlgorithmProviderService } from '../../algorithms/algorithm-provider.service';

@Component({
  selector: 'app-algorithm-info',
  template: '<span>{{description}}</span>',
  styleUrls: ['./algorithm-info.component.scss'],
})
export class AlgorithmInfoComponent implements OnDestroy {
  description: string;
  private algorithm: string;
  private subscription: Subscription;

  constructor(private algorithmProvider: AlgorithmProviderService, private store: Store<AppState>) {
    this.subscription = store.select(selectFeatureAlgorithm).subscribe(this.updateDescription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateDescription = (algorithm): void => {
    this.algorithm = algorithm;
    if (this.algorithm) {
      this.description = this.algorithmProvider.getDescription(this.algorithm);
    } else {
      this.description = '';
    }
  };
}
