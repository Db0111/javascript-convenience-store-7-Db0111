import productsData from './data/productsData.js';
import parseCSV from './utils/parseCSV.js';
import formatProductList from './utils/formatProductList.js';
import { InputView } from './view/InputView.js';
import { IOMessage } from './constants/IOMessage.js';
import { OutputView } from './view/OutputView.js';
import { Controller } from './controller/Controller.js';
import { handleStockCheck } from './service/StockCheckService.js';
import PurchasedList from './model/PurchasedList.js';
import Products from './model/Products.js';
import Promotion from './model/Promotion.js';
import promotionData from './data/promotionData.js';
import Membership from './model/Membership.js';
import Receipt from './model/Receipt.js';
import InputValidator from './utils/validator/InputValidator.js';

class App {
  async run() {
    const [purchasedListModel, promotionModel, productModel, membershipModel, receipt, controller] =
      this.initModels();
    this.purchasedListModel = purchasedListModel;
    this.receipt = receipt;

    await this.loadData(controller);

    let continueShopping = true;

    while (continueShopping) {
      await this.displayWelcomeMessage(productModel);
      let userInput = await this.handleUserInput(productModel);
      if (!userInput) continue;
      await this.processPurchase(userInput, controller, receipt);
      continueShopping = await this.askForContinue();
    }
  }

  initModels() {
    const purchasedListModel = new PurchasedList();
    const promotionModel = new Promotion();
    const productModel = new Products(promotionModel);
    const membershipModel = new Membership();
    const receipt = new Receipt(purchasedListModel, productModel);
    const controller = new Controller(
      productModel,
      promotionModel,
      purchasedListModel,
      membershipModel,
      receipt,
    );
    return [purchasedListModel, promotionModel, productModel, membershipModel, receipt, controller];
  }

  async displayWelcomeMessage(productModel) {
    OutputView.displayMessage(IOMessage.welcomeMessage);
    OutputView.displayMessage(formatProductList(productModel.getStock()));
  }

  async loadData(controller) {
    controller.loadProductData(parseCSV(productsData));
    controller.loadPromotionData(parseCSV(promotionData));
  }

  async handleUserInput(productModel) {
    let isStockAvailable = false;
    let userInput;
    while (!isStockAvailable) {
      try {
        userInput = await InputView.getUserInput(IOMessage.purchaseMessage);
        if (!userInput) {
          continue;
        }
        userInput = await handleStockCheck(userInput, productModel);
        isStockAvailable = true;
      } catch (error) {
        OutputView.displayError(error.message);
        continue;
      }
    }
    return userInput;
  }

  async processPurchase(userInput, controller, receipt) {
    await controller.handlePurchaseInput(userInput);
    await OutputView.displayMessage(receipt.generateReceiptMessage());
  }

  async askForContinue() {
    const continueAnswer = await InputView.getUserInput(IOMessage.AddPurchaseMessage);
    const validatedAnswer = InputValidator.validateYesNo(continueAnswer);
    if (validatedAnswer === 'Y') {
      this.clearPreviousData();
    }
    return validatedAnswer === 'Y';
  }

  clearPreviousData() {
    this.purchasedListModel.clear();
    this.receipt.clear();
  }
}

export default App;
