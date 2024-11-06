import { splitArrays, mapArrtoObject } from '../src/utils/formatInput.js';

describe('구매 내역을 입력받을 수 있다.', () => {
  test('구매한 물건을 쉼표 기준으로 분리한다.', () => {
    const input = '[콜라-2],[사이다-3]';
    const result = splitArrays(input); // splitArrays 함수 호출
    expect(result).toEqual(['콜라-2', '사이다-3']); // 배열 내용이 같은지 비교
  });

  test('정상적인 형태로 입력 받은 경우 대괄호 안에 있는 데이터를 파싱하여 객체로 나타낸다.', () => {
    const input = ['콜라-2', '사이다-3'];
    const result = mapArrtoObject(input);
    expect(result).toEqual({ 콜라: 2, 사이다: 3 });
  });
});
