import InputService from './InputService.js';

import { OutputView } from '../view/OutputView.js';
import { ERROR_MESSAGE } from '../constants/ErrorMessage.js';

export async function handleStockCheck(userInput, productModel) {
  const parsedInput = InputService.processInput(userInput);
  for (const [productName, quantity] of Object.entries(parsedInput)) {
    const stockCheckResult = productModel.checkStock(productName, quantity);
    if (stockCheckResult !== true) {
      await displayStockError(stockCheckResult);
      return null;
    }
  }
  return userInput;
}

async function displayStockError(errorCode) {
  if (errorCode === 'PRODUCT_NOT_FOUND') {
    OutputView.displayError(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
  } else if (errorCode === 'EXCEEDS_STOCK') {
    OutputView.displayError(ERROR_MESSAGE.EXCEEDS_STOCK);
  }
}
