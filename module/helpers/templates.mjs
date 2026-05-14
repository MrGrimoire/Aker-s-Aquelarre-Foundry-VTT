/**
 * Precargar templates de Handlebars para partials y rendimiento.
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
  return loadTemplates([
    // Actor partials
    "systems/akers_aquelarre/templates/actor/parts/actor-caracteristicas.hbs",
    "systems/akers_aquelarre/templates/actor/parts/actor-competencias.hbs",
    "systems/akers_aquelarre/templates/actor/parts/actor-combate.hbs",
    "systems/akers_aquelarre/templates/actor/parts/actor-magia.hbs",
    "systems/akers_aquelarre/templates/actor/parts/actor-equipo.hbs",
    // Item partials
    "systems/akers_aquelarre/templates/item/parts/item-descripcion.hbs",
    // Item sheets (pre-caché)
    "systems/akers_aquelarre/templates/item/componente-sheet.hbs",
    "systems/akers_aquelarre/templates/item/hechizo-sheet.hbs",
  ]);
}
