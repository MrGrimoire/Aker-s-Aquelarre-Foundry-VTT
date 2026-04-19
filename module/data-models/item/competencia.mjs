const {
  BooleanField, HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "competencia" (habilidad percentil).
 * Valor total = característica × multiplicador (según tipo) + bonus.
 * El tipo determina el multiplicador: normal/paterna/secundaria = ×1, primaria2 = ×2, primaria3 = ×3.
 */
export class CompetenciaDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      caracteristica: new StringField({ initial: "" }),      // fue, agi, hab, res, per, com, cul
      tipo: new StringField({ initial: "normal" }),          // normal, paterna, primaria2, primaria3, secundaria
      bonus: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      seccion: new StringField({ initial: "general" }),       // "general" o "arma" - determina la sección
      exitoReciente: new BooleanField({ initial: false }),   // marcado cuando se obtiene éxito/crítico en tirada
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
