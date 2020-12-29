import { createReducer, on } from '@ngrx/store';
import { ColorSettings } from '../../model/ColorSettings';
import { setSettingsState, updateSettings } from './settings.actions';

export class SettingsState {
  colorSettings: ColorSettings;
}

export const initialState: SettingsState = {
  colorSettings: ColorSettings.initialSettings,
};

export const SETTINGS_STATE_LOCAL_STORAGE_KEY = 'settings-state';

const settingsReducerInternal = createReducer(
  initialState,
  on(updateSettings, (state, { newSettings }) => ({ ...state, colorSettings: newSettings })),
  on(setSettingsState, (state, { newState }) => ({ ...state, ...newState }))
);

export function settingsReducer(state, action) {
  return settingsReducerInternal(state, action);
}
