class Membership {
  static DISCOUNT_RATE = 0.3;
  static MAX_DISCOUNT = 8000;

  calculateDiscount(totalAmount, promotionDiscountAmount = 0) {
    const discountableAmount = totalAmount - promotionDiscountAmount;
    const calculatedDiscount = discountableAmount * Membership.DISCOUNT_RATE;

    return Math.min(calculatedDiscount, Membership.MAX_DISCOUNT);
  }
}

export default Membership;
