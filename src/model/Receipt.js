class Receipt {
  constructor(purchasedList, productModel) {
    this.purchasedList = purchasedList;
    this.productModel = productModel;
    this.items = [];
    this.promotionItems = [];
    this.promotionDiscount = 0;
    this.membershipDiscount = 0;
  }

  clear() {
    this.items = [];
    this.promotionItems = [];
    this.promotionDiscount = 0;
    this.membershipDiscount = 0;
  }

  getProduct(name) {
    const productData = this.productModel.getStock()[name];
    if (Array.isArray(productData)) {
      return productData[0]; // 배열일 경우 첫 번째 아이템
    } else {
      return productData; // 배열이 아니면 그대로 반환
    }
  }

  addItem(name, quantity) {
    const product = this.getProduct(name);
    const price = product.price;
    this.items.push({
      name,
      quantity: Number(quantity),
      price,
      subtotal: price * Number(quantity),
    });
  }

  addPromotionItem(name, quantity) {
    const product = this.getProduct(name);
    const price = product.price;

    this.promotionItems.push({
      name,
      quantity: Number(quantity),
      price,
    });
  }

  setPromotionDiscount() {
    let totalDiscount = 0;
    this.promotionItems.forEach(item => {
      totalDiscount += item.quantity * item.price;
    });
    this.promotionDiscount = totalDiscount;
  }

  setMembershipDiscount(amount) {
    this.membershipDiscount = amount;
  }

  getTotalAmount() {
    const total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    return total;
  }

  getFinalAmount() {
    return this.getTotalAmount() - this.promotionDiscount - this.membershipDiscount;
  }

  generateReceiptMessage() {
    let message = '==============W 편의점================\n';
    message += this.getItemList();
    message += this.getPromotionItems();
    message += this.getTotalSummary();
    message += this.getDiscounts();
    message += this.getFinalAmountSummary();
    return message;
  }

  getItemList() {
    return this.items.reduce((message, item) => {
      return message + `${item.name}\t\t\t${item.quantity}\t${item.subtotal.toLocaleString()}\n`;
    }, '상품명\t\t\t수량\t금액\n');
  }

  getPromotionItems() {
    if (this.promotionItems.length > 0) {
      return (
        '=============증      정===============\n' +
        this.promotionItems.reduce((message, item) => {
          return message + `${item.name}\t\t\t${item.quantity}\n`;
        }, '')
      );
    }
    return '';
  }

  getTotalSummary() {
    const totalAmount = this.getTotalAmount().toLocaleString();
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    return `======================================\n총구매액\t\t${totalQuantity}\t${totalAmount}\n`;
  }

  getDiscounts() {
    let discounts = '';
    if (this.promotionDiscount > 0) {
      discounts += `행사할인\t\t\t-${this.promotionDiscount.toLocaleString()}\n`;
    }
    if (this.membershipDiscount > 0) {
      discounts += `멤버십할인\t\t\t-${this.membershipDiscount.toLocaleString()}\n`;
    }
    return discounts;
  }

  getFinalAmountSummary() {
    return `내실돈\t\t\t\t${this.getFinalAmount().toLocaleString()}\n`;
  }
}

export default Receipt;
