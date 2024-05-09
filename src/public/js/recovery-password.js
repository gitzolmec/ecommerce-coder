document
  .getElementById("recuperarContraseñaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener el valor del input email
    const email = document.getElementById("email").value;

    // Crear un objeto con los datos a enviar
    const data = {
      email,
    };

    // Realizar la petición POST utilizando Fetch API
    fetch("/api/passwordrecovery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hubo un problema al enviar la solicitud.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Solicitud enviada con éxito");
        // Aquí puedes manejar la respuesta del servidor si es necesario
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        // Aquí puedes manejar los errores, por ejemplo, mostrar un mensaje al usuario
      });
  });
