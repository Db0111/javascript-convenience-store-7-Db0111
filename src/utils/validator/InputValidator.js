import { ERROR_MESSAGE } from '../../constants/ErrorMessage.js';
import { OutputView } from '../../view/OutputView.js';

export default class InputValidator {
  constructor(input) {
    this.input = input;
  }

  static isEmpty(input) {
    if (input === '') {
      OutputView.throwError(ERROR_MESSAGE.EMPTY_INPUT);
    }
  }

  static validateYesNo(input) {
    const upperInput = input.toUpperCase();
    if (upperInput !== 'Y' && upperInput !== 'N') {
      throw new Error(ERROR_MESSAGE.INVALID_YESNO);
    }
    return upperInput;
  }
}
