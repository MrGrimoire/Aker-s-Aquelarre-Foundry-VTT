/**
 * Constantes de configuración del sistema Aquelarre.
 */
export const AQUELARRE = {};

/**
 * Características principales del personaje.
 */
AQUELARRE.caracteristicas = {
  fue: "Fuerza",
  agi: "Agilidad",
  hab: "Habilidad",
  res: "Resistencia",
  per: "Percepción",
  com: "Comunicación",
  cul: "Cultura",
  asp: "Aspecto"
};

/**
 * Abreviaturas de las características.
 */
AQUELARRE.caracteristicasAbr = {
  fue: "FUE",
  agi: "AGI",
  hab: "HAB",
  res: "RES",
  per: "PER",
  com: "COM",
  cul: "CUL",
  asp: "ASP"
};

/**
 * Reinos de la Península Ibérica.
 */
AQUELARRE.reinos = {
  castilla: "Castilla",
  aragon: "Aragón",
  portugal: "Portugal",
  navarra: "Navarra",
  granada: "Granada"
};

/**
 * Religiones disponibles.
 */
AQUELARRE.religiones = {
  cristiana: "Cristiana",
  judia: "Judía",
  musulmana: "Musulmana"
};

/**
 * Clases sociales.
 */
AQUELARRE.clasesSociales = {
  nobleza: "Nobleza",
  burguesia: "Burguesía",
  villano: "Villano",
  clero: "Clero",
  marginal: "Marginal"
};

/**
 * Tipos de arma (por tamaño).
 */
AQUELARRE.tamanoArma = {
  ligero: "Ligero",
  medio: "Medio",
  pesado: "Pesado"
};

/**
 * Competencias de combate (categorías de arma).
 */
AQUELARRE.competenciasCombate = {
  arcos: "Arcos",
  ballestas: "Ballestas",
  cuchillos: "Cuchillos",
  espadas: "Espadas",
  espadones: "Espadones",
  hachas: "Hachas",
  hondas: "Hondas",
  lanzas: "Lanzas",
  mazas: "Mazas",
  palos: "Palos",
  pelea: "Pelea",
  escudos: "Escudos"
};

/**
 * Localizaciones de impacto.
 */
AQUELARRE.localizaciones = {
  cabeza: "Cabeza",
  torso: "Torso",
  brazoDer: "Brazo Der.",
  brazoIzq: "Brazo Izq.",
  piernaDer: "Pierna Der.",
  piernaIzq: "Pierna Izq."
};

/**
 * Tipos de hechizo.
 */
AQUELARRE.tiposHechizo = {
  conjuro: "Conjuro",
  milagro: "Milagro",
};

/**
 * Tradiciones mágicas (orígenes).
 */
AQUELARRE.origenesMagia = {
  popular: "Popular",
  alquimico: "Alquímico",
  infernal: "Infernal",
  prohibido: "Prohibido",
  fe: "Rituales de Fe"
};

/**
 * Formas mágicas / Ceremonia.
 */
AQUELARRE.formasMagia = {
  invocacion: "Invocación",
  maleficio: "Maleficio",
  pocion: "Poción",
  talisman: "Talismán",
  unguento: "Ungüento",
};

/**
 * Naturaleza de la magia.
 */
AQUELARRE.naturalezaMagia = {
  blanca: "Blanca",
  negra: "Negra",
};

/**
 * Procedencia de componentes mágicos.
 */
AQUELARRE.procedenciasComponente = {
  vegetal: "Vegetal",
  mineral: "Mineral",
  animal: "Animal",
  humano: "Humano",
  irracional: "Irracional",
};

/**
 * Potencial mágico de componentes.
 * Tipo 1: escaso potencial, uso común.
 * Tipo 2: gran potencial O difícil de conseguir.
 * Tipo 3: gran potencial Y difícil de conseguir.
 */
AQUELARRE.tiposComponente = {
  tipo1: "Tipo 1 — Común",
  tipo2: "Tipo 2 — Potente o raro",
  tipo3: "Tipo 3 — Potente y raro",
};

/**
 * Tipos de armadura.
 */
AQUELARRE.tiposArmadura = {
  blanda: "Blanda",
  ligera: "Ligera",
  metalica: "Metálica",
  completa: "Completa",
  casco: "Casco",
  animal: "Animal"
};

/**
 * Tipos de rasgo.
 */
AQUELARRE.tiposRasgo = {
  ventaja: "Ventaja",
  desventaja: "Desventaja",
  orgullo: "Orgullo",
  verguenza: "Vergüenza"
};

