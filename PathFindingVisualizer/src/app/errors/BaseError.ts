export class BaseError {
  constructor(private errorMessage: string) {
    Error.apply(this, arguments);
  }

  getMessage(): string {
    return this.errorMessage;
  }
}
