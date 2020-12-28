import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { setAlgorithmSpeed } from 'src/app/store/graph.actions';
import { GraphState } from 'src/app/store/graph.reducer';
import { selectFeatureAlgorithmSpeed } from 'src/app/store/graph.selectors';

@Component({
  selector: 'app-algorithm-speed',
  templateUrl: './algorithm-speed.component.html',
})
export class AlgorithmSpeedComponent implements OnInit {
  initialSpeed: number;
  min = 0;
  max = 500;
  stepSize = 50;

  constructor(private store: Store<{ graph: GraphState }>) {
    this.initialSpeed = -1;
    store
      .select(selectFeatureAlgorithmSpeed)
      .pipe(take(1))
      .subscribe((algorithmSpeed) => (this.initialSpeed = algorithmSpeed));
  }

  ngOnInit(): void {}

  valueChanged = (event) => {
    const speed = this.max - event.target.value;
    console.log(speed, this.initialSpeed);
    this.store.dispatch(setAlgorithmSpeed({ speed }));
  };
}
