import { createAction, props, union } from '@ngrx/store';
import { ColorSettings } from 'src/app/model/ColorSettings';
import { SettingsState } from './settings.reducer';

export const UPDATE_SETTING = '[Settings] update settings';
export const updateSettings = createAction(UPDATE_SETTING, props<{ newSettings: ColorSettings }>());

// PERSISTENCE
export const SAVE_TO_LOCAL_STORAGE = '[Settings] save to local storage';
export const saveToLocalStorage = createAction(SAVE_TO_LOCAL_STORAGE);

export const SAVE_TO_LOCAL_STORAGE_DONE = '[Settings] save to local storage done';
export const saveToLocalStorageDone = createAction(SAVE_TO_LOCAL_STORAGE_DONE);

export const LOAD_FROM_LOCAL_STORAGE = '[Settings] load from local storage';
export const loadFromLocalStorage = createAction(LOAD_FROM_LOCAL_STORAGE);

export const SET_SETTINGS_STATE = '[Settings] set settings state';
export const setSettingsState = createAction(SET_SETTINGS_STATE, props<{ newState: SettingsState }>());

export const RELOAD_SETTINGS_STATE = '[Settings] reload settings state';
export const reloadSettingsState = createAction(RELOAD_SETTINGS_STATE);

const all = union({
  reloadSettingsState,
  saveToLocalStorage,
  loadFromLocalStorage,
  setSettingsState,
  saveToLocalStorageDone,
  updateSettings,
});

export type SettingsActionsTypes = typeof all;
