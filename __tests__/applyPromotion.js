import Products from '../src/model/Products.js';
import { InputView } from '../src/view/InputView.js';
import IOMessage from '../src/constants/IOMessage.js';
import InputValidator from '../src/utils/validator/InputValidator.js';

jest.mock('../src/view/InputView.js');
jest.mock('../src/utils/validator/InputValidator.js');
jest.mock('../src/constants/IOMessage.js');

describe('Products 클래스의 applyPromotion 메서드 테스트', () => {
  let products;

  beforeEach(() => {
    products = new Products({
      getPromotionInfo: jest.fn().mockReturnValue({ buy: 2, get: 1 }),
    });

    InputView.getUserInput.mockResolvedValue('Y');
    InputValidator.validateYesNo.mockReturnValue('Y');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('프로모션이 적용되는 제품에서 탄산2+1 프로모션이 정상적으로 적용된다', async () => {
    products.stock = {
      탄산수: [
        {
          price: 1000,
          quantity: 10,
          promotion: {
            type: '탄산2+1',
            promotionQuantity: 5,
          },
        },
      ],
    };

    const result = await products.applyPromotion('탄산수', 5);
    expect(result).toEqual({
      regularQuantity: 5,
      freeQuantity: 2,
    });
  });

  test('프로모션이 적용되지 않는 제품에서 프로모션이 적용되지 않는다', async () => {
    products.stock = {
      오렌지주스: [
        {
          price: 1000,
          quantity: 10,
        },
      ],
    };

    const result = await products.applyPromotion('오렌지주스', 5);
    expect(result).toEqual({
      regularQuantity: 5,
      freeQuantity: 0,
      message: '프로모션 적용 대상이 아닙니다.',
    });
  });

  test('수량이 부족할 경우, 사용자에게 추가 입력을 받아서 프로모션을 적용한다', async () => {
    products.stock = {
      탄산수: [
        {
          price: 1000,
          quantity: 10,
          promotion: {
            type: '탄산2+1',
            promotionQuantity: 5,
          },
        },
      ],
    };

    InputView.getUserInput.mockResolvedValueOnce('Y');
    const result = await products.applyPromotion('탄산수', 1);
    expect(result).toEqual({
      regularQuantity: 3,
      freeQuantity: 1,
    });
  });

  test('수량이 부족할 경우, 사용자에게 추가 입력을 받아서 프로모션을 적용한다(다른 입력)', async () => {
    products.stock = {
      탄산수: [
        {
          price: 1000,
          quantity: 10,
          promotion: {
            type: '탄산2+1',
            promotionQuantity: 5,
          },
        },
      ],
    };

    InputView.getUserInput.mockResolvedValueOnce('Y');
    const result = await products.applyPromotion('탄산수', 2);
    expect(result).toEqual({
      regularQuantity: 3,
      freeQuantity: 1,
    });
  });

  test('프로모션 재고가 부족할 경우, 부족한 수량을 계산하여 사용자에게 알린다', async () => {
    products.stock = {
      탄산수: [
        {
          price: 1000,
          quantity: 10,
          promotion: {
            type: '탄산2+1',
            promotionQuantity: 5,
          },
        },
      ],
    };

    const result = await products.applyPromotion('탄산수', 6);
    expect(result).toEqual({
      regularQuantity: 5,
      freeQuantity: 0,
    });
  });
});
