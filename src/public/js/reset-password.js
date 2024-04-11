document
  .getElementById("resetForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Las claves no coinciden. Por favor, vuelva a ingresarlas.");
      document.getElementById("password").value = "";
      document.getElementById("confirmPassword").value = "";
      document.getElementById("password").focus();
    } else {
      const data = {
        newPassword: password,
        email: email,
      };

      fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ocurrió un error al enviar la solicitud.");
          }
          return response.json();
        })
        .then((responseData) => {
          console.log(responseData);
          Swal.fire({
            icon: "success",
            title: "Clave cambiada con éxito",
            timer: 5000, // 5 segundos
            timerProgressBar: true,
            willClose: () => {
              window.location.href = "/api/login"; // Redirigir al usuario a /api/login
            },
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "Ocurrió un error al actualizar la clave. Por favor, inténtalo nuevamente."
          );
        });
    }
  });
