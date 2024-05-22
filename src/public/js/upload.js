document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío predeterminado

    var form = document.getElementById("uploadForm");
    var formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json()) // Convertir la respuesta a JSON
      .then((data) => {
        // Verificar si hay un mensaje de éxito y mostrarlo con Toastify
        if (data.message) {
          Toastify({
            text: data.message,
            duration: 3000, // Duración del mensaje
            close: true, // Mostrar el botón de cerrar
            gravity: "top", // Posición del mensaje
            position: "center", // Centrar el mensaje
            style: {
              background: "green", // Nuevo método para definir el color de fondo
            },
          }).showToast();

          // Limpiar el formulario después de mostrar el mensaje
          form.reset();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Toastify({
          text: "Error al subir el archivo",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          style: {
            background: "red", // Utilizando "style.background"
          },
        }).showToast();
      });
  });
