import { OutputView } from '../view/OutputView.js';

export async function processProductPurchase(
  productName,
  quantity,
  productModel,
  purchasedListModel,
) {
  try {
    const price = Number(productModel.getStock()[productName][0].price);
    purchasedListModel.addProduct(productName, quantity, price);
  } catch (error) {
    OutputView.throwError(error.message);
  }
}
