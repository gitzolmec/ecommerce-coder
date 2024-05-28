const socket = io();

socket.on("cartUpdated", (Cart, totalProducts, total, view) => {
  const products = Cart.products;

  if (view) {
    document.getElementById("carritoContenedor").textContent = totalProducts;

    products.forEach((product, index) => {
      const quantity = document.getElementById(`quantity-${product.id}`);

      if (quantity) {
        quantity.textContent = product.quantity;
      }

      const priceForOne = document.getElementById(
        `totalUnitPrice-${product.id}`
      );
      if (priceForOne) {
        priceForOne.textContent = total.itemTotal[index];
      }
    });
    const totalprice = document.getElementById("total");

    if (totalprice) {
      totalprice.textContent = total.totalPrice;
    }

    return;
  }
  products.forEach((product) => {
    document.getElementById(`quantity-${product.id}`).textContent =
      product.quantity;
  });
  document.getElementById("carritoContenedor").textContent = totalProducts;
});

socket.on("oneProductDeleted", (cart, totalProducts, total) => {
  const Products = cart.products;
  console.log(Products);
  Products.forEach((product) => {
    document.getElementById(`quantity-${product.id}`).textContent =
      product.quantity;
  });
  document.getElementById("carritoContenedor").textContent = totalProducts;
  const totalprice = document.getElementById("total");
  if (totalprice) {
    totalprice.textContent = total.totalPrice;
  }
});

socket.on("ProductDeleted", (productId, totalProducts) => {
  const totalprice = parseFloat(
    document.getElementById("total").textContent.replace(/[^\d.-]/g, "")
  );
  const priceForOne = parseFloat(
    document
      .getElementById(`totalUnitPrice-${productId}`)
      .textContent.replace(/[^\d.-]/g, "")
  );

  const newTotalPrice = totalprice - priceForOne;
  document.getElementById("total").textContent = `$${newTotalPrice.toFixed(2)}`;
  document.getElementById(`product-${productId}`).remove();
  document.getElementById("carritoContenedor").textContent = totalProducts;
});
async function addProductFromFront(productId, cartId, tokenid) {
  return addProduct(productId, cartId, tokenid);
}
async function deleteProductFromFront(productId) {
  return deleteProduct(productId);
}
async function deleteOneProduct(productId, cartId) {
  return deleteProductById(productId, cartId);
}

async function addProduct(productId, cartId, tokenid) {
  try {
    const quantity = 1;
    const newProductId = productId;

    await new Promise((resolve) =>
      socket.emit(
        "addProd",
        { cartId, newProductId, quantity, tokenid },
        resolve
      )
    );
  } catch (error) {
    console.error(error);
  }
}

async function addProductToView(productId, cartId, tokenid) {
  try {
    const quantity = 1;
    const newProductId = productId;
    const page = "detailView";
    await new Promise((resolve) =>
      socket.emit(
        "addProdToView",
        { cartId, newProductId, quantity, tokenid },
        resolve
      )
    );
    alert("Producto agregado correctamente");
  } catch (error) {
    console.error(error);
  }
}

async function deleteProduct(productId, cartId) {
  try {
    const quantity = 1;
    const newProductId = productId;

    await new Promise((resolve) =>
      socket.emit("deleteProd", { cartId, newProductId }, resolve)
    );
  } catch (error) {
    console.error(error);
  }
}

async function deleteProductById(productId, cartId) {
  try {
    const quantity = 1;
    const newProductId = productId;
    await new Promise((resolve) =>
      socket.emit(
        "deleteProductFromView",
        { cartId, newProductId, quantity },
        resolve
      )
    );
    alert("Producto eliminado correctamente");
  } catch (error) {
    console.error(error);
  }
}
