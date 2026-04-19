const {
  ArrayField, HTMLField, NumberField, SchemaField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "profesion".
 * Cada profesión pertenece a una sociedad y clase social,
 * otorga competencias primarias (×3) y secundarias (×2),
 * y puede tener mínimos de características.
 */
export class ProfesionDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      sociedad: new StringField({ initial: "cristiana" }),   // cristiana, islamica, judia
      claseSocial: new StringField({ initial: "" }),         // baja nobleza, alta nobleza, villano, etc. (cualitativo)
      competenciasPrimarias: new ArrayField(new StringField()),   // 4 competencias — base = caract. × 3
      competenciasSecundarias: new ArrayField(new StringField()), // 8 competencias — base = caract. × 2
      minimosCaracteristicas: new SchemaField({               // requisitos mínimos para ejercer
        fue: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        agi: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        hab: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        res: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        per: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        com: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        cul: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),
      ingresosMensuales: new StringField({ initial: "" }),    // fórmula o texto (ej: "50 maravedíes")
      equipoInicial: new HTMLField({ required: true, blank: true }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
