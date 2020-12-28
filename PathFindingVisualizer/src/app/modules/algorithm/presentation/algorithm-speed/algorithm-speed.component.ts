import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { setAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.actions';
import { selectFeatureAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-algorithm-speed',
  templateUrl: './algorithm-speed.component.html',
})
export class AlgorithmSpeedComponent implements OnInit {
  initialSpeed: number;
  min = 0;
  max = 500;
  stepSize = 50;

  constructor(private store: Store<AppState>) {
    this.initialSpeed = -1;
    store
      .select(selectFeatureAlgorithmSpeed)
      .pipe(take(1))
      .subscribe((algorithmSpeed) => (this.initialSpeed = algorithmSpeed));
  }

  ngOnInit(): void {}

  valueChanged = (event) => {
    const speed = this.max - event.target.value;
    this.store.dispatch(setAlgorithmSpeed({ speed }));
  };
}
