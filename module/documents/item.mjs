/**
 * Clase base para todos los Items de Aquelarre.
 * Extiende la clase Item de Foundry v12.
 */
export class AquelarreItem extends Item {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /**
   * Acción principal del item (lanzar hechizo, atacar con arma, etc.)
   * Se invoca desde la ficha del personaje.
   */
  async roll() {
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const label = `[${this.type}] ${this.name}`;

    // Si es arma, tirar daño
    if (this.type === "arma" && this.system.dano) {
      const roll = new Roll(this.system.dano);
      await roll.evaluate({ async: true });
      roll.toMessage({
        speaker,
        flavor: label,
      });
      return roll;
    }

    // Por defecto, mostrar descripción en chat
    ChatMessage.create({
      speaker,
      content: `<h2>${label}</h2>${this.system.descripcion ?? ""}`,
    });
  }
}
