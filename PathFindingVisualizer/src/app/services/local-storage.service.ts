import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getState<T>(localStorageKey: string): T {
    const contentOfStore = localStorage.getItem(localStorageKey);
    if (contentOfStore === null) {
      return {} as T;
    }
    return JSON.parse(contentOfStore) as T;
  }

  persistState<T>(localStorageKey: string, store: T): void {
    const storeAsString = JSON.stringify(store);
    localStorage.setItem(localStorageKey, storeAsString);
  }
}
