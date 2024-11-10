import { ERROR_MESSAGE } from '../src/constants/ErrorMessage.js';
import { Controller } from '../src/controller/Controller.js';
import { Regex } from '../src/constants/MagicNumber.js';

describe('입력값 유효성 검사 테스트', () => {
  const controller = new Controller();
  test.each([
    ['[사이다-2]', true, null],
    ['[사이다-2],[감자칩-1]', true, null],
    ['[콜라-10], [사이다-5]', true, null],
    ['[초콜릿-3],[껌-4]', true, null],

    ['[사이다-]', false, ERROR_MESSAGE.INVALID_FORMAT], // 수량 누락
    ['[사이다-abc]', false, ERROR_MESSAGE.INVALID_FORMAT], // 숫자가 아닌 수량
    ['사이다-2', false, ERROR_MESSAGE.INVALID_FORMAT], // 대괄호 누락
    ['[사이다2]', false, ERROR_MESSAGE.INVALID_FORMAT], // 하이픈 누락
    ['[사이다 2]', false, ERROR_MESSAGE.INVALID_FORMAT], // 하이픈 대신 공백
    ['[사이다-2] [콜라-3]', false, ERROR_MESSAGE.INVALID_FORMAT], // 쉼표 누락
    ['[사이다-2,콜라-3]', false, ERROR_MESSAGE.INVALID_FORMAT], // 대괄호 누락
  ])('유효성 검사 실행: "%s"', async (input, expectedResult, expectedError) => {
    if (expectedResult) {
      const isValid = Regex.test(input);
      expect(isValid).toBe(true);
    } else {
      await expect(() => controller.validate(input)).toThrowError(new Error(`${expectedError}`));
    }
  });
});
