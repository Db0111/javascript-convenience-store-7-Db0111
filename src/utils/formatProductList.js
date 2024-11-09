function formatProductList(stockData) {
  return Object.entries(stockData)
    .map(([productName, productList]) => {
      return productList
        .map(product => {
          const { price, quantity, promotion } = product;

          let promotionDescription;
          if (promotion.type !== 'null') {
            promotionDescription = promotion.type;
          } else {
            promotionDescription = '';
          }

          return `- ${productName} ${price.toLocaleString()}원 ${quantity}개 ${promotionDescription}`;
        })
        .join('\n');
    })
    .join('\n');
}
export default formatProductList;
