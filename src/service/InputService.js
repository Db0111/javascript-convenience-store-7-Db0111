import { mapArrtoObject, splitArrays } from '../utils/formatInput.js';
import InputValidator from '../utils/validator/InputValidator.js';
import { OutputView } from '../view/OutputView.js';
import { ERROR_MESSAGE } from '../constants/ErrorMessage.js';
import { Regex } from '../constants/MagicNumber.js';

class InputService {
  static validate(input) {
    InputValidator.isEmpty(input);
    if (!Regex.test(input)) {
      OutputView.throwError(ERROR_MESSAGE.INVALID_FORMAT);
    }
  }

  static parseInput(input) {
    this.validate(input);
    const parsedInput = mapArrtoObject(splitArrays(input));
    this.validateParsedInput(parsedInput);
    return parsedInput;
  }

  static validateParsedInput(parsedInput) {
    for (const [name, quantity] of Object.entries(parsedInput)) {
      if (isNaN(quantity)) {
        OutputView.throwError(ERROR_MESSAGE.NOT_A_NUMBER);
      }
      if (quantity <= 0) {
        OutputView.throwError(ERROR_MESSAGE.INVALID_PURCHASE_COUNT);
      }
    }
  }

  static processInput(input) {
    this.validate(input);
    const parsedInput = this.parseInput(input);
    this.validateParsedInput(parsedInput);
    return parsedInput;
  }
}

export default InputService;
