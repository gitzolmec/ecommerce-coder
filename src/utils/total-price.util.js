function totalPrice(products) {
  let finalTotal = 0;
  let totalunitario = [];

  products.forEach((product) => {
    const productTotal = product.price * product.quantity;
    totalunitario.push(productTotal);
    finalTotal += productTotal;
  });

  finalTotal = parseFloat(finalTotal.toFixed(2));

  return { finalTotal, totalunitario };
}

export default totalPrice;
