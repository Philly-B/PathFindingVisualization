import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { selectSettingsState } from 'src/app/store/settings-store/settings.selectors';
import { AppState } from '../app.reducer';
import {
  LOAD_FROM_LOCAL_STORAGE,
  reloadSettingsState,
  saveToLocalStorageDone,
  saveToLocalStorage,
  SAVE_TO_LOCAL_STORAGE,
  setSettingsState,
  SettingsActionsTypes,
  UPDATE_COLOR_SETTINGS,
} from './settings.actions';
import { SettingsState, SETTINGS_STATE_LOCAL_STORAGE_KEY } from './settings.reducer';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions<SettingsActionsTypes>,
    private store$: Store<AppState>,
    private localStorage: LocalStorageService
  ) { }

  triggerSaveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_COLOR_SETTINGS),
      map((a) => saveToLocalStorage())
    )
  );

  saveToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SAVE_TO_LOCAL_STORAGE),
      withLatestFrom(this.store$.select(selectSettingsState)),
      map(([action, store]) => this.localStorage.persistState(SETTINGS_STATE_LOCAL_STORAGE_KEY, store)),
      map((a) => saveToLocalStorageDone())
    )
  );

  loadFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_FROM_LOCAL_STORAGE),
      switchMap((a) => [
        setSettingsState({ newState: this.localStorage.getState<SettingsState>(SETTINGS_STATE_LOCAL_STORAGE_KEY) }),
        reloadSettingsState(),
      ])
    )
  );
}
