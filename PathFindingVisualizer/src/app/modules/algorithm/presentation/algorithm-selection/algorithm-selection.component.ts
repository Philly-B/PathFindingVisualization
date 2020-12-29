import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { reloadAlgorithmState, setAlgorithm } from 'src/app/store/algorithm-store/algorithm.actions';
import { selectFeatureAlgorithm } from 'src/app/store/algorithm-store/algorithm.selectors';
import { AppState } from 'src/app/store/app.reducer';
import { AlgorithmProviderService } from '../../algorithms/algorithm-provider.service';

@Component({
  selector: 'app-algorithm-selection',
  templateUrl: './algorithm-selection.component.html',
  styleUrls: ['./algorithm-selection.component.scss'],
})
export class AlgorithmSelectionComponent implements OnInit {
  algorithms: string[];

  currentValue: string;

  constructor(private algorithmProvider: AlgorithmProviderService, private store: Store<AppState>) {
    this.algorithms = algorithmProvider.getPossibleAlgorithms();
  }

  ngOnInit(): void {
    this.store
      .select(reloadAlgorithmState)
      .pipe(
        switchMap(() => this.store.select(selectFeatureAlgorithm)),
        tap((a) => console.log(a))
      )
      .subscribe((a) => (this.currentValue = a));
  }

  selectedOption = (selectionChange: MatSelectChange): void => {
    this.store.dispatch(setAlgorithm({ algorithm: selectionChange.value }));
  };
}
