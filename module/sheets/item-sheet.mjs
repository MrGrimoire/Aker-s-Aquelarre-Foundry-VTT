/**
 * Ficha genérica de Item — extiende ItemSheet (FormApplication legacy, v12).
 * Se usa para todos los tipos de item (arma, armadura, competencia, etc.)
 */
export class AquelarreItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["aquelarre", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "descripcion" }],
    });
  }

  /** @override */
  get template() {
    return `systems/akers_aquelarre/templates/item/${this.item.type}-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();
    const itemData = this.item.toObject(false);
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.AQUELARRE;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;
  }
}
