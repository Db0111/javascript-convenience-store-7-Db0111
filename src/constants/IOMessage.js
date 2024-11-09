export const IOMessage = Object.freeze({
  welcomeMessage: `안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다. \n`,
  purchaseMessage: `\n 구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1]) \n`,
  promotionApplyMessage: (product, count) =>
    `현재 ${product}은(는) ${count}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N) \n`,
  promotionLackMessage: (product, count) =>
    `현재 ${product} ${count}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N) \n`,
  membershipMessage: `멤버십 할인을 받으시겠습니까? (Y/N) \n`,
  AddPurchaseMessage: `감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N) \n`,
});
