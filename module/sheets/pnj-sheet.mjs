/**
 * Ficha de PNJ — extiende ActorSheet (FormApplication legacy, v12).
 */
export class PnjSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["aquelarre", "sheet", "actor", "pnj"],
      template: "systems/akers_aquelarre/templates/actor/pnj-sheet.hbs",
      width: 600,
      height: 500,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "caracteristicas" }],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = this.actor.system;
    context.flags = this.actor.flags;
    context.config = CONFIG.AQUELARRE;
    context.competencias = this.actor.items.filter(i => i.type === "competencia");
    context.armas = this.actor.items.filter(i => i.type === "arma");
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

    html.find(".rollable-comp").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      this.actor.rollCompetencia(itemId);
    });

    html.find(".item-edit").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      this.actor.items.get(itemId)?.sheet.render(true);
    });

    html.find(".item-delete").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      this.actor.items.get(itemId)?.delete();
    });
  }
}
