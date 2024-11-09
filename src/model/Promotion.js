import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  constructor() {
    this.promotion = {};
  }

  loadCSVData(csvData) {
    csvData.forEach(item => {
      this.promotion[item.name] = {
        buy: item.buy,
        get: item.get,
        start_date: new Date(item.start_date),
        end_date: new Date(item.end_date),
      };
    });
  }

  isPromotionValid(promotionName) {
    const promotion = this.promotion[promotionName];
    if (!promotion) return false;

    const currentDate = DateTimes.now();
    return currentDate >= promotion.start_date && currentDate <= promotion.end_date;
  }

  calculateFreeQuantity(promotionName, quantity) {
    const promotion = this.promotion[promotionName];
    if (!promotion) return 0;

    return Math.floor(quantity / promotion.buy) * promotion.get;
  }

  getPromotionInfo(promotionName) {
    return this.promotion[promotionName];
  }
}

export default Promotion;
