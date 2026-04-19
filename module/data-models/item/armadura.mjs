const {
  BooleanField, HTMLField, NumberField, SchemaField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "armadura".
 * El manual usa un valor de protección único + localizaciones cubiertas.
 * Tipos: blanda, ligera, metálica, completa, casco, animal.
 */
export class ArmaduraDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      tipoArmadura: new StringField({ initial: "blanda" }),  // blanda, ligera, metalica, completa, casco, animal
      proteccion: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      localizaciones: new SchemaField({                       // qué zonas cubre
        cabeza: new BooleanField({ initial: false }),
        torso: new BooleanField({ initial: false }),
        brazos: new BooleanField({ initial: false }),
        piernas: new BooleanField({ initial: false }),
      }),
      resistencia: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
      resistenciaMax: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
      fuerzaMinima: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      penalizacion: new SchemaField({
        competencias: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),  // penalización a competencias físicas
        percepcion: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),
      peso: new NumberField({ required: true, min: 0, initial: 0 }),
      precio: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      equipada: new BooleanField({ initial: false }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
