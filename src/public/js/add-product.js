const formProduct = document.getElementById("formProduct");

formProduct.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = new FormData(formProduct);

  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  obj.thumbnail = "/img/" + obj.thumbnail;

  const fetchParams = {
    url: "/api/products/addProducts",
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  };

  fetch(fetchParams.url, {
    method: fetchParams.method,
    headers: fetchParams.headers,
    body: fetchParams.body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un problema al enviar los datos.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Los datos fueron enviados correctamente:", data);
    })
    .catch((error) => {
      console.error("Error al enviar los datos:", error);
    });
});
