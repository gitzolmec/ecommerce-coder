# 8bits

## Descripción

**8bits** es un ecommerce de venta de videojuegos que incluye funcionalidades como un carrito de compra personalizado y login de usuario. Los usuarios pueden registrarse, iniciar sesión con una cuenta de GitHub, restablecer su contraseña, y realizar compras. Además, los usuarios tienen la opción de cambiar a un rol de premium adjuntando la documentación solicitada.

## Características principales

- **Login de usuarios** con formulario de registro o cuenta de GitHub.
- **Opción de reset de clave** para usuarios que olviden su contraseña.
- **Compras de videojuegos** con carritos personalizados por usuario.
- **Cambio de rol a premium** mediante la presentación de comprobante de identificación, estado de cuenta y comprobante de domicilio.
- **Notificaciones por email** con la información de la compra realizada.

## Demo

Puedes ver el proyecto en vivo desplegado en Railway [Link](https://ecommerce-coder-production-491e.up.railway.app/api/login).

## Requisitos previos

- Node.js versión 14 o superior.
- npm versión 6 o superior.

## Instrucciones de instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/gitzolmec/ecommerce-coder.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd ecommerce-coder
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Instrucciones de uso

1. Inicia el servidor:
   ```bash
   npm run start:prod
   ```
2. Abre tu navegador y navega a `http://localhost:8080/api/login`.

## Contacto

Para preguntas, sugerencias o comentarios, puedes contactarnos a través de:

- Correo electrónico: jorgemorales.600@gmail.com

## Navegando por el proyecto

### Login de usuario

![Login de usuario](https://imgur.com/oaTzkml.jpeg)

En esta pantalla se realiza el login de usuario, puedes hacer un registro con tus datos o con github

### Registro

![Página de registro](https://imgur.com/CyHqvSC.jpeg)

### Página principal

![Página principal](https://imgur.com/wm9Dty0.jpeg)

Esta es la pantalla principal con el catalogo de video juegos disponibles, si se preciona la foto de algun producto se redirige a la pantalla del detalle de cada producto donde podra agregarlo al carrito.

### Detalle de producto

![Detalle del producto](https://imgur.com/865WHu0.jpeg)

### Carrito de compra

![Carrito de compra](https://imgur.com/rhplQBG.jpeg)

### Compra exitosa

![Compra exitosa](https://imgur.com/IgRINHd.jpeg)

El mensaje en la imagen aparecera al realizar una compra exitosa.
