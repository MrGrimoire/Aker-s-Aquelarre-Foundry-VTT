/**
 * Registrar helpers de Handlebars custom para Aquelarre.
 */
export function registerHandlebarsHelpers() {

  /**
   * Multiplicar dos valores.
   * Uso: {{multiply a b}}
   */
  Handlebars.registerHelper("multiply", function (a, b) {
    return Number(a) * Number(b);
  });

  /**
   * Dividir y redondear hacia arriba.
   * Uso: {{divCeil a b}}
   */
  Handlebars.registerHelper("divCeil", function (a, b) {
    return Math.ceil(Number(a) / Number(b));
  });

  /**
   * Comprobar igualdad.
   * Uso: {{#ifEquals a b}}...{{/ifEquals}}
   */
  Handlebars.registerHelper("ifEquals", function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  /**
   * Concatenar strings.
   * Uso: {{concat a b c}}
   */
  Handlebars.registerHelper("concat", function (...args) {
    args.pop(); // Remove Handlebars options object
    return args.join("");
  });

  /**
   * Formatear porcentaje.
   * Uso: {{pct value}} → "65%"
   */
  Handlebars.registerHelper("pct", function (value) {
    return `${value}%`;
  });
}
