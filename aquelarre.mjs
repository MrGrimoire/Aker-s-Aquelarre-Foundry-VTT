/* ============================================================
   AQUELARRE — Entry Point (Foundry VTT v12)
   ============================================================ */

// --- Config ---
import { AQUELARRE } from "./module/helpers/config.mjs";
import { preloadHandlebarsTemplates } from "./module/helpers/templates.mjs";
import { registerHandlebarsHelpers } from "./module/helpers/handlebars.mjs";

// --- Data Models: Actor ---
import { PersonajeDataModel } from "./module/data-models/actor/personaje.mjs";
import { PnjDataModel } from "./module/data-models/actor/pnj.mjs";
import { CriaturaDataModel } from "./module/data-models/actor/criatura.mjs";

// --- Data Models: Item ---
import { ArmaDataModel } from "./module/data-models/item/arma.mjs";
import { ArmaduraDataModel } from "./module/data-models/item/armadura.mjs";
import { CompetenciaDataModel } from "./module/data-models/item/competencia.mjs";
import { HechizoDataModel } from "./module/data-models/item/hechizo.mjs";
import { ProfesionDataModel } from "./module/data-models/item/profesion.mjs";
import { EquipoDataModel } from "./module/data-models/item/equipo.mjs";
import { RasgoDataModel } from "./module/data-models/item/rasgo.mjs";

// --- Document Classes ---
import { AquelarreActor } from "./module/documents/actor.mjs";
import { AquelarreItem } from "./module/documents/item.mjs";

// --- Sheet Classes ---
import { PersonajeSheet } from "./module/sheets/personaje-sheet.mjs";
import { PnjSheet } from "./module/sheets/pnj-sheet.mjs";
import { CriaturaSheet } from "./module/sheets/criatura-sheet.mjs";
import { AquelarreItemSheet } from "./module/sheets/item-sheet.mjs";

/* -------------------------------------------------------
   Hooks.once("init") — Registro del sistema
   ------------------------------------------------------- */
Hooks.once("init", function () {
  console.log("Aquelarre | Inicializando sistema Aquelarre para Foundry VTT v12");

  // Guardar referencia global de configuración
  CONFIG.AQUELARRE = AQUELARRE;

  // --- Registrar clases de documento ---
  CONFIG.Actor.documentClass = AquelarreActor;
  CONFIG.Item.documentClass = AquelarreItem;

  // --- Registrar Data Models ---
  CONFIG.Actor.dataModels.personaje = PersonajeDataModel;
  CONFIG.Actor.dataModels.pnj = PnjDataModel;
  CONFIG.Actor.dataModels.criatura = CriaturaDataModel;

  CONFIG.Item.dataModels.arma = ArmaDataModel;
  CONFIG.Item.dataModels.armadura = ArmaduraDataModel;
  CONFIG.Item.dataModels.competencia = CompetenciaDataModel;
  CONFIG.Item.dataModels.hechizo = HechizoDataModel;
  CONFIG.Item.dataModels.profesion = ProfesionDataModel;
  CONFIG.Item.dataModels.equipo = EquipoDataModel;
  CONFIG.Item.dataModels.rasgo = RasgoDataModel;

  // --- Registrar Sheets de Actor ---
  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("akers_aquelarre", PersonajeSheet, {
    types: ["personaje"],
    makeDefault: true,
    label: "AQUELARRE.ActorType.personaje",
  });

  Actors.registerSheet("akers_aquelarre", PnjSheet, {
    types: ["pnj"],
    makeDefault: true,
    label: "AQUELARRE.ActorType.pnj",
  });

  Actors.registerSheet("akers_aquelarre", CriaturaSheet, {
    types: ["criatura"],
    makeDefault: true,
    label: "AQUELARRE.ActorType.criatura",
  });

  // --- Registrar Sheet de Item ---
  Items.unregisterSheet("core", ItemSheet);

  Items.registerSheet("akers_aquelarre", AquelarreItemSheet, {
    makeDefault: true,
    label: "Aquelarre Item",
  });

  // --- Helpers de Handlebars ---
  registerHandlebarsHelpers();

  // --- Pre-cargar plantillas parciales ---
  preloadHandlebarsTemplates();

  console.log("Aquelarre | Sistema inicializado correctamente");
});

/* -------------------------------------------------------
   Hooks.once("ready") — Sistema listo
   ------------------------------------------------------- */
Hooks.once("ready", function () {
  console.log("Aquelarre | Sistema listo");
});
