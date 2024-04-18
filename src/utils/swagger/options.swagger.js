const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "8-bits",
      version: "1.0.0",
      description: "8-bits API",
    },
  },
  apis: [process.cwd() + "/src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;
