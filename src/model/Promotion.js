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

  checkValidDate() {
    const date = DateTimes.now();
    return date >= this.promotion.start_date && date <= this.promotion.end_date;
  }
}
export default Promotion;
