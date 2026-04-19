import { caracteristicaField, recursoField } from "../_fields.mjs";

const {
  HTMLField, NumberField, SchemaField, StringField, ArrayField,
} = foundry.data.fields;

/**
 * Data model para Actor tipo "criatura" (bestias, demonios, criaturas míticas).
 */
export class CriaturaDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      caracteristicas: new SchemaField({
        fue: caracteristicaField(10),
        agi: caracteristicaField(10),
        hab: caracteristicaField(10),
        res: caracteristicaField(10),
        per: caracteristicaField(10),
        com: caracteristicaField(5),
        cul: caracteristicaField(0),
      }),

      derivados: new SchemaField({
        pv: recursoField(10, 10),
        irr: recursoField(0, 0),
      }),

      // Protección natural (sin armadura equipo)
      proteccion: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // Tipo de criatura
      tipo: new StringField({ initial: "" }),

      // Ataques naturales (se amplía en Fase 2 con Items embebidos)
      ataquesNaturales: new ArrayField(new SchemaField({
        nombre: new StringField({ initial: "" }),
        dano: new StringField({ initial: "1d6" }),
        competencia: new NumberField({ required: true, integer: true, min: 0, max: 150, initial: 50 }),
      })),

      iniciativa: new NumberField({ required: true, integer: true, initial: 0 }),

      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }

  prepareDerivedData() {
    const car = this.caracteristicas;
    for (const key of Object.keys(car)) {
      car[key].total = car[key].value + car[key].tempMod;
    }
    this.derivados.pv.max = car.res.total;
    this.derivados.pv.value = Math.clamp(
      this.derivados.pv.value, 0, this.derivados.pv.max
    );
  }
}
