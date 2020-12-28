import { Injectable } from '@angular/core';
import { AbstractAlgorithm } from './AbstractAlgorithm';
import { AlgorithmWrapper } from './AlgorithmWrapper';
import { AStarAlgorithm } from './AStarAlgorithm';
import { RandomPathAlgorithm } from './RandomPathAlgorithm';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmProviderService {
  private algorithms: AlgorithmWrapper[] = [];

  constructor() {
    this.algorithms.push(
      new AlgorithmWrapper(
        'A*',
        'bla bla blub',
        (graph, options, callback) => new AStarAlgorithm(graph, options, callback)
      )
    );
    this.algorithms.push(
      new AlgorithmWrapper(
        'Random Path',
        'bibo bibu buba',
        (graph, options, callback) => new RandomPathAlgorithm(graph, options, callback)
      )
    );
  }

  getPossibleAlgorithms() {
    return this.algorithms.map((aw) => aw.algorithmName);
  }

  getDescription(algorithmName: string): string {
    return this.getAlgorithmForName(algorithmName).description;
  }

  createNewInstance(algorithmName: string, graph, options, callback): AbstractAlgorithm {
    return this.getAlgorithmForName(algorithmName).newInstanceProvider(graph, options, callback);
  }

  // get new instance of
  private getAlgorithmForName = (algorithmName: string): AlgorithmWrapper => {
    for (const algoWrapper of this.algorithms) {
      if (algoWrapper.algorithmName === algorithmName) {
        return algoWrapper;
      }
    }

    return undefined;
  };
}
