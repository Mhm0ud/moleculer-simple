import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

export class MyError extends MoleculerError {
  constructor(
    name: string,
    message: string,
    code: number,
    type?: string,
    data?: any
  ) {
    super(message, code, type, data);
    this.name = name;
  }
}
