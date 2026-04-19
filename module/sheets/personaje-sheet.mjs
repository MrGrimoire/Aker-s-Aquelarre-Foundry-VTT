/**
 * Ficha de Personaje Jugador — extiende ActorSheet (FormApplication legacy, v12).
 */
export class PersonajeSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["aquelarre", "sheet", "actor", "personaje"],
      template: "systems/akers_aquelarre/templates/actor/personaje-sheet.hbs",
      width: 720,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "caracteristicas" }],
    });
  }

  /** @override */
  getData() {
    const context = super.getData();
    context.system = this.actor.system;
    context.flags = this.actor.flags;
    context.config = CONFIG.AQUELARRE;
    context.condicion = this.actor.getCondicion();
    context.isGM = game.user.isGM;

    // Preparar items por tipo
    context.armas = this.actor.items.filter(i => i.type === "arma");
    context.armaduras = this.actor.items.filter(i => i.type === "armadura");
    context.hechizos = this.actor.items.filter(i => i.type === "hechizo");
    context.equipo = this.actor.items.filter(i => i.type === "equipo");
    context.rasgos = this.actor.items.filter(i => i.type === "rasgo");

    // Competencias con valor total computado
    const todasCompetencias = this.actor.items.filter(i => i.type === "competencia")
      .map(item => {
        const data = item.toObject(false);
        let carTotal = 0;
        if (item.system.caracteristica === "asp") {
          const asp = this.actor.system.aspecto;
          carTotal = asp?.total ?? asp?.value ?? 0;
        } else {
          const car = this.actor.system.caracteristicas?.[item.system.caracteristica];
          carTotal = car?.total ?? car?.value ?? 0;
        }
        const esPrimaria = item.system.tipo?.startsWith("primaria");
        const mult = esPrimaria ? parseInt(item.system.tipo?.slice(-1)) || 1 : 1;
        data.valorBase = carTotal * mult;
        data.valorTotal = data.valorBase;
        data.carAbr = CONFIG.AQUELARRE.caracteristicasAbr[item.system.caracteristica] ?? "—";
        return data;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Separar competencias por sección
    context.competencias = todasCompetencias.filter(c => c.system.seccion === "general");
    context.competenciasArmas = todasCompetencias.filter(c => c.system.seccion === "arma");

    return context;
  }

  /* ---------------------------------------------------------------
   *  _updateObject — intercepta cambios con operaciones +/-
   * --------------------------------------------------------------- */
  async _updateObject(event, formData) {
    // Función helper para procesar operaciones +/-
    const procesarOperacion = (input, valorActual, min = -Infinity, max = Infinity) => {
      const inputStr = String(input).trim();
      let nuevoValor = null;
      
      if (inputStr.startsWith("+") || inputStr.startsWith("-")) {
        const operacion = parseFloat(inputStr);
        if (!isNaN(operacion)) {
          nuevoValor = valorActual + operacion;
        }
      } else if (inputStr !== "") {
        const valor = parseInt(inputStr);
        if (!isNaN(valor)) {
          nuevoValor = valor;
        }
      }
      
      // Aplicar límites si se especifican
      if (nuevoValor !== null) {
        nuevoValor = Math.min(max, Math.max(min, nuevoValor));
      }
      return nuevoValor;
    };

    // 1. Procesar PV
    const pvKey = "system.derivados.pv.value";
    if (formData[pvKey] !== undefined) {
      const nuevoValorPV = procesarOperacion(formData[pvKey], this.actor.system.derivados.pv.value);
      if (nuevoValorPV !== null) {
        formData[pvKey] = Number(nuevoValorPV);
      }
    }

    // 2. Procesar RAC
    const racKey = "system.derivados.racionalidad";
    if (formData[racKey] !== undefined) {
      const nuevoValorRAC = procesarOperacion(formData[racKey], this.actor.system.derivados.racionalidad, -100, 100);
      if (nuevoValorRAC !== null) {
        formData[racKey] = Number(nuevoValorRAC);
      }
    }

    // 3. Procesar IRR
    const irrKey = "system.derivados.irracionalidad";
    if (formData[irrKey] !== undefined) {
      const nuevoValorIRR = procesarOperacion(formData[irrKey], this.actor.system.derivados.irracionalidad, 0, 200);
      if (nuevoValorIRR !== null) {
        formData[irrKey] = Number(nuevoValorIRR);
      }
    }

    // 4. Procesar PF
    const pfKey = "system.derivados.pf.value";
    if (formData[pfKey] !== undefined) {
      const nuevoValorPF = procesarOperacion(formData[pfKey], this.actor.system.derivados.pf.value, 0);
      if (nuevoValorPF !== null) {
        formData[pfKey] = Number(nuevoValorPF);
      }
    }

    // 5. Procesar PC
    const pcKey = "system.derivados.pc.value";
    if (formData[pcKey] !== undefined) {
      const nuevoValorPC = procesarOperacion(formData[pcKey], this.actor.system.derivados.pc.value, 0);
      if (nuevoValorPC !== null) {
        formData[pcKey] = Number(nuevoValorPC);
      }
    }

    // 6. Procesar Puntos de Aprendizaje (solo números positivos)
    const paKey = "system.trasfondo.puntosAprendizaje";
    if (formData[paKey] !== undefined) {
      const nuevoValorPA = procesarOperacion(formData[paKey], this.actor.system.trasfondo.puntosAprendizaje, 0);
      if (nuevoValorPA !== null) {
        formData[paKey] = Number(nuevoValorPA);
      }
    }

    // 7. Lógica de sincronización RAC/IRR (mantiene la relación inversa)
    const racViejo = this.actor.system.derivados.racionalidad;
    const irrViejo = this.actor.system.derivados.irracionalidad;

    const racNuevo = formData[racKey] ?? racViejo;
    const irrNuevo = formData[irrKey] ?? irrViejo;

    // Detectar cuál campo cambió el usuario
    if (racNuevo !== racViejo && irrNuevo === irrViejo) {
      // RAC cambió → ajustar IRR
      const rac = Math.min(100, Math.max(-100, racNuevo));
      const irr = Math.min(200, Math.max(0, 100 - rac));
      formData[racKey] = rac;
      formData[irrKey] = irr;
    } else if (irrNuevo !== irrViejo) {
      // IRR cambió → ajustar RAC
      const irr = Math.min(200, Math.max(0, irrNuevo));
      const rac = Math.min(100, Math.max(-100, 100 - irr));
      formData[irrKey] = irr;
      formData[racKey] = rac;
    }

    return super._updateObject(event, formData);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // Tirada de característica
    html.find(".rollable-car").click(ev => {
      const key = ev.currentTarget.dataset.car;
      this.actor.rollCaracteristica(key);
    });

    // Tirada de derivado (suerte, templanza, racionalidad, irracionalidad)
    html.find(".rollable-derivado").click(ev => {
      const derivado = ev.currentTarget.dataset.derivado;
      this.actor.rollDerivado(derivado);
    });

    // Tirada de iniciativa
    html.find(".rollable-iniciativa").click(ev => {
      this.actor.rollIniciativa();
    });

    // Tirada de competencia
    html.find(".rollable-comp").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      this.actor.rollCompetencia(itemId);
    });

    // Item roll (arma, hechizo, etc.)
    html.find(".item-roll").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      item?.roll();
    });

    // Editar item
    html.find(".item-edit").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      item?.sheet.render(true);
    });

    // Borrar item
    html.find(".item-delete").click(ev => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      item?.delete();
    });

    // Inline: cambiar tipo de competencia
    html.find(".comp-tipo-select").change(async (ev) => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({ "system.tipo": ev.currentTarget.value });
    });

    // Añadir competencia personalizada con popup
    html.find(".add-competencia").click(async (ev) => {
      this._popupNuevaCompetencia();
    });

    // Crear competencias por defecto del manual
    html.find(".crear-competencias-defecto").click(async (ev) => {
      await this.actor.crearCompetenciasDefecto();
    });

    // Buscador de competencias
    html.find(".comp-search-input").on("input", (ev) => {
      const filtro = ev.currentTarget.value.toLowerCase().trim();
      html.find(".competencias-list .item").each((_, li) => {
        const nombre = li.querySelector(".comp-name")?.textContent?.toLowerCase() ?? "";
        li.style.display = nombre.includes(filtro) ? "" : "none";
      });
    });

    // Toggle colapso de secciones de competencias
    html.find(".comp-section-title").click((ev) => {
      const section = ev.currentTarget.closest(".collapsible-section");
      if (section) {
        section.classList.toggle("collapsed");
        // Guardar estado en localStorage
        const sectionName = section.dataset.section;
        const isCollapsed = section.classList.contains("collapsed");
        const key = `competencias-section-${this.actor.id}-${sectionName}`;
        if (isCollapsed) {
          localStorage.setItem(key, "true");
        } else {
          localStorage.removeItem(key);
        }
      }
    });

    // Restaurar estado colapsado de secciones
    html.find(".collapsible-section").each((_, section) => {
      const sectionName = section.dataset.section;
      const key = `competencias-section-${this.actor.id}-${sectionName}`;
      if (localStorage.getItem(key) === "true") {
        section.classList.add("collapsed");
      }
    });

    // Toggle checkbox éxito reciente
    html.find(".comp-exito-check").change(async (ev) => {
      const itemId = ev.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({ "system.exitoReciente": ev.currentTarget.checked });
    });

    // Limpiar todos los checkboxes de éxito
    html.find(".limpiar-exitos").click(async (ev) => {
      const updates = this.actor.items
        .filter(i => i.type === "competencia" && i.system.exitoReciente)
        .map(i => ({ _id: i.id, "system.exitoReciente": false }));
      if (updates.length > 0) await this.actor.updateEmbeddedDocuments("Item", updates);
    });

    // Seleccionar todo al hacer focus en el campo de PV
    html.find('input[name="system.derivados.pv.value"]').on("focus", function(e) {
      e.target.select();
    });

    // Validar Puntos de Aprendizaje: rechazar negativos en tiempo real
    html.find('input[name="system.trasfondo.puntosAprendizaje"]').on("change", (ev) => {
      const val = parseInt(ev.target.value) || 0;
      if (val < 0) {
        ev.target.value = 0;
      }
    });
  }

  /* ---------------------------------------------------------------
   *  Popup para crear competencia personalizada
   * --------------------------------------------------------------- */
  async _popupNuevaCompetencia() {
    const carOpts = Object.entries(CONFIG.AQUELARRE.caracteristicasAbr)
      .map(([k, v]) => `<option value="${k}">${v}</option>`)
      .join("");
    const tipoOpts = Object.entries(CONFIG.AQUELARRE.tiposCompetencia)
      .map(([k, v]) => `<option value="${k}">${v}</option>`)
      .join("");

    const resultado = await new Promise((resolve) => {
      new Dialog({
        title: "Nueva Competencia",
        content: `
          <form>
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" name="nombre" placeholder="Ej: Alquimia" autofocus />
            </div>
            <div class="form-group">
              <label>Característica</label>
              <select name="car"><option value="">—</option>${carOpts}</select>
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <select name="tipo">${tipoOpts}</select>
            </div>
            <div class="form-group">
              <label>Sección</label>
              <select name="seccion">
                <option value="general">Competencias Generales</option>
                <option value="arma">Competencias de Armas</option>
              </select>
            </div>
          </form>`,
        buttons: {
          crear: {
            icon: '<i class="fas fa-check"></i>',
            label: "Crear",
            callback: (html) => resolve({
              nombre: html.find('[name="nombre"]').val()?.trim() || "Nueva Competencia",
              car: html.find('[name="car"]').val(),
              tipo: html.find('[name="tipo"]').val() || "normal",
              seccion: html.find('[name="seccion"]').val() || "general",
            }),
          },
          cancelar: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar",
            callback: () => resolve(null),
          },
        },
        default: "crear",
        close: () => resolve(null),
      }).render(true);
    });

    if (!resultado) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: resultado.nombre,
      type: "competencia",
      system: {
        caracteristica: resultado.car,
        tipo: resultado.tipo,
        bonus: 0,
        seccion: resultado.seccion,
      },
    }]);
  }
}
