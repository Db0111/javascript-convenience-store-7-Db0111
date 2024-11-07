class PurchasedList {
  constructor() {
    this.items = {};
  }

  addProduct(name, quantity) {
    if (this.items[name]) {
      this.items[name] += quantity;
    } else {
      this.items[name] = quantity;
    }
  }

  getPurchasedItems() {
    return this.items;
  }
}
export default PurchasedList;
