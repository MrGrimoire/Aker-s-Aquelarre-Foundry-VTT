const {
  HTMLField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "componente".
 * Representa un ingrediente mágico usado en hechizos.
 * Clasificado por procedencia, potencial mágico, naturaleza y origen.
 */
export class ComponenteDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // De dónde procede el componente
      procedencia: new StringField({ initial: "vegetal" }),      // vegetal, mineral, animal, humano, irracional

      // Potencial mágico y disponibilidad
      tipoComponente: new StringField({ initial: "tipo1" }),     // tipo1, tipo2, tipo3

      // Pasos de preparación del componente (rich text)
      preparacion: new HTMLField({ required: true, blank: true }),

      // Alineación mágica
      naturaleza: new StringField({ initial: "blanca" }),        // blanca, negra

      // Tradición mágica de la que forma parte
      origen: new StringField({ initial: "popular" }),           // popular, alquimico, infernal, prohibido

      // Descripción del efecto mágico del componente
      efecto: new StringField({ initial: "" }),

      // Descripción general (para la pestaña descripcion compartida)
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
