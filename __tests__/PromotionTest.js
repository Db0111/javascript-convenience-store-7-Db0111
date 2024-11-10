import Promotion from '../src/model/Promotion.js';
import Products from '../src/model/Products.js';

describe('Promotion Integration Test', () => {
  let promotion;
  let products;

  beforeEach(() => {
    promotion = new Promotion();
    const mockPromotionData = [
      {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
    ];
    promotion.loadCSVData(mockPromotionData);

    products = new Products(promotion);
    // 상품 데이터 설정
    const mockProductData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
        promotionQuantity: 10,
      },
    ];
    products.loadCSVData(mockProductData);
  });

  // 테스트가 끝난 후 정리
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  // 모든 테스트가 끝난 후 정리
  afterAll(() => {
    jest.resetModules();
  });

  test('프로모션이 유효한 날짜인지 확인', () => {
    expect(promotion.isPromotionValid('탄산2+1')).toBeTruthy();
  });

  test('2+1 프로모션 적용 시 무료 수량 계산', () => {
    const freeQuantity = promotion.calculateFreeQuantity('탄산2+1', 4);
    expect(freeQuantity).toBe(2); // 4개 구매시 2개 무료
  });

  test('프로모션 적용 후 재고 차감 확인', () => {
    const initialPromotionStock = mockProductData.promotionQuantity;

    products.applyPromotion('콜라', 4);

    const finalPromotionStock = mockProductData.promotionQuantity;

    expect(initialPromotionStock - finalPromotionStock).toBe(2);
  });

  test('프로모션 수량이 부족한 경우 재고 차감 확인', () => {
    products.getStock()['콜라'].promotion[0].promotionQuantity = 1;

    const initialStock = products.getStock()['콜라'].quantity;
    const initialPromotionStock = products.getStock()['콜라'].promotion[0].promotionQuantity;

    products.applyPromotion('콜라', 4);

    const finalStock = products.getStock()['콜라'].quantity;
    const finalPromotionStock = products.getStock()['콜라'].promotion[0].promotionQuantity;

    // 4개 구매 + 1개만 증정 가능해서 총 5개 감소
    expect(initialStock - finalStock).toBe(5);
    // 증정품 1개만큼 프로모션 재고 감소
    expect(initialPromotionStock - finalPromotionStock).toBe(1);
  });
});
