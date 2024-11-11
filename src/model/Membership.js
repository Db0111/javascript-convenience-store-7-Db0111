class Membership {
  static DISCOUNT_RATE = 0.3;
  static MAX_DISCOUNT = 8000;

  calculateDiscount(totalAmount, promotionDiscountAmount = 0) {
    const discountableAmount = totalAmount - promotionDiscountAmount;
    const calculatedDiscount = discountableAmount * Membership.DISCOUNT_RATE;

    const roundedDiscount = Math.floor(calculatedDiscount / 1000) * 1000;
    return Math.min(roundedDiscount, Membership.MAX_DISCOUNT);
  }
}

export default Membership;
