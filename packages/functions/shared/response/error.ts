import { TextHTTPError } from '@hawaii-bus-plus/gotrue';

export class RequiredError extends TextHTTPError {
  constructor(data: string) {
    super({ status: 400, statusText: 'Bad Request' }, data);
  }
}
