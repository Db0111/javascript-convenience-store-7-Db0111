import productsData from './data/productsData.js';
import parseCSV from './utils/parseCSV.js';
import formatProductList from './utils/formatProductList.js';
import { InputView } from './view/InputView.js';
import { IOMessage } from './constants/IOMessage.js';
import { OutputView } from './view/OutputView.js';
import { Controller } from './controller/Controller.js';
import PurchasedList from './model/PurchasedList.js';
import Products from './model/Products.js';
import Promotion from './model/Promotion.js';
import promotionData from './data/promotionData.js';
import Membership from './model/Membership.js';
import Receipt from './model/Receipt.js';
import InputValidator from './utils/validator/InputValidator.js';

class App {
  async run() {
    const purchasedListModel = new PurchasedList();
    const promotionModel = new Promotion();
    const productModel = new Products(promotionModel);
    const membershipModel = new Membership();
    let continueShopping = true;

    const receipt = new Receipt(purchasedListModel, productModel);

    const controller = new Controller(
      productModel,
      promotionModel,
      purchasedListModel,
      membershipModel,
      receipt,
    );
    while (continueShopping) {
      OutputView.displayMessage(IOMessage.welcomeMessage);
      OutputView.displayMessage(formatProductList(parseCSV(productsData)));

      const userInput = await InputView.getUserInput(IOMessage.purchaseMessage);

      controller.loadProductData(parseCSV(productsData));
      controller.loadPromotionData(parseCSV(promotionData));

      await controller.handlePurchaseInput(userInput);

      const membershipAnswer = await InputView.getUserInput(IOMessage.membershipMessage);
      const validatedMembershipAnswer = InputValidator.validateYesNo(membershipAnswer);

      if (validatedMembershipAnswer === 'Y') {
        controller.applyMembershipDiscount();
      }

      await OutputView.displayMessage(receipt.generateReceiptMessage());

      const continueAnswer = await InputView.getUserInput(IOMessage.AddPurchaseMessage);
      const validatedAnswer = InputValidator.validateYesNo(continueAnswer);

      if (validatedAnswer === 'N') {
        continueShopping = false;

        break;
      }
    }
  }
}

export default App;
