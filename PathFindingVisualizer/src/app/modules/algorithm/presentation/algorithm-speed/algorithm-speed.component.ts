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

  constructor(private store: Store<AppState>) {
    this.initialSpeed = -1;
    store
      .select(selectFeatureAlgorithmSpeed)
      .pipe(take(1))
      .subscribe((algorithmSpeed) => (this.initialSpeed = algorithmSpeed));
  }

  ngOnInit(): void {}

  valueChanged = (event: MatSliderChange) => {
    const speed = this.getActualValue(event.value);
    this.store.dispatch(setAlgorithmSpeed({ speed }));
  };

  formatLabel = (value: number): string => {
    const speed = this.getActualValue(value);

    switch (speed) {
      case 0:
        return 'ZACK';
      case 100:
        return 'Faaast';
      case 200:
        return 'Fast';
      case 300:
        return 'Normal';
      case 400:
        return 'Slow';
      case 500:
        return 'Slooow';
      default:
        return '';
    }
  };

  private getActualValue(value: number): number {
    return this.max - value;
  }
}
