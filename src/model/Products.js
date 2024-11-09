import { ERROR_MESSAGE } from '../constants/ErrorMessage.js';
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
    csvData.forEach(item => {
      const productData = {
        price: Number(item.price),
        quantity: Number(item.quantity),
        promotion: null,
      };

      if (item.promotion !== null) {
        productData.promotion = {
          type: item.promotion,
          promotionQuantity: Number(item.quantity),
        };
      }

      if (this.stock[item.name]) {
        this.stock[item.name].push(productData);
      } else {
        this.stock[item.name] = [productData];
      }
    });
  }

  checkStock(productName, quantity) {
    if (!this.stock[productName]) {
      OutputView.throwError(ERROR_MESSAGE.PRODUCT_NOT_FOUND);
    }

    const totalStock = this.stock[productName].reduce((sum, product) => sum + product.quantity, 0);
    if (totalStock < quantity) {
      OutputView.throwError(ERROR_MESSAGE.EXCEEDS_STOCK);
    }
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

      if (!products || !products[0].promotion) {
        return {
          regularQuantity: quantity,
          freeQuantity: 0,
          message: '프로모션 적용 대상이 아닙니다.',
        };
      }

      const promotionData = products[0].promotion;
      const promotionInfo = this.promotion.getPromotionInfo(promotionData.type);

      const buyQuantity = Number(promotionInfo.buy);
      const freeQuantity = Number(promotionInfo.get);

      const totalNeededForSet = buyQuantity + freeQuantity;

      if (quantity < totalNeededForSet) {
        const additionalNeeded = totalNeededForSet - quantity;
        const shouldAddMore = await InputView.getUserInput(
          IOMessage.promotionApplyMessage(productName, additionalNeeded),
        );

        if (InputValidator.validateYesNo(shouldAddMore) === 'Y') {
          return this.applyPromotion(productName, totalNeededForSet);
        }

        return {
          regularQuantity: quantity,
          freeQuantity: 0,
        };
      }

      if (buyQuantity === 1 && freeQuantity === 1) {
        const possibleSets = Math.floor(quantity / 2);
        const remainingQuantity = quantity % 2;

        return {
          regularQuantity: possibleSets + remainingQuantity,
          freeQuantity: possibleSets,
        };
      }

      const possibleSets = Math.floor(quantity / buyQuantity);
      const remainingQuantity = quantity % buyQuantity;

      const promotionStock = promotionData.promotionQuantity;
      const availableSets = Math.min(possibleSets, Math.floor(promotionStock / freeQuantity));

      if (quantity > promotionStock) {
        const regularPriceQuantity =
          (possibleSets - availableSets) * buyQuantity + remainingQuantity;
        const shouldPayFull = await InputView.getUserInput(
          IOMessage.promotionLackMessage(productName, regularPriceQuantity),
        );

        if (InputValidator.validateYesNo(shouldPayFull) === 'Y') {
          return {
            regularQuantity: regularPriceQuantity + availableSets * buyQuantity,
            freeQuantity: availableSets * freeQuantity,
          };
        }

        return {
          regularQuantity: availableSets * buyQuantity,
          freeQuantity: availableSets * freeQuantity,
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
