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

    // Para hechizos: inyectar la lista de componentes del actor y los asignados
    if (this.item.type === "hechizo") {
      const actor = this.item.actor;
      if (actor) {
        context.actorComponentes = actor.items
          .filter(i => i.type === "componente")
          .map(c => c.toObject(false));
        context.componentesData = (this.item.system.componenteIds ?? [])
          .map(id => actor.items.get(id))
          .filter(Boolean)
          .map(c => c.toObject(false));
      } else {
        context.actorComponentes = [];
        context.componentesData = [];
      }
    }

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // ── Hechizo: quitar componente desde la pestaña ─────────────
    html.find(".hechizo-remove-comp").click(async ev => {
      const compId = ev.currentTarget.dataset.compId;
      const current = this.item.system.componenteIds ?? [];
      await this.item.update({ "system.componenteIds": current.filter(id => id !== compId) });
    });

    // ── Hechizo: añadir componente desde el select ───────────────
    html.find(".hechizo-add-comp-btn").click(async () => {
      const compId = html.find("#hechizo-add-comp-select").val();
      if (!compId) return;
      const current = this.item.system.componenteIds ?? [];
      if (!current.includes(compId)) {
        await this.item.update({ "system.componenteIds": [...current, compId] });
      }
    });
  }
}
