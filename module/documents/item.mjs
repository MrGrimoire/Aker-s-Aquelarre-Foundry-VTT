/**
 * Clase base para todos los Items de Aquelarre.
 * Extiende la clase Item de Foundry v12.
 */

/* ----------------------------------------------------------------
 *  TABLA DE COSTE Y PENALIZACIÓN POR VIS / ORDO
 *  Manual oficial — pág. 161 (Ars Magica) / pág. 246 (Ars Theologica)
 * ---------------------------------------------------------------- */
const VIS_TABLE = {
  1: { coste: 1,  penal:    0, label: "Prima"    },
  2: { coste: 1,  penal:    0, label: "Secunda"  },
  3: { coste: 2,  penal:  -15, label: "Tertia"   },
  4: { coste: 3,  penal:  -35, label: "Quarta"   },
  5: { coste: 5,  penal:  -50, label: "Quinta"   },
  6: { coste: 5,  penal:  -75, label: "Sexta"    },
  7: { coste: 10, penal: -100, label: "Septima"  },
};

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

    // Si es hechizo (conjuro o milagro), lanzar con tirada de activación
    if (this.type === "hechizo") {
      return this._lanzarHechizo();
    }

    // Por defecto, mostrar descripción en chat
    ChatMessage.create({
      speaker,
      content: `<h2>${label}</h2>${this.system.descripcion ?? ""}`,
    });
  }

  /* ----------------------------------------------------------------
   *  Lanzamiento de hechizo (conjuro o milagro)
   *  - Resta el coste en PC según el Vis/Ordo
   *  - Hace tirada de activación con penalizador
   *    · Conjuros → contra Irracionalidad
   *    · Milagros → contra Racionalidad
   * ---------------------------------------------------------------- */
  async _lanzarHechizo() {
    const actor = this.actor;
    if (!actor) {
      ui.notifications?.warn("El hechizo debe estar en la ficha de un personaje.");
      return;
    }

    const sys = this.system;
    const esMilagro = sys.tipo === "milagro";
    const vis = Math.clamp(parseInt(sys.vis) || 1, 1, 7);
    const tabla = VIS_TABLE[vis];

    // Atributo base para la tirada
    const attrKey = esMilagro ? "racionalidad" : "irracionalidad";
    const attrLabel = esMilagro ? "Racionalidad" : "Irracionalidad";
    const attrValor = actor.system.derivados?.[attrKey] ?? 0;

    // PC actual
    const pcActual = actor.system.derivados?.pc?.value ?? 0;
    const pcMax    = actor.system.derivados?.pc?.max ?? 0;

    const ordoLabel = esMilagro
      ? `Ordo ${vis} (${tabla.label})`
      : `Vis ${tabla.label}`;
    const tipoLabel = esMilagro ? "Milagro" : "Conjuro";

    // ── Diálogo de confirmación ────────────────────────────────
    const opciones = await new Promise((resolve) => {
      new Dialog({
        title: `Lanzar ${tipoLabel}: ${this.name}`,
        content: `
          <form>
            <p style="margin:0 0 6px 0;">
              <strong>${this.name}</strong> — ${ordoLabel}<br>
              <span style="font-size:0.9em;color:#666;">
                Coste: <strong>${tabla.coste} PC</strong> · Penalizador de activación: <strong>${tabla.penal}%</strong>
              </span>
            </p>
            <p style="margin:0 0 8px 0;font-size:0.9em;">
              Tirada contra <strong>${attrLabel}</strong> (${attrValor}%) → objetivo ≤ ${Math.max(0, attrValor + tabla.penal)}<br>
              PC actuales: <strong>${pcActual}</strong> / ${pcMax}
            </p>
            <div class="form-group">
              <label>Modificador adicional (%)</label>
              <input type="number" name="mod" value="0" step="5" autofocus />
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" name="suerte" />
                ¿Tirar con Suerte? <span style="font-size:0.85em;color:#666;">(actual: ${actor.system.derivados?.suerte?.value ?? 0})</span>
              </label>
            </div>
            ${pcActual < tabla.coste
              ? `<p style="color:#c00;font-weight:bold;margin:6px 0 0 0;">⚠ PC insuficientes (necesitas ${tabla.coste}).</p>`
              : ""}
          </form>`,
        buttons: {
          roll: {
            icon: '<i class="fas fa-magic"></i>',
            label: "Lanzar",
            callback: (html) => resolve({
              mod: parseInt(html.find('[name="mod"]').val()) || 0,
              usarSuerte: html.find('[name="suerte"]').is(":checked"),
            }),
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar",
            callback: () => resolve(null),
          },
        },
        default: "roll",
        close: () => resolve(null),
      }).render(true);
    });

    if (!opciones) return;

    if (pcActual < tabla.coste) {
      ui.notifications?.warn(`PC insuficientes para lanzar «${this.name}» (necesitas ${tabla.coste}, tienes ${pcActual}).`);
      return;
    }

    // ── Restar PC ───────────────────────────────────────────────
    await actor.update({ "system.derivados.pc.value": pcActual - tabla.coste });

    // ── Tirada de activación ───────────────────────────────────
    const objetivo = Math.max(0, attrValor + tabla.penal + opciones.mod);

    const roll = new Roll("1d100");
    await roll.evaluate({ async: true });

    const evaluacion = actor._evaluarTirada(roll.total, objetivo);
    const suerteRes = await actor._aplicarSuerte(roll.total, objetivo, opciones.usarSuerte, evaluacion);
    const evalFinal = { ...evaluacion, exito: suerteRes.exito };

    const modTxt = opciones.mod !== 0 ? ` ${opciones.mod >= 0 ? "+" : ""}${opciones.mod}%` : "";
    const flavor = `<strong>${this.name}</strong> · ${tipoLabel} ${ordoLabel}<br>
      <span style="font-size:0.85em;color:#666;">
        ${attrLabel} ${attrValor}% ${tabla.penal}%${modTxt} → objetivo ≤ ${objetivo}
        (crítico ≤${evaluacion.critUmbral} | pifia ≥${evaluacion.pifiaUmbral})<br>
        Coste: −${tabla.coste} PC → ${pcActual - tabla.coste}/${pcMax}
      </span>`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor,
      content: `<div class="aquelarre-roll">${roll.total} → ${actor._resultadoHTML(evalFinal)}${suerteRes.texto}</div>`,
    });

    return { roll, exito: suerteRes.exito, critico: evaluacion.critico, pifia: evaluacion.pifia };
  }
}
