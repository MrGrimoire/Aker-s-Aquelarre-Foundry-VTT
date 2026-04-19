/**
 * Clase base para todos los Actores de Aquelarre.
 * Extiende la clase Actor de Foundry v12.
 */
export class AquelarreActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /* ----------------------------------------------------------------
   *  HELPER — Evaluar resultado de 1d100 según reglas Aquelarre
   *  Crítico ≤ ceil(obj/10)  |  Pifia ≥ 90+ceil(obj/10)
   *  1–5 siempre éxito  |  96–100 siempre fallo
   *  EXCEPCIONES: 1 siempre crítico | 100 siempre pifia
   * ---------------------------------------------------------------- */
  _evaluarTirada(tirada, objetivo) {
    const critUmbral = Math.ceil(objetivo / 10);
    const pifiaUmbral = 90 + critUmbral;

    // Excepciones especiales: 1 siempre es crítico, 100 siempre es pifia
    if (tirada === 1) {
      return { exito: true, critico: true, pifia: false, critUmbral, pifiaUmbral };
    }
    if (tirada === 100) {
      return { exito: false, critico: false, pifia: true, critUmbral, pifiaUmbral };
    }

    const pifia = tirada >= pifiaUmbral;
    const critico = !pifia && tirada <= critUmbral;

    let exito;
    if (pifia) exito = false;
    else if (critico) exito = true;
    else if (tirada >= 96) exito = false;
    else if (tirada <= 5) exito = true;
    else exito = tirada <= objetivo;

    return { exito, critico, pifia, critUmbral, pifiaUmbral };
  }

  /* ----------------------------------------------------------------
   *  HELPER — HTML de resultado para chat
   * ---------------------------------------------------------------- */
  _resultadoHTML(ev) {
    if (ev.pifia) return '<span style="color:#c00;font-weight:bold;">✗ ¡Pifia!</span>';
    if (ev.critico) return '<span style="color:#0a0;font-weight:bold;">★ ¡Crítico!</span>';
    if (ev.exito) return '<span style="color:#080;font-weight:bold;">✓ Éxito</span>';
    return '<span style="color:#a00;">✗ Fallo</span>';
  }

  /* ----------------------------------------------------------------
   *  HELPER — Computar valor total de una competencia
   * ---------------------------------------------------------------- */
  computarValorCompetencia(item) {
    let carTotal = 0;
    if (item.system.caracteristica === "asp") {
      // Aspecto es característica secundaria, no está en caracteristicas{}
      const asp = this.system.aspecto;
      carTotal = asp?.total ?? asp?.value ?? 0;
    } else {
      const car = this.system.caracteristicas?.[item.system.caracteristica];
      carTotal = car?.total ?? car?.value ?? 0;
    }
    const esPrimaria = item.system.tipo?.startsWith("primaria");
    const mult = esPrimaria ? parseInt(item.system.tipo?.slice(-1)) || 1 : 1;
    return carTotal * mult + (item.system.bonus || 0);
  }

  /* ----------------------------------------------------------------
   *  Tirada de Característica (multiplicador + suerte)
   * ---------------------------------------------------------------- */
  async rollCaracteristica(key) {
    // Soportar aspecto (característica secundaria, fuera de caracteristicas{})
    let car;
    if (key === "asp") {
      car = this.system.aspecto;
    } else {
      car = this.system.caracteristicas?.[key];
    }
    if (!car) return;

    const total = car.total ?? car.value;
    const label = CONFIG.AQUELARRE.caracteristicas[key] ?? key.toUpperCase();
    const suerteActual = this.system.derivados?.suerte?.value ?? 0;

    const opciones = await new Promise((resolve) => {
      new Dialog({
        title: `Tirada de ${label}`,
        content: `
          <form>
            <div class="form-group">
              <label>Modificador (multiplicador)</label>
              <input type="number" name="mod" value="1" min="1" step="1" autofocus />
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" name="suerte" />
                ¿Tirar con Suerte? <span style="font-size:0.85em;color:#666;">(actual: ${suerteActual})</span>
              </label>
            </div>
            <p style="margin-top:4px;font-size:0.85em;color:#666;">
              Objetivo = ${total} × multiplicador
            </p>
          </form>`,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: "Lanzar",
            callback: (html) => resolve({
              mod: parseInt(html.find('[name="mod"]').val()) || 1,
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

    const objetivo = total * opciones.mod;
    const modTxt = opciones.mod !== 1 ? ` ×${opciones.mod}` : "";

    const roll = new Roll("1d100");
    await roll.evaluate({ async: true });

    const evaluacion = this._evaluarTirada(roll.total, objetivo);
    const suerteRes = await this._aplicarSuerte(roll.total, objetivo, opciones.usarSuerte, evaluacion);
    const evalFinal = { ...evaluacion, exito: suerteRes.exito };

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${label}${modTxt}</strong> — objetivo ≤ ${objetivo} <span style="font-size:0.8em;color:#666;">(crítico ≤${evaluacion.critUmbral} | pifia ≥${evaluacion.pifiaUmbral})</span>`,
      content: `<div class="aquelarre-roll">${roll.total} → ${this._resultadoHTML(evalFinal)}${suerteRes.texto}</div>`,
    });

    return { roll, exito: suerteRes.exito, critico: evaluacion.critico, pifia: evaluacion.pifia };
  }

  /* ----------------------------------------------------------------
   *  Tirada de Competencia (dificultad + suerte)
   * ---------------------------------------------------------------- */
  async rollCompetencia(itemId) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "competencia") return;

    const valorBase = this.computarValorCompetencia(item);
    const suerteActual = this.system.derivados?.suerte?.value ?? 0;

    const opciones = await new Promise((resolve) => {
      new Dialog({
        title: `Tirada de ${item.name}`,
        content: `
          <form>
            <div class="form-group">
              <label>Dificultad</label>
              <select name="dificultad">
                <option value="75">Infalible (+75%)</option>
                <option value="50">Muy fácil (+50%)</option>
                <option value="25">Fácil (+25%)</option>
                <option value="0" selected>Normal (+0%)</option>
                <option value="-25">Difícil (−25%)</option>
                <option value="-50">Muy difícil (−50%)</option>
                <option value="-75">Imposible (−75%)</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" name="suerte" />
                ¿Tirar con Suerte? <span style="font-size:0.85em;color:#666;">(actual: ${suerteActual})</span>
              </label>
            </div>
            <p style="margin-top:4px;font-size:0.85em;color:#666;">
              Valor base: ${valorBase}% — Objetivo = valor × (1 + dificultad%)
            </p>
          </form>`,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: "Lanzar",
            callback: (html) => resolve({
              dificultad: parseInt(html.find('[name="dificultad"]').val()) || 0,
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

    // Dificultad como suma/resta directa al valor de la competencia
    const objetivo = valorBase + opciones.dificultad;
    const difTxt = opciones.dificultad !== 0
      ? ` [${opciones.dificultad > 0 ? "+" : ""}${opciones.dificultad}% → ${objetivo}]`
      : "";

    const roll = new Roll("1d100");
    await roll.evaluate({ async: true });

    const evaluacion = this._evaluarTirada(roll.total, objetivo);
    const suerteRes = await this._aplicarSuerte(roll.total, objetivo, opciones.usarSuerte, evaluacion);
    const evalFinal = { ...evaluacion, exito: suerteRes.exito };

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${item.name}</strong> (${valorBase}%)${difTxt} — objetivo ≤ ${objetivo} <span style="font-size:0.8em;color:#666;">(crítico ≤${evaluacion.critUmbral} | pifia ≥${evaluacion.pifiaUmbral})</span>`,
      content: `<div class="aquelarre-roll">${roll.total} → ${this._resultadoHTML(evalFinal)}${suerteRes.texto}</div>`,
    });

    // Marcar checkbox de éxito si la tirada fue exitosa o crítica
    if (evalFinal.exito || evaluacion.critico) {
      await item.update({ "system.exitoReciente": true });
    }

    return { roll, exito: suerteRes.exito, critico: evaluacion.critico, pifia: evaluacion.pifia };
  }

  /* ----------------------------------------------------------------
   *  Suerte — modifica resultado si el jugador elige tirar con suerte
   *  No aplica en pifia ni fallo absoluto (96–100).
   * ---------------------------------------------------------------- */
  async _aplicarSuerte(tirada, objetivo, usarSuerte, evaluacion) {
    if (!usarSuerte) {
      return { exito: evaluacion.exito, texto: "" };
    }

    if (evaluacion.pifia || tirada >= 96) {
      return {
        exito: false,
        texto: '<br><span style="color:#888;">🍀 Suerte no aplica (pifia/fallo absoluto)</span>',
      };
    }

    const suerteActual = this.system.derivados?.suerte?.value ?? 0;
    let gastoSuerte = 0;
    let exito = evaluacion.exito;
    let detalle = "";

    if (evaluacion.exito) {
      gastoSuerte = 1;
      detalle = `<br><span style="color:#b8860b;">🍀 Suerte: −1 (éxito natural) → ${Math.max(0, suerteActual - 1)}</span>`;
    } else {
      const diferencia = tirada - objetivo;
      if (suerteActual >= diferencia) {
        gastoSuerte = diferencia;
        exito = true;
        detalle = `<br><span style="color:#b8860b;">🍀 Suerte: −${diferencia} (cubrir fallo) → ${suerteActual - diferencia}</span>`;
      } else {
        gastoSuerte = suerteActual;
        exito = false;
        detalle = `<br><span style="color:#c00;">🍀 Suerte: −${suerteActual} (insuficiente, necesitaba ${diferencia}) → 0</span>`;
      }
    }

    if (gastoSuerte > 0) {
      const nuevaSuerte = Math.max(0, suerteActual - gastoSuerte);
      await this.update({ "system.derivados.suerte.value": nuevaSuerte });
    }

    return { exito, texto: detalle };
  }

  /* ----------------------------------------------------------------
   *  Daño
   * ---------------------------------------------------------------- */
  applyDamage(amount, localizacion, proteccion = 0) {
    const neto = Math.max(0, amount - proteccion);
    if (neto === 0) return;
    const pv = foundry.utils.deepClone(this.system.derivados.pv);
    // Permitir daño hasta -max (muerte)
    pv.value = Math.max(-pv.max, pv.value - neto);
    const updateData = { "system.derivados.pv.value": pv.value };

    const heridas = this.system.heridas;
    if (heridas && heridas[localizacion] !== undefined) {
      updateData[`system.heridas.${localizacion}`] = heridas[localizacion] + neto;
    }
    return this.update(updateData);
  }

  /* ----------------------------------------------------------------
   *  Calcular condición del personaje basada en PV
   * ---------------------------------------------------------------- */
  getCondicion() {
    const pv = this.system.derivados?.pv;
    if (!pv) return "—";

    const pvMax = pv.max;
    const pvActual = pv.value;

    // Rango 1: MUERTO (vida exactamente -max)
    if (pvActual <= -pvMax) return "MUERTO";

    // Rango 2: INCONSCIENTE (desde >-max hasta 0, incluido 0)
    if (pvActual <= 0) return "INCONSCIENTE";

    // Rango 3: MALHERIDO (desde 1 hasta cuarto de vida max)
    const cuarto = Math.floor(pvMax / 4);
    if (pvActual <= cuarto) return "MALHERIDO";

    // Rango 4: HERIDO (desde >cuarto hasta mitad de vida max)
    const mitad = Math.floor(pvMax / 2);
    if (pvActual <= mitad) return "HERIDO";

    // Rango 5: SANO (desde >mitad hasta vida max)
    return "SANO";
  }

  /* ----------------------------------------------------------------
   *  Tirada de Derivado (d100 vs valor)
   * ---------------------------------------------------------------- */
  async rollDerivado(key) {
    const nombres = {
      racionalidad: "Racionalidad",
      irracionalidad: "Irracionalidad",
      templanza: "Templanza",
      suerte: "Suerte",
    };
    const label = nombres[key] ?? key;

    let objetivo;
    if (key === "suerte") {
      objetivo = this.system.derivados.suerte.max;
    } else {
      objetivo = this.system.derivados[key];
    }
    if (objetivo === undefined || objetivo === null) return;

    const roll = new Roll("1d100");
    await roll.evaluate({ async: true });

    const evaluacion = this._evaluarTirada(roll.total, objetivo);

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${label}</strong> — objetivo ≤ ${objetivo} <span style="font-size:0.8em;color:#666;">(crítico ≤${evaluacion.critUmbral} | pifia ≥${evaluacion.pifiaUmbral})</span>`,
      content: `<div class="aquelarre-roll">${roll.total} → ${this._resultadoHTML(evaluacion)}</div>`,
    });

    return { roll, exito: evaluacion.exito, critico: evaluacion.critico, pifia: evaluacion.pifia };
  }

  /* ----------------------------------------------------------------
   *  Tirada de Iniciativa (1d10 + AGI + mod)
   * ---------------------------------------------------------------- */
  async rollIniciativa() {
    const agi = this.system.caracteristicas?.agi;
    if (!agi) return;
    const agiTotal = agi.total ?? agi.value;

    const modificador = await new Promise((resolve) => {
      new Dialog({
        title: "Tirada de Iniciativa",
        content: `
          <form>
            <div class="form-group">
              <label>Modificador adicional</label>
              <input type="number" name="mod" value="0" step="1" autofocus />
            </div>
            <p style="margin-top:4px;font-size:0.85em;color:#666;">
              Fórmula: 1d10 + AGI (${agiTotal}) + modificador
            </p>
          </form>`,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: "Lanzar",
            callback: (html) => resolve(parseInt(html.find('[name="mod"]').val()) || 0),
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

    if (modificador === null) return;

    const formula = `1d10 + ${agiTotal} + ${modificador}`;
    const roll = new Roll(formula);
    await roll.evaluate({ async: true });

    const modTxt = modificador !== 0 ? ` + mod(${modificador})` : "";

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>Iniciativa</strong> — 1d10 + AGI(${agiTotal})${modTxt}`,
      content: `<div class="aquelarre-roll">Resultado: <strong>${roll.total}</strong></div>`,
    });

    await this.update({ "system.iniciativa": roll.total });
    return { roll, total: roll.total };
  }

  /* ----------------------------------------------------------------
   *  Crear competencias por defecto del manual
   * ---------------------------------------------------------------- */
  async crearCompetenciasDefecto() {
    const existentes = new Set(
      this.items.filter(i => i.type === "competencia").map(i => i.name)
    );
    const nuevas = CONFIG.AQUELARRE.competenciasDefecto
      .filter(c => !existentes.has(c.name))
      .map(c => ({
        name: c.name,
        type: "competencia",
        system: {
          caracteristica: c.caracteristica,
          tipo: "normal",
          bonus: 0,
          seccion: c.tipoArma ? "arma" : "general",
        },
      }));

    if (nuevas.length === 0) {
      ui.notifications.info("Todas las competencias por defecto ya existen.");
      return;
    }

    await this.createEmbeddedDocuments("Item", nuevas);
    ui.notifications.info(`Se crearon ${nuevas.length} competencias.`);
  }
}
