/**
 * Ficha de Criatura — extiende ActorSheet (FormApplication legacy, v12).
 */
export class CriaturaSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["aquelarre", "sheet", "actor", "criatura"],
      template: "systems/akers_aquelarre/templates/actor/criatura-sheet.hbs",
      width: 600,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "caracteristicas" }],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = this.actor.system;
    context.flags = this.actor.flags;
    context.config = CONFIG.AQUELARRE;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".rollable-car").click(ev => {
      const key = ev.currentTarget.dataset.car;
      this.actor.rollCaracteristica(key);
    });
  }
}
