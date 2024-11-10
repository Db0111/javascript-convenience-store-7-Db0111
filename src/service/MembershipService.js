export function handleMembership(membershipAnswer, purchasedListModel, membershipModel, receipt) {
  if (membershipAnswer === 'Y') {
    const totalAmount = purchasedListModel.getTotalAmount();
    const promotionDiscountAmount = purchasedListModel.getPromotionDiscountAmount();
    const membershipDiscount = membershipModel.calculateDiscount(
      totalAmount,
      promotionDiscountAmount,
    );
    purchasedListModel.applyMembershipDiscount(membershipDiscount);
    receipt.setMembershipDiscount(membershipDiscount);
  }
}
