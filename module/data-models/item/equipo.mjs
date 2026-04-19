const {
  HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "equipo" (objetos genéricos).
 */
export class EquipoDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      cantidad: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
      peso: new NumberField({ required: true, min: 0, initial: 0 }),
      precio: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
