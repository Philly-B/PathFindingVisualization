import { AbstractAlgorithm } from './AbstractAlgorithm';

export class AlgorithmWrapper {
  constructor(
    public algorithmName: string,
    public description: string,
    public newInstanceProvider: (graph, options, callback) => AbstractAlgorithm
  ) {}
}
