export function handleMembership(membershipAnswer, purchasedListModel, membershipModel, receipt) {
  console.log('Validated Membership Answer:', membershipAnswer);
  if (membershipAnswer === 'Y') {
    const totalAmount = purchasedListModel.getTotalAmount();
    const promotionDiscountAmount = purchasedListModel.getPromotionDiscountAmount();
    console.log(`총 금액: ${totalAmount}, 프로모션 할인 금액: ${promotionDiscountAmount}`);

    const membershipDiscount = membershipModel.calculateDiscount(
      totalAmount,
      promotionDiscountAmount,
    );
    console.log('Membership Discount:', membershipDiscount);
    purchasedListModel.applyMembershipDiscount(membershipDiscount);
    receipt.setMembershipDiscount(membershipDiscount);
  }
}
