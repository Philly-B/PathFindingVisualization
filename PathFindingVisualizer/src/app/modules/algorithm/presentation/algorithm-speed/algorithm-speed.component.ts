import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { setAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.actions';
import { selectFeatureAlgorithmSpeed } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-algorithm-speed',
  templateUrl: './algorithm-speed.component.html',
  styleUrls: ['./algorithm-speed.component.scss'],
})
export class AlgorithmSpeedComponent implements OnInit {
  initialSpeed: number;
  min = 0;
  max = 500;
  stepSize = 100;

  labels = ['Like Instant', 'Super Fast', 'Fast', 'Normal', 'Slow', 'Super Slow'];

  constructor(private store: Store<AppState>) {
    this.initialSpeed = -1;
    store
      .select(selectFeatureAlgorithmSpeed)
      .pipe(take(1))
      .subscribe((algorithmSpeed) => (this.initialSpeed = algorithmSpeed));
  }

  ngOnInit(): void {}

  valueChanged = (event) => {
    const speed = this.getActualValue(event.target.value);
    console.log(speed);
    this.store.dispatch(setAlgorithmSpeed({ speed }));
  };

  private getActualValue(value: number): number {
    return this.max - value;
  }
}
