class PurchasedList {
  constructor() {
    this.items = [];
    this.promotionDiscountAmount = 0;
    this.membershipDiscountAmount = 0;
  }

  addProduct(name, quantity, price) {
    if (this.items[name]) {
      this.items[name].quantity += quantity;
    } else {
      this.items[name] = {
        quantity: quantity,
        price: Number(price),
      };
    }
  }

  getPurchasedItems() {
    return this.items;
  }

  applyMembershipDiscount(discountAmount) {
    this.membershipDiscountAmount = discountAmount;
  }

  getTotalAmount() {
    const total = Object.entries(this.items).reduce((sum, [name, item]) => {
      return sum + item.price * item.quantity;
    }, 0);
    return total;
  }

  getPromotionDiscountAmount() {
    return this.promotionDiscountAmount;
  }

  getFinalAmount() {
    const finalAmount = this.getTotalAmount() - this.promotionDiscountAmount - this.membershipDiscountAmount;

    return finalAmount;
  }

  clear() {
    this.items = [];
  }
}
export default PurchasedList;
