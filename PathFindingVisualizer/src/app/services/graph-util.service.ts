import { Injectable } from '@angular/core';
import { Hexagon } from '../path-finder/model/Hexagon';

@Injectable({
  providedIn: 'root',
})
export class GraphUtilService {
  constructor() {}

  initGraph = (N: number): Hexagon[][] => {
    const graph = [];
    for (let row = 0; row < N; row++) {
      const currRow = [];
      for (let col = 0; col < N; col++) {
        currRow.push(new Hexagon(undefined, row, col));
      }
      graph.push(currRow);
    }
    return graph;
  };
}
