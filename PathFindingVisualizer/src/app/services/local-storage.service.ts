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
    const result: T = JSON.parse(contentOfStore) as T;
    console.log('from local storage', result);
    return result;
  }

  persistState<T>(localStorageKey: string, store: T): void {
    const storeAsString = JSON.stringify(store);
    localStorage.setItem(localStorageKey, storeAsString);
  }
}
