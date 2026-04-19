const {
  HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "rasgo".
 * Incluye ventajas, desventajas, orgullos y vergüenzas.
 * Los orgullos/vergüenzas cuestan entre 1-3 puntos.
 */
export class RasgoDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      tipo: new StringField({ initial: "ventaja" }),          // ventaja, desventaja, orgullo, verguenza
      coste: new NumberField({ required: true, integer: true, min: 0, max: 3, initial: 0 }),  // puntos (orgullos/vergüenzas)
      efecto: new StringField({ initial: "" }),               // descripción mecánica breve
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
