export const splitArrays = purchasedList => {
  return purchasedList.split(',').map(item => item.replace(/[\[\]]/g, '').trim());
};

export const mapArrtoObject = arr => {
  return arr.reduce((acc, item) => {
    const [name, quantity] = item.split('-');
    acc[name.trim()] = parseInt(quantity.trim(), 10);
    return acc;
  }, {});
};
