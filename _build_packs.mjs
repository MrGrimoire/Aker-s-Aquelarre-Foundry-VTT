/**
 * _build_packs.mjs
 * Escribe los tres compendios LevelDB directamente desde _parsed.json.
 * Ejecutar con: node _build_packs.mjs
 * Foundry debe estar CERRADO.
 */

import { ClassicLevel } from "classic-level";
import { readFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { randomBytes } from "crypto";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const parsed = JSON.parse(readFileSync(join(__dir, "_parsed.json"), "utf8"));

// ── Utilidades ─────────────────────────────────────────────
function stableId(name, type) {
  // FNV-1a 32-bit × 2 → 16 chars base36
  let h1 = 0x811c9dc5 >>> 0, h2 = 0xc59d1c81 >>> 0;
  const src = `${type}:${name}`;
  for (let i = 0; i < src.length; i++) {
    h1 ^= src.charCodeAt(i); h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= src.charCodeAt(i); h2 = Math.imul(h2, 0x85ebca77) >>> 0;
  }
  return (h1.toString(36) + h2.toString(36)).padEnd(16, "0").slice(0, 16);
}

function mapForma(tipo) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("maleficio")) return "maleficio";
  if (t.includes("poción") || t.includes("pocion")) return "pocion";
  if (t.includes("talismán") || t.includes("talisman")) return "talisman";
  if (t.includes("ungüento") || t.includes("unguento")) return "unguento";
  return "invocacion";
}

const ICON_BASE = "systems/akers_aquelarre/icons/aquelarre";
const ICON_BY_FORMA = {
  maleficio:  `${ICON_BASE}/witch-flight.svg`,
  pocion:     `${ICON_BASE}/potion-ball.svg`,
  talisman:   `${ICON_BASE}/charm.svg`,
  unguento:   `${ICON_BASE}/bubbling-flask.svg`,
  invocacion: `${ICON_BASE}/magic-swirl.svg`,
};
const ICON_MILAGRO    = `${ICON_BASE}/angel-wings.svg`;
const ICON_COMPONENTE = `${ICON_BASE}/mushroom-gills.svg`;

function mapOrigen(origen) {
  const o = (origen || "").toLowerCase();
  if (o.includes("alquím") || o.includes("alquim")) return "alquimico";
  if (o.includes("infernal")) return "infernal";
  if (o.includes("prohib")) return "prohibido";
  return "popular";
}

function visCoste(vis) {
  const table = { 1:1, 2:1, 3:2, 4:3, 5:5, 6:5, 7:10 };
  return table[vis] ?? 1;
}

// ── Convertir hechizos ──────────────────────────────────────
const CONJUROS = parsed.hechizos.map(h => {
  const forma = mapForma(h.tipo);
  return {
  _id: stableId(h.nombre, "hechizo"),
  name: h.nombre,
  type: "hechizo",
  img: ICON_BY_FORMA[forma] ?? ICON_BY_FORMA.invocacion,
  system: {
    tipo:           "conjuro",
    nombreLatin:    h.nombreLatin ?? "",
    origen:         mapOrigen(h.origen),
    naturaleza:     (h.color ?? "").toLowerCase() === "negra" ? "negra" : "blanca",
    vis:            Number(h.vis) || 1,
    costePC:        visCoste(Number(h.vis) || 1),
    forma:          forma,
    expiracion:     h["Caducidad"]  ?? "",
    duracion:       h["Duración"]   ?? "",
    alcance:        "",
    resistible:     false,
    componentesNombres: h["Componentes"] ? [h["Componentes"]] : [],
    componenteIds:  [],
    preparacion:    h["Preparación"] ? `<p>${h["Preparación"]}</p>` : "",
    descripcion:    h["Descripción"] ? `<p>${h["Descripción"]}</p>` : "",
  },
  effects: [], folder: null, sort: 0, ownership: { default: 0 }, flags: {}, _stats: {}
  };
});

// ── Convertir milagros ──────────────────────────────────────
const MILAGROS = parsed.milagros.map(m => ({
  _id: stableId(m.nombre, "milagro"),
  name: m.nombre,
  type: "hechizo",
  img: ICON_MILAGRO,
  system: {
    tipo:           "milagro",
    nombreLatin:    m.latin ?? "",
    origen:         "fe",
    naturaleza:     "blanca",
    vis:            Number(m.ordo) || 1,
    costePC:        visCoste(Number(m.ordo) || 1),
    forma:          "invocacion",
    expiracion:     "",
    duracion:       m["Duración de la Ceremonia"] ?? "",
    alcance:        "",
    resistible:     false,
    componentesNombres: [],
    componenteIds:  [],
    preparacion:    m["Ceremonia"] ? `<p>${m["Ceremonia"]}</p>` : "",
    descripcion:    [m.descCorta, m["Efectos"]].filter(Boolean).map(t => `<p>${t}</p>`).join(""),
  },
  effects: [], folder: null, sort: 0, ownership: { default: 0 }, flags: {}, _stats: {}
}));

// ── Convertir componentes (los 55 del seeder original siguen en _parsed) ──
// unique_components son solo nombres crudos; usamos solo los primeros 55
// que sabemos son los reales del libro. Tomamos los que tienen pinta de
// ingrediente real filtrando los que son frases largas.
const rawComps = parsed.unique_components
  .filter(c => typeof c === "string" && c.length < 60 && c.length > 2)
  .slice(0, 55);

const COMPONENTES = rawComps.map(nombre => ({
  _id: stableId(nombre, "componente"),
  name: nombre,
  type: "componente",
  img: ICON_COMPONENTE,
  system: {
    procedencia:      "vegetal",
    tipoComponente:   "tipo1",
    naturaleza:       "blanca",
    origen:           "popular",
    efecto:           "",
    preparacion:      "",
    descripcion:      "",
  },
  effects: [], folder: null, sort: 0, ownership: { default: 0 }, flags: {}, _stats: {}
}));

// ── Escribir LevelDB ────────────────────────────────────────
async function writePack(packPath, docs) {
  // Borrar si existe
  if (existsSync(packPath)) rmSync(packPath, { recursive: true, force: true });
  mkdirSync(packPath, { recursive: true });

  const db = new ClassicLevel(packPath, { valueEncoding: "json" });
  await db.open();

  const batch = db.batch();
  for (const doc of docs) {
    batch.put(`!items!${doc._id}`, doc);
  }
  await batch.write();
  await db.close();
  console.log(`✓ ${packPath.split("\\").pop().split("/").pop()}: ${docs.length} documentos escritos`);
}

const BASE = join(__dir, "packs");
mkdirSync(BASE, { recursive: true });

await writePack(join(BASE, "ars-magica"),          CONJUROS);
await writePack(join(BASE, "ars-theologica"),      MILAGROS);
await writePack(join(BASE, "componentes-magicos"), COMPONENTES);

console.log("\n=== TOTALES ===");
console.log(`Conjuros:    ${CONJUROS.length}`);
console.log(`Milagros:    ${MILAGROS.length}`);
console.log(`Componentes: ${COMPONENTES.length}`);
console.log("\nListo. Abre Foundry y los compendios estarán cargados.");
