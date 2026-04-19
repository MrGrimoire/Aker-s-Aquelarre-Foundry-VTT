const {
  BooleanField, HTMLField, NumberField, StringField,
} = foundry.data.fields;

/**
 * Data model para Item tipo "arma".
 * Basado en la tabla de armas del manual (Líber 1, Combate).
 */
export class ArmaDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      competencia: new StringField({ initial: "" }),         // Espadas, Cuchillos, Arcos, Pelea, etc.
      caracteristicaBase: new StringField({ initial: "" }),   // FUE, AGI, HAB, PER — para bonificador al daño
      tamano: new StringField({ initial: "medio" }),          // ligero, medio, pesado
      dano: new StringField({ initial: "1d6" }),             // fórmula de dado base
      fuerzaMinima: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      manos: new NumberField({ required: true, integer: true, min: 1, max: 2, initial: 1 }),
      alcance: new StringField({ initial: "" }),             // cuerpo a cuerpo, corto, medio, largo, o FUE×n
      recarga: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),  // asaltos para recargar (proyectiles)
      resistencia: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
      esProyectil: new BooleanField({ initial: false }),     // arco, ballesta, honda
      peso: new NumberField({ required: true, min: 0, initial: 0 }),
      precio: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      descripcion: new HTMLField({ required: true, blank: true }),
    };
  }
}
