# Aquelarre (Akers) — Sistema para Foundry VTT

Sistema no oficial para el juego de rol **Aquelarre** (demoníaco-medieval), ambientado en la Península Ibérica durante los siglos XIII-XV. Desarrollado sobre el motor **Foundry VTT v12** con el sistema BRP (tiradas percentiles d100).

---

## Características

- **Personajes** (PJ, PNJ, Criatura) con hojas completas
- **Características** principales (FUE, AGI, HAB, RES, PER, COM, CUL, ASP) y derivados (PV, PF, PC, RAC/IRR)
- **Competencias** con multiplicadores, sistema de éxito reciente y búsqueda en tiempo real
- **Combate** con armas, armaduras y localizaciones de impacto
- **Magia** completa:
  - Conjuros y milagros (Vis / Ordo 1-7)
  - Formas mágicas (Invocación, Maleficio, Poción, Talismán, Ungüento)
  - Componentes mágicos con tags desplegables por procedencia, tipo y naturaleza
- **Compendios integrados**: Conjuros y Milagros / Componentes Mágicos
- Idioma: Español

---

## Instalación del sistema

### Opción A — Manifiesto (recomendada)

1. Abre Foundry VTT y dirígete a **Configuración → Sistemas de Juego → Instalar Sistema**.
2. En el campo **URL del Manifiesto**, pega la URL del `system.json` de este repositorio:
   ```
   https://raw.githubusercontent.com/MrGrimoire/Aker-s-Aquelarre-Foundry-VTT/main/system.json
   ```
3. Haz clic en **Instalar** y espera a que finalice la descarga.
4. Crea o abre un mundo y selecciona **Aquelarre (Akers)** como sistema.

### Opción B — Instalación manual

1. Descarga el repositorio como `.zip` desde GitHub → **Code → Download ZIP**.
2. Descomprime el contenido. Debe quedar una carpeta llamada `akers_aquelarre`.
3. Copia esa carpeta en la ruta de sistemas de tu instalación de Foundry:
   ```
   <carpeta-datos-foundry>/Data/systems/akers_aquelarre/
   ```
   La carpeta de datos suele estar en:
   - **Windows**: `%localappdata%\FoundryVTT\Data\`
   - **Linux/macOS**: `~/.local/share/FoundryVTT/Data/`
4. Reinicia Foundry VTT. El sistema aparecerá en la lista.

> **No se requieren pasos adicionales.** No hay que ejecutar `npm install`, ni compilar, ni construir los compendios: el sistema funciona en cuanto se reinicia Foundry. Los compendios se rellenan solos la primera vez que un GM abre un mundo con el sistema (ver [Primera carga](#primera-carga-siembra-automática)).

---

## Cómo usar los Compendios incluidos

El sistema incluye tres compendios que se rellenan automáticamente la primera vez que el GM abre un mundo con este sistema.

| Compendio | Nombre interno | Contenido |
|-----------|---------------|-----------|
| **Ars Magica — Conjuros** | `ars-magica` | 20 conjuros de magia popular, alquímica, infernal y prohibida |
| **Ars Theologica — Milagros** | `ars-theologica` | 15 milagros de los rituales de fe |
| **Componentes Mágicos** | `componentes-magicos` | 22 ingredientes clasificados por procedencia, potencial y naturaleza |

### Primera carga (siembra automática)

Cuando el **Director de Juego** abre por primera vez un mundo con el sistema instalado, los tres compendios se rellenan automáticamente con su contenido. En la esquina inferior aparecerá una notificación por cada compendio cargado. Este proceso solo ocurre una vez por compendio (si ya tiene contenido, no modifica nada).

### Acceder a un compendio

1. En la barra lateral, haz clic en el icono de **Compendios** (libro con candado).
2. Busca **Ars Magica**, **Ars Theologica** o **Componentes Mágicos** en la lista.
3. Haz clic para abrir el compendio y ver su contenido.

### Añadir nuevas entradas al compendio (Director de Juego)

Para ampliar los compendios con tus propios conjuros o componentes:

1. Crea el item desde la pestaña **Items** (barra lateral) → botón **+**.
2. Rellena todos sus campos.
3. En la barra lateral, abre el compendio de destino.
4. Arrastra el item desde **Items** hasta la ventana del compendio.

> Los compendios del sistema están bloqueados por defecto. Para editarlos, haz clic derecho sobre el compendio → **Desbloquear compendio**.

### Importar un item del compendio al personaje

1. Abre el compendio.
2. Arrastra el hechizo o componente directamente sobre la ficha del personaje, pestaña **Magia**.

### Importar un item del compendio al mundo (para editarlo)

1. Abre el compendio.
2. Haz clic derecho sobre la entrada → **Importar al Mundo**.
3. El item aparecerá en la pestaña **Items** y podrás editarlo libremente.

---

## Cómo instalar un Compendio externo (módulo)

Si deseas instalar compendios de terceros (por ejemplo, un módulo con los conjuros oficiales del manual):

1. En Foundry VTT, ve a **Configuración → Módulos Añadidos → Instalar Módulo**.
2. Pega la URL del `module.json` del módulo que quieres instalar, o búscalo por nombre.
3. Haz clic en **Instalar**.
4. Una vez instalado, actívalo desde **Configuración → Módulos Añadidos** dentro de tu mundo.
5. Los compendios del módulo aparecerán automáticamente en la pestaña **Compendios**.

---

## Estructura del proyecto

```
akers_aquelarre/
├── aquelarre.mjs              # Punto de entrada del sistema
├── system.json                # Manifiesto del sistema
├── lang/
│   └── es.json                # Localización en español
├── module/
│   ├── data-models/           # Modelos de datos (Actor e Item)
│   │   ├── actor/             # personaje, pnj, criatura
│   │   └── item/              # arma, armadura, competencia, componente, hechizo…
│   ├── documents/             # Clases de documentos Foundry
│   ├── helpers/               # Config, Handlebars helpers, templates, pack-seeder
│   └── sheets/                # Hojas de personaje e item
├── packs/
│   ├── ars-magica/            # Compendio: Ars Magica — Conjuros (LevelDB)
│   ├── ars-theologica/        # Compendio: Ars Theologica — Milagros (LevelDB)
│   └── componentes-magicos/   # Compendio: Componentes Mágicos (LevelDB)
├── styles/
│   └── aquelarre.css          # Estilos del sistema
└── templates/
    ├── actor/                 # Plantillas HBS de actores
    └── item/                  # Plantillas HBS de items
```

---

## Para desarrolladores (opcional)

Esta sección **solo es relevante si quieres regenerar los compendios** a partir del fichero `_parsed.json`. Para jugar no hace falta.

Requisitos: Node.js 18+.

```bash
npm install              # instala classic-level
node _build_packs.mjs    # regenera packs/ars-magica, ars-theologica y componentes-magicos
```

> Foundry debe estar **cerrado** mientras se ejecuta el script: los compendios usan LevelDB y bloquean los ficheros.

---

## Versiones

| Versión | Foundry mínimo | Notas |
|---------|---------------|-------|
| 0.1.0   | v12 (12.328)  | Versión inicial — sistema base, combate, magia y compendios (Ars Magica, Ars Theologica, Componentes) |

---

## Autores

- **Zarrok** — Discord: `mephisto_207`
- **Weiss Acker** — Discord: `weissacker`

---

## Licencia

Este sistema es un desarrollo de fans sin afiliación oficial con Nosolorol Ediciones, titulares de la propiedad intelectual del juego de rol **Aquelarre**. Su uso está destinado exclusivamente a facilitar partidas en línea a quienes ya poseen el juego.
