export async function handlePromotion(
  productName,
  quantity,
  productModel,
  promotionModel,
  receipt,
) {
  const existPromotion = productModel.checkPromotion(productName);
  let freeQuantity = 0;

  if (existPromotion && promotionModel.isPromotionValid(existPromotion)) {
    const promotionResult = await productModel.applyPromotion(productName, quantity);
    if (promotionResult && promotionResult.freeQuantity > 0) {
      receipt.addPromotionItem(productName, promotionResult.freeQuantity);
      receipt.setPromotionDiscount(promotionResult.freeQuantity);
      freeQuantity = promotionResult.freeQuantity;
    }
  }
  return freeQuantity;
}
