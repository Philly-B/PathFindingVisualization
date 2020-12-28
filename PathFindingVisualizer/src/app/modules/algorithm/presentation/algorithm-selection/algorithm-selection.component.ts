import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { setAlgorithm } from 'src/app/store/algorithm-store/algorithm.actions';
import { AppState } from 'src/app/store/app.reducer';
import { AlgorithmProviderService } from '../../algorithms/algorithm-provider.service';

@Component({
  selector: 'app-algorithm-selection',
  templateUrl: './algorithm-selection.component.html',
  styleUrls: ['./algorithm-selection.component.scss'],
})
export class AlgorithmSelectionComponent implements OnInit {
  algorithms: string[];

  constructor(private algorithmProvider: AlgorithmProviderService, private store: Store<AppState>) {
    this.algorithms = algorithmProvider.getPossibleAlgorithms();
  }

  ngOnInit(): void {}

  selectedOption = (selectionChange: MatSelectChange): void => {
    this.store.dispatch(setAlgorithm({ algorithm: selectionChange.value }));
  };
}
