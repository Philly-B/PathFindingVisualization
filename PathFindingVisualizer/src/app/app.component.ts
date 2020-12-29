import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ModalSettingsComponent } from './modals/modal-settings/modal-settings.component';
import { loadFromLocalStorage as initAlgorithmStore } from './store/algorithm-store/algorithm.actions';
import { AppState } from './store/app.reducer';
import { loadFromLocalStorage as initGraphStore } from './store/graph-store/graph.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Path Finding Visualizer';

  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);

  constructor(private overlay: OverlayContainer, private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkmode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });

    this.store.dispatch(initGraphStore());
    this.store.dispatch(initAlgorithmStore());
  }

  openSettingsModal = (): void => {
    const dialogRef = this.dialog.open(ModalSettingsComponent, {
      data: { name: 'hello', animal: 'as' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.somethingChanged) {
        // TODO persist settings
      }
    });
  };
}
