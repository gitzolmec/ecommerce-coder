const Handlebars = require("handlebars");

// Helper 'and' para Handlebars
Handlebars.registerHelper("and", function () {
  const args = Array.prototype.slice.call(arguments);
  const options = args.pop();

  for (let i = 0; i < args.length; i++) {
    if (!args[i]) {
      return false;
    }
  }

  return true;
});

// Helper 'or' para Handlebars
Handlebars.registerHelper("or", function () {
  const args = Array.prototype.slice.call(arguments);
  const options = args.pop();

  for (let i = 0; i < args.length; i++) {
    if (args[i]) {
      return true;
    }
  }

  return false;
});

// Helper para comprobar igualdad
Handlebars.registerHelper("isEqual", function (value, compareTo, options) {
  return value === compareTo ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("isEqualOr", function () {
  const args = Array.prototype.slice.call(arguments, 0, -1); // omitimos el último argumento (options)
  const options = arguments[arguments.length - 1]; // último argumento es options

  const value = args.shift(); // el primer argumento es el valor que queremos verificar

  for (let i = 0; i < args.length; i++) {
    if (value === args[i]) {
      return options.fn(this);
    }
  }

  return options.inverse(this);
});

module.exports = {
  registerHandlebarsHelpers: function () {},
};
