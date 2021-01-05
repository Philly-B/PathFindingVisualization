import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ModalSettingsComponent, ModifiableSettings } from './modals/modal-settings/modal-settings.component';
import { loadFromLocalStorage as initAlgorithmStore } from './store/algorithm-store/algorithm.actions';
import { AppState } from './store/app.reducer';
import { loadFromLocalStorage as initGraphStore } from './store/graph-store/graph.actions';
import { loadFromLocalStorage as initSettingsStore } from './store/settings-store/settings.actions';
import { updateColorSettings } from './store/settings-store/settings.actions';
import { selectSettingsState } from './store/settings-store/settings.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Path Finding Visualizer';

  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);

  constructor(private overlay: OverlayContainer, private store: Store<AppState>, private dialog: MatDialog) { }

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
    this.store.dispatch(initSettingsStore());
  }

  openSettingsModal = (): void => {
    this.store
      .select(selectSettingsState)
      .pipe(
        take(1),
        map((state) => state.colorSettings),
        map((colorSettings) => new ModifiableSettings(colorSettings))
      )
      .subscribe(this.showModal);
  };

  private showModal = (modifiableSettings: ModifiableSettings): void => {
    this.dialog
      .open(ModalSettingsComponent, {
        data: modifiableSettings,
      })
      .afterClosed()
      .subscribe((result: ModifiableSettings) => {
        if (result) {
          this.store.dispatch(updateColorSettings({ colorSettings: result.colorSettings }));
        }
      });
  };
}
