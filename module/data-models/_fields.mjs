const { SchemaField, NumberField } = foundry.data.fields;

/**
 * Crea un SchemaField para una característica de Aquelarre.
 * Cada característica tiene un valor base (3-18) y un modificador temporal.
 * @param {number} initial - Valor inicial por defecto.
 * @returns {SchemaField}
 */
export function caracteristicaField(initial = 10) {
  return new SchemaField({
    value: new NumberField({ required: true, integer: true, min: 1, max: 25, initial }),
    tempMod: new NumberField({ required: true, integer: true, initial: 0 }),
  });
}

/**
 * Crea un SchemaField recurso con value/max.
 * @param {number} initialValue
 * @param {number} initialMax
 * @returns {SchemaField}
 */
export function recursoField(initialValue = 0, initialMax = 0) {
  return new SchemaField({
    value: new NumberField({ required: true, integer: true, initial: initialValue }),
    max: new NumberField({ required: true, integer: true, initial: initialMax }),
  });
}
