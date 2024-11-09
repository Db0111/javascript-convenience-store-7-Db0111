import { splitArrays, mapArrtoObject } from '../utils/formatInput.js';
import InputValidator from '../utils/validator/InputValidator.js';
import { Regex } from '../constants/MagicNumber.js';
import { OutputView } from '../view/OutputView.js';
import { ERROR_MESSAGE } from '../constants/ErrorMessage.js';
import { InputView } from '../view/InputView.js';
import { IOMessage } from '../constants/IOMessage.js';
import Receipt from '../model/Receipt.js';

export class Controller {
  productModel;
  promotionModel;
  purchasedListModel;
  membershipModel;
  receipt;

  constructor(productModel, promotionModel, purchasedListModel, membershipModel, receipt) {
    this.productModel = productModel;
    this.promotionModel = promotionModel;
    this.purchasedListModel = purchasedListModel;
    this.membershipModel = membershipModel;
    this.receipt = receipt;
  }

  loadProductData(csvData) {
    this.productModel.loadCSVData(csvData);
  }

  loadPromotionData(csvData) {
    this.promotionModel.loadCSVData(csvData);
  }

  validate(input) {
    InputValidator.isEmpty(input);
    if (!Regex.test(input)) {
      OutputView.throwError(ERROR_MESSAGE.INVALID_FORMAT);
    }
  }

  validateParsedInput(parsedInput) {
    for (const [name, quantity] of Object.entries(parsedInput)) {
      if (isNaN(quantity)) {
        OutputView.throwError(ERROR_MESSAGE.NOT_A_NUMBER);
      }
      if (quantity <= 0) {
        OutputView.throwError(ERROR_MESSAGE.INVALID_PURCHASE_COUNT);
      }
    }
  }

  async handlePurchaseInput(input) {
    try {
      this.validate(input);
      const parsedInput = mapArrtoObject(splitArrays(input));
      this.validateParsedInput(parsedInput);

      for (const [productName, quantity] of Object.entries(parsedInput)) {
        const productData = this.productModel.getStock()[productName];
        const product = Array.isArray(productData) ? productData[0] : productData;
        const price = product.price;

        this.receipt.addItem(productName, quantity);
        this.purchasedListModel.addProduct(productName, quantity, price);
        this.productModel.checkStock(productName, quantity);
        if (this.productModel.checkPromotion(productName)) {
          const promotionResult = await this.productModel.applyPromotion(productName, quantity);
          if (promotionResult && promotionResult.freeQuantity > 0) {
            this.receipt.addPromotionItem(productName, promotionResult.freeQuantity);
          }
        }
      }
    } catch (error) {
      OutputView.throwError(error.message);
      return this.handlePurchaseInput(await InputView.getUserInput(IOMessage.purchaseMessage));
    }
  }

  applyMembershipDiscount() {
    const totalAmount = this.purchasedListModel.getTotalAmount();
    const promotionDiscountAmount = this.purchasedListModel.getPromotionDiscountAmount();

    const membershipDiscount = this.membershipModel.calculateDiscount(
      totalAmount,
      promotionDiscountAmount,
    );

    this.purchasedListModel.applyMembershipDiscount(membershipDiscount);
    Receipt.setMembershipDiscount(membershipDiscount);
  }
}
