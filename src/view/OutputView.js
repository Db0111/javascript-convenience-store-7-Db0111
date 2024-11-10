import { Console } from '@woowacourse/mission-utils';

export class OutputView {
  static displayMessage(message) {
    Console.print(message);
  }

  static displayError(errorMessage) {
    Console.print(`[ERROR] ${errorMessage}`);
  }

  static throwError(errormessage) {
    throw new Error(`${errormessage}`);
  }
}
