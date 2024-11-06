const formatProductList = productList => {
  return productList.map(product => {
    const { name, price, quantity, promotion } = product;
    const priceFormatted = parseInt(price).toLocaleString();
    let quantityFormatted = '재고 없음';
    if (quantity > 0) {
      quantityFormatted = `${quantity}개`;
    }
    let promotionFormatted = '';
    if (promotion !== null && promotion !== 'null' && promotion) {
      promotionFormatted = ` ${promotion}`;
    }
    return `- ${name} ${priceFormatted}원 ${quantityFormatted}${promotionFormatted}`;
  });
};

export default formatProductList;
