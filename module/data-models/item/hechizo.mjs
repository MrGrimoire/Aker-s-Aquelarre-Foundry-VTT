const {
  BooleanField, HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "hechizo".
 * Cubre magia popular, alquímica, infernal, prohibida y rituales de fe.
 * Vis 1-7 → coste en Puntos de Concentración (PC).
 */
export class HechizoDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      nombreLatin: new StringField({ initial: "" }),          // nombre canónico en latín
      origen: new StringField({ initial: "popular" }),        // popular, alquimico, infernal, prohibido, fe
      vis: new NumberField({ required: true, integer: true, min: 1, max: 7, initial: 1 }),
      costePC: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),  // Puntos de Concentración
      forma: new StringField({ initial: "invocacion" }),      // invocacion, maleficio, pocion, talisman, ungüento
      naturaleza: new StringField({ initial: "blanca" }),     // blanca, negra
      componentes: new StringField({ initial: "" }),
      preparacion: new HTMLField({ required: true, blank: true }),  // pasos de preparación (pociones, talismanes, etc.)
      caducidad: new StringField({ initial: "" }),            // duración de preparados (ej: "1 luna")
      duracion: new StringField({ initial: "" }),             // duración del efecto
      alcance: new StringField({ initial: "" }),
      resistible: new BooleanField({ initial: false }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
