import { caracteristicaField, recursoField } from "../_fields.mjs";

const {
  HTMLField, NumberField, SchemaField, StringField,
} = foundry.data.fields;

/**
 * Data model para Actor tipo "personaje" (PC).
 * Contiene todas las características, derivados, trasfondo y economía.
 */
export class PersonajeDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // === CARACTERÍSTICAS PRIMARIAS (7) ===
      caracteristicas: new SchemaField({
        fue: caracteristicaField(10),
        agi: caracteristicaField(10),
        hab: caracteristicaField(10),
        res: caracteristicaField(10),
        per: caracteristicaField(10),
        com: caracteristicaField(10),
        cul: caracteristicaField(10),
      }),

      // === CARACTERÍSTICA SECUNDARIA ===
      aspecto: caracteristicaField(15),           // Aspecto (base 15), secundaria

      // === ATRIBUTOS DERIVADOS ===
      derivados: new SchemaField({
        pv: recursoField(10, 10),                // PV = RES (calculado)
        racionalidad: new NumberField({ required: true, integer: true, min: -100, max: 100, initial: 50 }),
        irracionalidad: new NumberField({ required: true, integer: true, min: 0, max: 200, initial: 50 }),
        templanza: new NumberField({ required: true, integer: true, initial: 50 }),  // valor editable
        suerte: recursoField(0, 0),              // max = PER+COM+CUL, value = actual (se resta)
        pf: recursoField(0, 0),                  // Puntos de Fe = ceil(RAC×0.2)
        pc: recursoField(0, 0),                  // Puntos de Concentración = ceil(IRR×0.2)
      }),

      // === TRASFONDO ===
      trasfondo: new SchemaField({
        reino: new StringField({ initial: "" }),
        religion: new StringField({ initial: "" }),
        claseSocial: new StringField({ initial: "" }),
        profesion: new StringField({ initial: "" }),
        puntosAprendizaje: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        edad: new NumberField({ required: true, integer: true, min: 0, initial: 20 }),
        sexo: new StringField({ initial: "" }),
        pueblo: new StringField({ initial: "" }),
        nombre: new StringField({ initial: "" }),
      }),

      // === ECONOMÍA ===
      economia: new SchemaField({
        maravedies: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      }),

      // === HERIDAS POR LOCALIZACIÓN ===
      heridas: new SchemaField({
        cabeza: recursoField(0, 0),
        torso: recursoField(0, 0),
        brazoDer: recursoField(0, 0),
        brazoIzq: recursoField(0, 0),
        piernaDer: recursoField(0, 0),
        piernaIzq: recursoField(0, 0),
      }),

      // === COMBATE ===
      iniciativa: new NumberField({ required: true, integer: true, initial: 0 }),

      // === BIOGRAFÍA ===
      biografia: new HTMLField({ required: true, blank: true }),
    };
  }

  /**
   * Calcula atributos derivados.
   * PV = RES, Templanza = PER × 3, Suerte max = PER+COM+CUL.
   */
  prepareDerivedData() {
    const car = this.caracteristicas;

    // Valores efectivos (base + mod temporal)
    for (const key of Object.keys(car)) {
      car[key].total = car[key].value + car[key].tempMod;
    }

    // PV máximos = RES
    this.derivados.pv.max = car.res.total;

    // Suerte máxima = PER + COM + CUL
    this.derivados.suerte.max = car.per.total + car.com.total + car.cul.total;

    // Aspecto total
    this.aspecto.total = this.aspecto.value + this.aspecto.tempMod;

    // PF max = ceil(RAC × 0.20)   — mínimo 0 cuando RAC es negativo
    this.derivados.pf.max = Math.max(0, Math.ceil(this.derivados.racionalidad * 0.2));
    // PC max = ceil(IRR × 0.20)
    this.derivados.pc.max = Math.max(0, Math.ceil(this.derivados.irracionalidad * 0.2));

    // Clamping PV: permite bajar hasta -max (muerte)
    this.derivados.pv.value = Math.clamp(
      this.derivados.pv.value, -this.derivados.pv.max, this.derivados.pv.max
    );
    this.derivados.suerte.value = Math.clamp(
      this.derivados.suerte.value, 0, this.derivados.suerte.max
    );
    this.derivados.pf.value = Math.clamp(
      this.derivados.pf.value, 0, this.derivados.pf.max
    );
    this.derivados.pc.value = Math.clamp(
      this.derivados.pc.value, 0, this.derivados.pc.max
    );
  }
}
