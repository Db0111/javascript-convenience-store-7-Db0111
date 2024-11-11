import { MEMBERSHIP } from '../constants/MagicNumber.js';

class Membership {
  static DISCOUNT_RATE = MEMBERSHIP.DISCOUNT_RATE;
  static MAX_DISCOUNT = MEMBERSHIP.MAX_DISCOUNT;

  calculateDiscount(totalAmount, promotionDiscountAmount = 0) {
    const discountableAmount = totalAmount - promotionDiscountAmount;
    const calculatedDiscount = discountableAmount * Membership.DISCOUNT_RATE;

    const roundedDiscount = Math.floor(calculatedDiscount / MEMBERSHIP.ROUNDING_UNIT) * MEMBERSHIP.ROUNDING_UNIT;
    return Math.min(roundedDiscount, Membership.MAX_DISCOUNT);
  }
}

export default Membership;
