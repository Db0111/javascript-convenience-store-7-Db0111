import { splitArrays, mapArrtoObject } from '../src/utils/formatInput.js';
import PurchasedList from '../src/model/PurchasedList.js';

const input = '[콜라-2],[사이다-3]';
describe('구매 내역을 입력받을 수 있다.', () => {
  test('구매한 물건을 쉼표 기준으로 분리한다.', () => {
    const result = mapArrtoObject(splitArrays(input));
    const purchasedList = new PurchasedList();
    for (const [name, quantity] of Object.entries(result)) {
      purchasedList.addProduct(name, quantity);
    }
    expect(purchasedList.getPurchasedItems()).toEqual({ 콜라: 2, 사이다: 3 });
  });
});
