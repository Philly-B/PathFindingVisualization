export class BaseError {
  constructor() {
    Error.apply(this, arguments);
  }
}
