function totalPrice(products) {
  let totalPrice = 0;
  let itemTotal = [];

  products.forEach((product) => {
    let productTotal = product.price * product.quantity;
    productTotal = parseFloat(productTotal.toFixed(2));
    itemTotal.push(productTotal);
    totalPrice += productTotal;
  });

  totalPrice = parseFloat(totalPrice.toFixed(2));

  return { totalPrice, itemTotal };
}

export default totalPrice;
