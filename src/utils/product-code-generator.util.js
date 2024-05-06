function generarCodigoProducto(titulo) {
  // Convertir todo a mayúsculas
  titulo = titulo.toUpperCase();

  // Inicializar el código
  let codigo = "";

  // Si el título tiene espacios, tomar las primeras letras de cada palabra
  if (titulo.includes(" ")) {
    const palabras = titulo.split(" ");
    palabras.forEach((palabra) => {
      if (palabra !== "") {
        // Ignorar espacios adicionales
        codigo += palabra[0];
      }
    });
  } else {
    // Si no hay espacios, tomar todas las letras
    codigo = titulo;
  }

  // Si el código tiene más de 8 caracteres, tomar solo los primeros 8 caracteres
  if (codigo.length > 8) {
    codigo = codigo.slice(0, 8);
  }

  // Agregar números al código
  const codigoConNumeros = [];
  for (let i = 0; i < codigo.length; i++) {
    const numeroAleatorio = Math.floor(Math.random() * 10);
    codigoConNumeros.push(numeroAleatorio + codigo[i]);
  }

  return codigoConNumeros.join("");
}

export { generarCodigoProducto };
