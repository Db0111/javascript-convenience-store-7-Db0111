function formatProductList(stockData) {
  return Object.entries(stockData)
    .map(([productName, productList]) => {
      return productList
        .map(product => {
          const { price, quantity, promotion } = product;

          let displayQuantity;
          if (quantity === 0) {
            displayQuantity = '재고 없음';
          } else {
            displayQuantity = `${quantity}개`;
          }

          let promotionDescription = '';
          if (promotion && promotion.type && promotion.type !== 'null') {
            promotionDescription = promotion.type;
          }

          let result = `- ${productName} ${price.toLocaleString()}원 ${displayQuantity}`;
          if (promotionDescription !== '') {
            result += ` ${promotionDescription}`;
          }
          return result;
        })
        .join('\n');
    })
    .join('\n');
}
export default formatProductList;
