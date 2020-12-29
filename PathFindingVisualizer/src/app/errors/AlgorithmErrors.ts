import { BaseError } from './BaseError';

export class StartNotDefinedError extends BaseError {
  constructor() {
    super('The start point is not defined.');
  }
}

export class EndNotDefinedError extends BaseError {
  constructor() {
    super('The end point is not defined.');
  }
}
