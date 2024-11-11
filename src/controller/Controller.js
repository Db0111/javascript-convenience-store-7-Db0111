import InputValidator from '../utils/validator/InputValidator.js';
import { InputView } from '../view/InputView.js';
import { IOMessage } from '../constants/IOMessage.js';
import InputService from '../service/InputService.js';
import { processProductPurchase } from './productPurchase.js';
import { handlePromotion } from '../service/PromotionService.js';
import { handleMembership } from '../service/MembershipService.js';
import { OutputView } from '../view/OutputView.js';

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

  async handlePurchaseInput(input) {
    try {
      const parsedInput = InputService.processInput(input);
      for (const [productName, quantity] of Object.entries(parsedInput)) {
        await processProductPurchase(productName, quantity, this.productModel, this.purchasedListModel);

        const freeQuantity = await handlePromotion(productName, quantity, this.productModel, this.promotionModel, this.receipt);
        this.receipt.addItem(productName, quantity, freeQuantity);
        await this.productModel.updateStock(productName, quantity, freeQuantity);
      }
      const membershipAnswer = await InputView.getUserInput(IOMessage.membershipMessage);
      const validatedMembershipAnswer = InputValidator.validateYesNo(membershipAnswer);
      handleMembership(validatedMembershipAnswer, this.purchasedListModel, this.membershipModel, this.receipt);
    } catch (error) {
      OutputView.throwError(error);
    }
  }
}