/**
 * Sociedades.
 */
AQUELARRE.sociedades = {
  cristiana: "Cristiana",
  islamica: "Islámica",
  judia: "Judía"
};

/**
 * Tipos de competencia (para selector en ficha).
 */
AQUELARRE.tiposCompetencia = {
  normal: "Normal",
  paterna: "Paterna",
  primaria2: "Primaria ×2",
  primaria3: "Primaria ×3",
  secundaria: "Secundaria",
};

/**
 * Dificultades de tirada de competencia.
 */
AQUELARRE.dificultades = {
  75: "Infalible (+75%)",
  50: "Muy fácil (+50%)",
  25: "Fácil (+25%)",
  0: "Normal (+0%)",
  "-25": "Difícil (−25%)",
  "-50": "Muy difícil (−50%)",
  "-75": "Imposible (−75%)",
};

/**
 * Competencias por defecto del manual de Aquelarre.
 */
AQUELARRE.competenciasDefecto = [
  { name: "Alquimia", caracteristica: "cul" },
  { name: "Artesanía", caracteristica: "hab" },
  { name: "Astrología", caracteristica: "cul" },
  { name: "Cabalgar", caracteristica: "agi" },
  { name: "Cantar", caracteristica: "com" },
  { name: "Comerciar", caracteristica: "com" },
  { name: "Conducir Carro", caracteristica: "hab" },
  { name: "Conocimiento Animal", caracteristica: "cul" },
  { name: "Conocimiento de Área", caracteristica: "cul" },
  { name: "Conocimiento Mágico", caracteristica: "cul" },
  { name: "Conocimiento Mineral", caracteristica: "cul" },
  { name: "Conocimiento Vegetal", caracteristica: "cul" },
  { name: "Correr", caracteristica: "agi" },
  { name: "Corte", caracteristica: "com" },
  { name: "Degustar", caracteristica: "per" },
  { name: "Descubrir", caracteristica: "per" },
  { name: "Disfrazarse", caracteristica: "com" },
  { name: "Elocuencia", caracteristica: "com" },
  { name: "Empatía", caracteristica: "per" },
  { name: "Enseñar", caracteristica: "com" },
  { name: "Escamotear", caracteristica: "hab" },
  { name: "Escuchar", caracteristica: "per" },
  { name: "Esquivar", caracteristica: "agi" },
  { name: "Forzar Mecanismos", caracteristica: "hab" },
  { name: "Idioma", caracteristica: "cul" },
  { name: "Juego", caracteristica: "hab" },
  { name: "Lanzar", caracteristica: "agi" },
  { name: "Leer y Escribir", caracteristica: "cul" },
  { name: "Leyendas", caracteristica: "cul" },
  { name: "Mando", caracteristica: "com" },
  { name: "Medicina", caracteristica: "cul" },
  { name: "Memoria", caracteristica: "per" },
  { name: "Música", caracteristica: "cul" },
  { name: "Nadar", caracteristica: "agi" },
  { name: "Navegar", caracteristica: "hab" },
  { name: "Ocultar", caracteristica: "hab" },
  { name: "Rastrear", caracteristica: "per" },
  { name: "Saltar", caracteristica: "agi" },
  { name: "Sanar", caracteristica: "hab" },
  { name: "Seducción", caracteristica: "asp" },
  { name: "Sigilo", caracteristica: "agi" },
  { name: "Teología", caracteristica: "cul" },
  { name: "Tormento", caracteristica: "hab" },
  { name: "Trepar", caracteristica: "agi" },
  // Combate
  { name: "Arcos", caracteristica: "per", tipoArma: "arcos" },
  { name: "Ballestas", caracteristica: "hab", tipoArma: "ballestas" },
  { name: "Cuchillos", caracteristica: "hab", tipoArma: "cuchillos" },
  { name: "Escudos", caracteristica: "hab", tipoArma: "escudos" },
  { name: "Espadas", caracteristica: "hab", tipoArma: "espadas" },
  { name: "Espadones", caracteristica: "fue", tipoArma: "espadones" },
  { name: "Hachas", caracteristica: "fue", tipoArma: "hachas" },
  { name: "Hondas", caracteristica: "per", tipoArma: "hondas" },
  { name: "Lanzas", caracteristica: "agi", tipoArma: "lanzas" },
  { name: "Mazas", caracteristica: "fue", tipoArma: "mazas" },
  { name: "Palos", caracteristica: "agi", tipoArma: "palos" },
  { name: "Pelea", caracteristica: "agi", tipoArma: "pelea" },
];
