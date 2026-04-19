import { caracteristicaField, recursoField } from "../_fields.mjs";

const {
  HTMLField, NumberField, SchemaField, StringField,
} = foundry.data.fields;

/**
 * Data model para Actor tipo "pnj" (NPC simplificado).
 */
export class PnjDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      caracteristicas: new SchemaField({
        fue: caracteristicaField(10),
        agi: caracteristicaField(10),
        hab: caracteristicaField(10),
        res: caracteristicaField(10),
        per: caracteristicaField(10),
        com: caracteristicaField(10),
        cul: caracteristicaField(10),
      }),

      derivados: new SchemaField({
        pv: recursoField(10, 10),
        racionalidad: new NumberField({ required: true, integer: true, min: 0, max: 100, initial: 50 }),
        irracionalidad: new NumberField({ required: true, integer: true, min: 0, max: 100, initial: 50 }),
        templanza: new NumberField({ required: true, integer: true, initial: 0 }),
        suerte: recursoField(0, 0),
      }),

      trasfondo: new SchemaField({
        reino: new StringField({ initial: "" }),
        religion: new StringField({ initial: "" }),
        claseSocial: new StringField({ initial: "" }),
        profesion: new StringField({ initial: "" }),
      }),

      iniciativa: new NumberField({ required: true, integer: true, initial: 0 }),

      biografia: new HTMLField({ required: true, blank: true }),
    };
  }

  prepareDerivedData() {
    const car = this.caracteristicas;
    for (const key of Object.keys(car)) {
      car[key].total = car[key].value + car[key].tempMod;
    }
    this.derivados.pv.max = car.res.total;
    if (this.derivados.templanza === 0) {
      this.derivados.templanza = car.per.total * 5;
    }
    this.derivados.suerte.max = car.per.total + car.com.total + car.cul.total;
    this.derivados.pv.value = Math.clamp(
      this.derivados.pv.value, 0, this.derivados.pv.max
    );
    this.derivados.suerte.value = Math.clamp(
      this.derivados.suerte.value, 0, this.derivados.suerte.max
    );
  }
}
