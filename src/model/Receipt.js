class Receipt {
  constructor(purchasedList, productModel) {
    this.purchasedList = purchasedList;
    this.productModel = productModel;
    this.items = [];
    this.promotionItems = [];
    this.promotionDiscount = 0;
    this.membershipDiscount = 0;
  }

  addItem(name, quantity, freeQuantity) {
    const productData = this.productModel.getStock()[name];
    let product;

    if (Array.isArray(productData)) {
      product = productData[0];
    } else {
      product = productData;
    }
    const price = product.price;

    this.items.push({
      name,
      quantity: Number(quantity + freeQuantity),
      price,
      subtotal: price * Number(quantity + freeQuantity),
    });
  }

  addPromotionItem(name, quantity) {
    const productData = this.productModel.getStock()[name];
    let product;

    if (Array.isArray(productData)) {
      product = productData[0];
    } else {
      product = productData;
    }
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
    message += '상품명\t\t수량\t금액\n';

    this.items.forEach(item => {
      message += `${item.name}\t\t\t${item.quantity}\t${item.subtotal.toLocaleString()}\n`;
    });

    if (this.promotionItems.length > 0) {
      message += '=============증      정===============\n';
      this.promotionItems.forEach(item => {
        message += `${item.name}\t\t\t${item.quantity}\n`;
      });
    }

    message += '======================================\n';
    message += `총구매액\t\t${this.items.reduce((sum, item) => sum + item.quantity, 0)}\t${this.getTotalAmount().toLocaleString()}\n`;

    if (this.promotionDiscount > 0) {
      message += `행사할인\t\t\t-${this.promotionDiscount.toLocaleString()}\n`;
    }

    if (this.membershipDiscount > 0) {
      message += `멤버십할인\t\t\t-${this.membershipDiscount.toLocaleString()}\n`;
    }

    message += `내실돈\t\t\t\t${this.getFinalAmount().toLocaleString()}\n`;

    return message;
  }
}

export default Receipt;
