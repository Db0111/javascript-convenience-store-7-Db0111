import { ERROR_MESSAGE } from '../../constants/ErrorMessage.js';
import { OutputView } from '../../view/OutputView.js';

export class InputValidator {
  constructor(input) {
    this.input = input;
  }

  static isEmpty(input) {
    if (input === '') {
      OutputView.throwError(ERROR_MESSAGE.EMPTY_INPUT);
    }
  }
}
