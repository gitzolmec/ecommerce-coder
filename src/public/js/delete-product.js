const socket = io("http://localhost:8080");

function deleteProduct(productId) {
  const socket = io("http://localhost:8080");
  socket.emit("deleteProduct", { productId });
}

// Manejar la señal de actualización del producto eliminado

document.addEventListener("DOMContentLoaded", function () {
  socket.on("updateProductByOwner", (productId) => {
    // Aquí puedes actualizar la interfaz de usuario para reflejar la eliminación del producto

    document.getElementById(`product-${productId}`).remove();
  });
});
