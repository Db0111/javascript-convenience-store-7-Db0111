import { Console } from '@woowacourse/mission-utils';

export class InputView {
  static displayMessage(message) {
    Console.print(message);
  }

  static getUserInput(message) {
    const userInput = Console.readLineAsync(message);
    return userInput;
  }
}
