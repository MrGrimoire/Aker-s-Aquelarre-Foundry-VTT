const {
  ArrayField, BooleanField, HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "hechizo".
 * Cubre conjuros (magia popular, alquímica, infernal, prohibida)
 * y milagros (rituales de fe).
 * Vis/Ordo 1-7 indica el nivel de poder.
 */
export class HechizoDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // ── Clasificación ──────────────────────────────────────────
      tipo: new StringField({ initial: "conjuro" }),          // conjuro, milagro
      nombreLatin: new StringField({ initial: "" }),          // nombre canónico en latín
      origen: new StringField({ initial: "popular" }),        // popular, alquimico, infernal, prohibido, fe
      naturaleza: new StringField({ initial: "blanca" }),     // blanca, negra

      // ── Nivel y coste ──────────────────────────────────────────
      // Vis (conjuros) u Ordo (milagros): nivel 1-7
      vis: new NumberField({ required: true, integer: true, min: 1, max: 7, initial: 1 }),
      costePC: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // ── Forma/Ceremonia ────────────────────────────────────────
      forma: new StringField({ initial: "invocacion" }),      // invocacion, maleficio, pocion, talisman, unguento

      // ── Temporalidad ───────────────────────────────────────────
      expiracion: new StringField({ initial: "" }),           // duración de preparados (ej: "1 luna")
      duracion: new StringField({ initial: "" }),             // duración del efecto

      // ── Mecánica ───────────────────────────────────────────────
      alcance: new StringField({ initial: "" }),
      resistible: new BooleanField({ initial: false }),

      // ── Componentes ────────────────────────────────────────────
      // Nombres de componentes requeridos (referencia de compendio, sin ID)
      componentesNombres: new ArrayField(new StringField(), { required: false, nullable: false, initial: [] }),
      // Array de IDs de Items tipo "componente" embebidos en el actor
      componenteIds: new ArrayField(new StringField(), { required: false, nullable: false, initial: [] }),

      // ── Texto ──────────────────────────────────────────────────
      preparacion: new HTMLField({ required: true, blank: true }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
