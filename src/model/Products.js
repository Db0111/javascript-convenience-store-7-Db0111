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
      if (promotion) productData.promotion = { type: promotion, promotionQuantity: +quantity };
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
      const product = this.stock[productName]?.[0];
      if (!product || !product.promotion) return this.noPromotionResponse(quantity);
      const { buy, get } = this.promotion.getPromotionInfo(product.promotion.type);
      if (quantity < Number(buy) + Number(get) && quantity === Number(buy))
        return await this.checkAdditionalQuantity(productName, quantity, Number(buy) + Number(get));
      return await this.calculatePromotionQuantity(productName, quantity, Number(buy), Number(get), product.promotion.promotionQuantity);
    } catch (error) {
      OutputView.throwError(error.message);
      return null;
    }
  }

  noPromotionResponse(quantity) {
    return {
      regularQuantity: quantity,
      freeQuantity: 0,
      message: '프로모션 적용 대상이 아닙니다.',
    };
  }

  async checkAdditionalQuantity(productName, quantity, totalNeededForSet) {
    const additionalNeeded = totalNeededForSet - quantity;
    const shouldAddMore = await InputView.getUserInput(IOMessage.promotionApplyMessage(productName, additionalNeeded));
    if (InputValidator.validateYesNo(shouldAddMore) === 'Y') {
      return this.applyPromotion(productName, totalNeededForSet);
    }
    return { regularQuantity: quantity, freeQuantity: 0 };
  }

  // async calculatePromotionQuantity(productName, quantity, buyQuantity, freeQuantity, promotionStock) {
  //   if (quantity > promotionStock) {
  //     return await this.handleInsufficientPromotionStock(productName, quantity, promotionStock, buyQuantity, freeQuantity);
  //   }
  //   const possibleSets = Math.floor(quantity / buyQuantity);
  //   return {
  //     regularQuantity: quantity, // 사용자가 입력한 수량
  //     freeQuantity: possibleSets * freeQuantity, // 무료 수량
  //   };
  // }
  async calculatePromotionQuantity(productName, quantity, buyQuantity, freeQuantity, promotionStock) {
    if (quantity > promotionStock) {
      return await this.handleInsufficientPromotionStock(productName, quantity, promotionStock, buyQuantity, freeQuantity);
    }

    const possibleSets = Math.floor(quantity / buyQuantity);
    const totalFreeQuantity = possibleSets * freeQuantity;
    if (quantity >= buyQuantity) {
      return {
        regularQuantity: quantity, // 사용자가 입력한 수량
        freeQuantity: totalFreeQuantity, // 무료 수량
      };
    }
    return {
      regularQuantity: quantity, // 사용자가 입력한 수량
      freeQuantity: 0, // 무료 수량 없음
    };
  }

  async handleInsufficientPromotionStock(productName, quantity, promotionStock, buyQuantity, freeQuantity) {
    const regularPriceQuantity = quantity - promotionStock;
    const shouldPayFull = await InputView.getUserInput(IOMessage.promotionLackMessage(productName, regularPriceQuantity));
    if (InputValidator.validateYesNo(shouldPayFull) === 'Y') {
      return this.fullPaymentResponse(quantity, promotionStock, buyQuantity, freeQuantity);
    }
    return this.promotionOnlyResponse(promotionStock, buyQuantity, freeQuantity);
  }

  fullPaymentResponse(quantity, promotionStock, buyQuantity, freeQuantity) {
    const possibleSets = Math.floor(quantity / buyQuantity);
    return {
      regularQuantity: quantity,
      freeQuantity: Math.min(possibleSets, Math.floor(promotionStock / freeQuantity)) * freeQuantity,
    };
  }

  promotionOnlyResponse(promotionStock, buyQuantity, freeQuantity) {
    const possibleSets = Math.floor(promotionStock / buyQuantity);
    return {
      regularQuantity: promotionStock,
      freeQuantity: possibleSets * freeQuantity,
    };
  }

  getStock() {
    return this.stock;
  }
}

export default Products;
