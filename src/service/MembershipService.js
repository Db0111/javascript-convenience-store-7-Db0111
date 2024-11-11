export function handleMembership(membershipAnswer, purchasedListModel, membershipModel, receipt) {
  if (membershipAnswer === 'Y') {
    const membershipDiscount = membershipModel.calculateDiscount(
      purchasedListModel.getTotalAmount(),
      purchasedListModel.getPromotionDiscountAmount(),
    );
    purchasedListModel.applyMembershipDiscount(membershipDiscount);
    receipt.setMembershipDiscount(membershipDiscount);
  }
}
