import { createSelector } from '@ngrx/store';
import { SettingsState } from 'src/app/store/settings-store/settings.reducer';
import { AppState } from '../app.reducer';

export const selectSettingsState = (state: AppState) => state.settings;

export const selectColorSettings = createSelector(
    selectSettingsState,
    (settingsState: SettingsState) => settingsState.colorSettings
);
