import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { reloadAlgorithmState, setAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.actions';
import { selectFeatureAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-algorithm-speed',
  templateUrl: './algorithm-speed.component.html',
  styleUrls: ['./algorithm-speed.component.scss'],
})
export class AlgorithmSpeedComponent implements OnInit, OnDestroy {
  initialSpeed: number;
  min = 0;
  max = 500;
  stepSize = 100;

  labels = ['Almost Instant', 'Super Fast', 'Fast', 'Normal', 'Slow', 'Super Slow'];

  private subscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.initialSpeed = -1;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.store
      .select(selectFeatureAlgorithmSpeed)
      .pipe(take(1))
      .subscribe((algorithmSpeed) => (this.initialSpeed = this.max - algorithmSpeed));

    this.subscription = this.store
      .select(reloadAlgorithmState)
      .pipe(switchMap(() => this.store.select(selectFeatureAlgorithmSpeed)))
      .subscribe((algorithmSpeed) => (this.initialSpeed = this.max - algorithmSpeed));
  }

  valueChanged = (event) => {
    const speed = this.getActualValue(event.target.value);
    this.store.dispatch(setAlgorithmSpeed({ speed }));
  };

  private getActualValue(value: number): number {
    return this.max - value;
  }
}
