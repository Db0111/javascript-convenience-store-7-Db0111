import productsData from './data/productsData.js';
import parseCSV from './utils/parseCSV.js';
import formatProductList from './utils/formatProductList.js';
import { InputView } from './view/InputView.js';
import { IOMessage } from './constants/IOMessage.js';
import { OutputView } from './view/OutputView.js';
import { Controller } from './controller/Controller.js';
import PurchasedList from './model/PurchasedList.js';
import Products from './model/Products.js';
import promotionData from './data/promotionData.js';

class App {
  async run() {
    OutputView.displayMessage(IOMessage.welcomeMessage);
    OutputView.displayMessage(formatProductList(parseCSV(productsData)));
    const userInput = await InputView.getUserInput(IOMessage.purchaseMessage);

    const purchasedListModel = new PurchasedList();
    const productModel = new Products();
    const controller = new Controller(productModel, purchasedListModel);
    controller.loadProductData(parseCSV(productsData));
    controller.loadPromotionData(parseCSV(promotionData));
    controller.handlePurchaseInput(userInput);
    OutputView.displayMessage(purchasedListModel.getPurchasedItems());
    OutputView.displayMessage(productModel.getStock());
  }
}

export default App;
