import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectFeatureAlgorithm } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-algorithm-overview',
  templateUrl: './algorithm-overview.component.html',
  styleUrls: ['./algorithm-overview.component.scss'],
})
export class AlgorithmOverviewComponent implements OnInit, OnDestroy {
  algorithm: string;
  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.subscription = store.select(selectFeatureAlgorithm).subscribe((algorithm) => {
      this.algorithm = algorithm;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}
}
