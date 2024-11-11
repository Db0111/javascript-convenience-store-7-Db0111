import { IOMessage } from '../constants/IOMessage.js';
import { InputView } from '../view/InputView.js';
import { OutputView } from '../view/OutputView.js';
import InputValidator from '../utils/validator/InputValidator.js';

class Products {
  constructor(promotion) {
    this.stock = {};
    this.promotion = promotion;
  }

  updateStock(productName, quantity, freeQuantity) {
    const products = this.stock[productName];
    if (products) {
      products.forEach((product, index) => {
        product.quantity = Number(product.quantity); // 강제 변환
        product.quantity -= quantity + freeQuantity;
      });
    }
  }

  loadCSVData(csvData) {
    csvData.forEach(({ price, quantity, promotion, name }) => {
      const productData = { price: +price, quantity: +quantity };
      if (promotion) {
        productData.promotion = { type: promotion, promotionQuantity: +quantity };
      }
      if (this.stock[name]) {
        this.stock[name].push(productData);
      } else {
        this.stock[name] = [productData];
      }
    });
  }

  checkStock(productName, quantity) {
    if (!this.isProductAvailable(productName)) {
      return 'PRODUCT_NOT_FOUND';
    }
    if (!this.isStockSufficient(productName, quantity)) {
      return 'EXCEEDS_STOCK';
    }
    return true;
  }

  isProductAvailable(productName) {
    return !!this.stock[productName];
  }

  isStockSufficient(productName, quantity) {
    const totalStock = this.stock[productName].reduce((sum, product) => sum + product.quantity, 0);
    return totalStock >= quantity;
  }

  checkPromotion(productName) {
    const products = this.stock[productName];
    for (const product of products) {
      if (product.promotion && product.promotion.type && product.promotion.type !== 'null') {
        return product.promotion.type;
      }
    }
    return false;
  }

  async applyPromotion(productName, quantity) {
    try {
      const products = this.stock[productName];
      if (!products || !products[0].promotion)
        return {
          regularQuantity: quantity,
          freeQuantity: 0,
          message: '프로모션 적용 대상이 아닙니다.',
        };

      const promotionData = products[0].promotion;
      const promotionInfo = this.promotion.getPromotionInfo(promotionData.type);
      const buyQuantity = Number(promotionInfo.buy);
      const freeQuantity = Number(promotionInfo.get);
      const totalNeededForSet = buyQuantity + freeQuantity;

      if (quantity < totalNeededForSet && quantity === buyQuantity) {
        const additionalNeeded = totalNeededForSet - quantity;
        const shouldAddMore = await InputView.getUserInput(
          IOMessage.promotionApplyMessage(productName, additionalNeeded),
        );
        if (InputValidator.validateYesNo(shouldAddMore) === 'Y')
          return this.applyPromotion(productName, totalNeededForSet);
        return { regularQuantity: quantity, freeQuantity: 0 };
      }

      const possibleSets = Math.floor(quantity / buyQuantity);
      const remainingQuantity = quantity % buyQuantity;
      const promotionStock = promotionData.promotionQuantity;
      const availableSets = Math.min(possibleSets, Math.floor(promotionStock / freeQuantity));
      if (quantity > promotionStock) {
        // 일반 가격으로 계산되는 수량 (프로모션 재고를 제외한 나머지 수량)
        const regularPriceQuantity = quantity - promotionStock;

        const shouldPayFull = await InputView.getUserInput(
          IOMessage.promotionLackMessage(productName, regularPriceQuantity),
        );

        if (InputValidator.validateYesNo(shouldPayFull) === 'Y') {
          return {
            regularQuantity:
              regularPriceQuantity +
              Math.min(possibleSets, Math.floor(promotionStock / freeQuantity)) * buyQuantity +
              remainingQuantity,
            freeQuantity:
              Math.min(possibleSets, Math.floor(promotionStock / freeQuantity)) * freeQuantity,
          };
        }

        // 프로모션 재고만 적용
        return {
          regularQuantity: promotionStock + remainingQuantity,
          freeQuantity:
            Math.min(possibleSets, Math.floor(promotionStock / freeQuantity)) * freeQuantity,
        };
      }

      return {
        regularQuantity: possibleSets * buyQuantity + remainingQuantity,
        freeQuantity: possibleSets * freeQuantity,
      };
    } catch (error) {
      OutputView.throwError(error.message);
      return null;
    }
  }

  getStock() {
    return this.stock;
  }
}

export default Products;
