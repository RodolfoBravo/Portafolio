# Rediseño de portafolio: Fullstack → AI Engineer

**Fecha:** 2026-07-30
**Autor:** Rodolfo Bravo
**Estado:** Aprobado, listo para plan de implementación

---

## 1. Objetivo

Rediseñar por completo el portafolio de Rodolfo Bravo para que:

1. Lo reposicione de **Programador Full Stack con 3 años** a **AI Engineer con 7 años**.
2. Consiga entrevistas: el lector objetivo es un recruiter técnico o hiring manager que dedica
   entre 30 y 90 segundos a la primera pasada.
3. Se vea deliberadamente diseñado y no como una plantilla, con una estética oscura editorial
   y animaciones del tipo que popularizó React Bits, implementadas en JavaScript vanilla.
4. Funcione en español e inglés con un toggle, sin recargar la página.

### Éxito se mide así

- Un recruiter entiende el posicionamiento (rol, años, disponibilidad, stack) sin hacer scroll.
- Cada proyecto se puede evaluar técnicamente: problema, arquitectura, stack e impacto.
- No hay ninguna afirmación en el sitio que Rodolfo no pueda defender en una entrevista.
- Lighthouse ≥ 95 en Performance y Accessibility. Cero errores en consola.

---

## 2. Estado actual y por qué se reescribe

El sitio actual es una plantilla de Bootstrap 4 con tema `politics_version`, jQuery y 28 archivos
en `js/`. Problemas concretos encontrados:

| Problema | Ubicación | Consecuencia |
|---|---|---|
| Posicionamiento freelance-servicios | secciones Servicios y Flujo de trabajo | Lee como "no busca empleo full-time" |
| "3 años de experiencia" | `index.html:137` | Dato obsoleto, subvalúa el perfil |
| Barras de progreso con porcentajes | `index.html:162-261` | Autoevaluación sin evidencia; "Angular 80%" descarta gratis |
| Imágenes de stock sin descripción | `uploads/gallery_img-0*.jpg` | El recruiter no puede evaluar nada |
| Formulario apunta a PHP | `mail/contact_me.php` | **Roto**: GitHub Pages no ejecuta PHP; los mensajes nunca llegaron |
| API key de Google Maps expuesta | `index.html:648` | Key pública en repo. **Acción externa: revocar/rotar en Google Cloud Console** |
| `<head>` mal formado | `index.html:4-31` | Falta la etiqueta de apertura `<head>` |
| `maximum-scale=1.0, user-scalable=no` | `index.html:9` | Bloquea el zoom: falla de accesibilidad |
| `id="message"` duplicado | `index.html:556` y `581` | HTML inválido; rompe la lógica del formulario |

Se reescribe en lugar de parchear porque el HTML, el CSS (49 KB) y la cadena de jQuery están
acoplados a la plantilla, y los efectos de motion deseados son más simples y más fluidos sin ella.

---

## 3. Decisiones tomadas

| Decisión | Elección | Razón |
|---|---|---|
| Idioma | Bilingüe ES/EN con toggle | Cubre LatAm y mercado remoto internacional |
| Dirección visual | **Editorial Noir** | Se lee senior; evita el look genérico de portafolio junior |
| Estructura de proyectos | One-page + modal de detalle | Un archivo que mantener, sin duplicar en dos idiomas |
| Stack técnico | HTML + CSS moderno + JS vanilla | Sin build, sin dependencias, despliegue directo en GitHub Pages |
| Formulario | Formspree | Funciona en hosting estático |
| Contenido de proyectos | 6 arquetipos redactados, métricas como marcadores | Rodolfo sustituye con datos reales que pueda defender |

### Nota explícita sobre el contenido de los proyectos

Rodolfo pidió que los case studies se generaran. Este spec los entrega **redactados y listos**,
pero **todas las cifras quedan como marcadores visibles** (`[XX]`) y los nombres de empresa como
`[Empresa]`. Los seis arquetipos se eligieron porque son los que más aparecen en vacantes de AI
Engineer y porque encajan con el stack que Rodolfo ya declara dominar, de modo que se espera que
cada uno corresponda a trabajo real suyo al que solo hay que ponerle los números.

**Esto no es opcional:** publicar el sitio con los marcadores sin sustituir, o con cifras
inventadas, es un riesgo directo para su candidatura. Un entrevistador técnico pregunta "¿cómo
mediste eso?" y una respuesta vacía descarta al candidato en el momento.

---

## 4. Arquitectura de la página

### Se elimina

- Sección **Servicios** (6 tarjetas de servicios freelance).
- Sección **Flujo de trabajo** (01 Diseñar → 04 Disfrutar).
- Todas las **barras de progreso y gráficas de porcentaje** de habilidades.
- **Galería** de imágenes de stock.
- **Google Maps** y su script.
- Preloader con spinner y el SVG decorativo `#clouds`.

### Secciones nuevas, en orden

| # | Sección | Contenido y función |
|---|---|---|
| 1 | **Hero** | Kicker con rol/años/disponibilidad, h1 editorial, párrafo de posicionamiento, 3 CTAs, chips de stack destacado. Aurora reactiva al cursor. |
| 2 | **Barra de credibilidad** | 4 métricas con contador animado. Da escala en un vistazo. |
| 3 | **Case studies** | 6 cartas con tilt 3D y spotlight; filtros por categoría; cada una abre modal con el caso completo. Núcleo del sitio. |
| 4 | **Stack** | 6 grupos por dominio con contexto de uso en lugar de porcentajes. Marquee infinito de tecnologías. |
| 5 | **Cómo llevo IA a producción** | Diagrama de arquitectura de referencia + 4 principios de ingeniería. Sección diferenciadora. |
| 6 | **Experiencia** | Timeline de 7 años; la transición electrónica → software → IA como progresión deliberada. |
| 7 | **Sobre mí** | Narrativa corta; la formación en Ingeniería Electrónica como activo de pensamiento sistémico. |
| 8 | **Contacto** | CTA, formulario Formspree, y accesos directos a email, LinkedIn, GitHub y CV. |

Navegación sticky con toggle ES/EN, barra de progreso de scroll e indicador de sección activa.
Footer con año dinámico.

---

## 5. Sistema de diseño

### Tokens de color

```css
--bg:        #0B0B0C;   /* fondo */
--surface:   #121214;   /* cartas */
--raised:    #17171A;   /* modal, hover */
--hairline:  rgba(244,241,234,.12);
--text:      #F4F1EA;
--muted:     rgba(244,241,234,.62);
--faint:     rgba(244,241,234,.38);
--accent:    #C8FF00;   /* lima ácido, contraste 15:1 sobre --bg */
--accent-ink:#0B0B0C;   /* texto sobre fondo acento */
--live:      #4ADE80;   /* badge de disponibilidad */
```

Un solo acento. Todo lo demás es jerarquía de grises cálidos. El acento se reserva para: el
kicker del hero, una palabra del h1, los números de las métricas, hover de enlaces y el CTA
primario. Nunca para bloques grandes de fondo.

### Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Display | **Instrument Serif** | h1, h2, números grandes |
| UI / cuerpo | **Inter** | párrafos, botones, navegación |
| Datos | **JetBrains Mono** | kickers, etiquetas, stack, métricas, todo dato técnico |

Cargadas desde Google Fonts con `preconnect` y `display=swap`. Fallbacks: Georgia para display,
`system-ui` para UI, `ui-monospace, Consolas` para mono.

Escala fluida:

```css
--fs-display: clamp(2.5rem, 1.2rem + 5.4vw, 5.75rem);  /* h1 */
--fs-h2:      clamp(1.9rem, 1.2rem + 2.4vw, 3.25rem);
--fs-h3:      clamp(1.15rem, 1rem + .6vw, 1.5rem);
--fs-body:    clamp(.95rem, .9rem + .25vw, 1.0625rem);
--fs-mono:    .6875rem;  /* con letter-spacing .14em y uppercase */
```

Medida de lectura máxima 68ch. Interlineado 1.65 en cuerpo, 0.98–1.05 en display con
`letter-spacing: -.022em`.

### Espaciado y forma

- Escala base de 4px: `4 8 12 16 24 32 48 64 96 128`.
- Padding vertical de sección: `clamp(88px, 12vh, 168px)`.
- Contenedor: `min(1180px, 100% - 2 * clamp(20px, 5vw, 64px))`.
- Radios pequeños: 6px en cartas, 999px solo en pills. Nada de radios grandes.
- Separadores: hairline de 1px, no cajas. Las cartas se definen por hairline + cambio de
  superficie, no por sombra.

---

## 6. Especificación de motion

| # | Efecto | Aplicado en | Implementación |
|---|---|---|---|
| 1 | Reveal de texto por palabra con stagger | h1 del hero, títulos de sección | JS envuelve palabras en `<span>`; `IntersectionObserver` dispara `transform` + `opacity` escalonados |
| 2 | Scroll reveal (fade + 16px hacia arriba) | todas las secciones | Un único `IntersectionObserver` compartido, `threshold: .15`, deja de observar tras revelar |
| 3 | Tilt 3D + spotlight que sigue el cursor | cartas de case study | `pointermove` escribe `--mx/--my`; CSS usa `perspective` + `rotateX/Y` (máx 6°) y un `radial-gradient` |
| 4 | Contadores animados | barra de credibilidad | `requestAnimationFrame` con easing `easeOutExpo`, arranca al entrar en viewport |
| 5 | Marquee infinito | sección de stack | Track duplicado + `@keyframes translateX`, pausa en hover |
| 6 | Aurora reactiva al cursor | hero | Radial-gradients posicionados con custom props actualizadas en `pointermove` (throttle vía `rAF`) |
| 7 | Barra de progreso de scroll | nav | `animation-timeline: scroll()` con fallback a listener de `scroll` |
| 8 | Text scramble | rol en el hero, rota entre 3 títulos | ~30 líneas de JS, ciclo cada 4s |
| 9 | Nav: sección activa | nav | `IntersectionObserver` sobre las secciones |
| 10 | Transición de modal | detalle de case study | `transform: scale(.98) → 1` + fade del backdrop, 240ms |

**Regla de accesibilidad:** todo lo anterior va envuelto en
`@media (prefers-reduced-motion: no-preference)`. Con `reduce`, el contenido aparece estático y
completo — el reveal por palabra debe dejar el texto visible, nunca oculto. Ninguna animación
supera 400ms ni bloquea la lectura.

---

## 7. Arquitectura técnica

### Archivos

```
index.html              una página, HTML semántico
assets/css/main.css      tokens → base → layout → componentes → utilidades
assets/js/data.js        los 6 case studies como datos, con texto es/en
assets/js/i18n.js        diccionario, toggle, persistencia
assets/js/main.js        nav, reveal, contadores, tilt, marquee, modal, formulario
.nojekyll                sirve el sitio estático sin procesar
cv/CVRodolfoBravo.pdf    se conserva
images/favicon.ico       se conserva
uploads/avatar.png       se conserva → se usa como retrato en «Sobre mí»
```

Se borran: `style.css`, `css/`, `js/` (28 archivos), `mail/`, `index.md`, `_config.yml`,
`uploads/banner-01.jpg`, `uploads/gallery_img-0*.jpg`, `images/prettyPhoto/`, `fonts/`.
Todo queda recuperable en el historial de git.

### Contenido data-driven

Los case studies viven en `data.js` como un array de objetos:

```js
{
  id: 'rag-knowledge',
  category: 'rag',                    // rag | agents | llmops | product | documents | integrations
  es: { title, tagline, problem, solution, impact: [], learned },
  en: { title, tagline, problem, solution, impact: [], learned },
  stack: ['Next.js', 'Python', 'pgvector', 'AWS Bedrock'],
  architecture: ['Ingesta', 'Chunking', 'Embeddings', 'Retrieval + rerank', 'LLM', 'Citas'],
  link: null                          // null si es privado o NDA
}
```

`main.js` renderiza las cartas y el modal desde este array. Añadir o editar un proyecto es
modificar un objeto, no tocar HTML en dos lugares ni en dos idiomas.

### Internacionalización

- El HTML estático lleva `data-i18n="clave"`; para atributos, `data-i18n-attr="placeholder:clave"`.
- `i18n.js` contiene el diccionario `{ es: {...}, en: {...} }`.
- Idioma inicial: `localStorage.lang` si existe; si no, `navigator.language.startsWith('es')`
  → `es`, en otro caso `en`.
- Al cambiar: se recorren los nodos con `data-i18n`, se actualiza `document.documentElement.lang`,
  se re-renderizan las cartas de case studies, y se persiste la elección.
- El toggle es un `<button>` con `aria-pressed`, no un select.

### Modal accesible

Focus trap dentro del modal, cierre con `Esc` y con clic en el backdrop, `role="dialog"` +
`aria-modal="true"` + `aria-labelledby`, el foco vuelve a la carta que lo abrió, y el scroll del
`body` se bloquea mientras está abierto.

### Formulario

`<form action="https://formspree.io/f/[FORMSPREE_ID]" method="POST">`, envío por `fetch` con
estados de carga/éxito/error anunciados en un contenedor `aria-live="polite"`. Validación nativa
de HTML5 con mensajes propios. Junto al formulario, accesos directos a email, LinkedIn, GitHub y
descarga de CV — porque un recruiter apurado usa esos, no el formulario.

### Accesibilidad

Skip link al contenido principal; `:focus-visible` visible en todo lo interactivo; contraste AA
verificado en cada par de colores; navegación completa por teclado; `<meta viewport>` **sin**
`maximum-scale` ni `user-scalable=no`; jerarquía de encabezados sin saltos; `alt` descriptivo.

### SEO y metadatos

`<title>` y `<meta description>` reales; Open Graph y Twitter Card con `og:image` de 1200×630;
JSON-LD de tipo `Person` con `jobTitle: "AI Engineer"` y `knowsAbout` poblado con los términos
que buscan los recruiters (RAG, LLM, Next.js, AWS, Angular, Stripe); `canonical`.

### Rendimiento

Sin frameworks ni build. Tres archivos JS sin minificar (~15 KB en total), un CSS (~20 KB).
Fuentes con `preconnect` + `display=swap`. Imágenes con `width`/`height` explícitos y
`loading="lazy"`. Sin librerías de animación: todo con CSS y `rAF`.

---

## 8. Contenido: textos definitivos

### 8.1 Hero

**ES**
- Kicker: `AI ENGINEER · 7 AÑOS EN PRODUCCIÓN · REMOTO`
- H1: `Construyo IA que sobrevive a producción.` (la palabra *sobrevive* en acento)
- Párrafo: `Siete años desarrollando software, los últimos [X] enfocados en sistemas con LLMs: RAG, agentes con herramientas y evaluación continua. No demos — sistemas con usuarios reales, costos bajo control y observabilidad.`
- CTAs: `Ver casos de estudio` · `Descargar CV` · `Escríbeme`
- Rol rotando (scramble): `AI Engineer` / `LLM Systems Engineer` / `AI Solutions Architect`

**EN**
- Kicker: `AI ENGINEER · 7 YEARS SHIPPING · REMOTE`
- H1: `I build AI that survives production.`
- Párrafo: `Seven years building software, the last [X] focused on LLM systems: RAG, tool-using agents, and continuous evaluation. Not demos — systems with real users, costs under control, and observability.`
- CTAs: `View case studies` · `Download CV` · `Get in touch`

Badge de disponibilidad: `Disponible para proyectos` / `Available for work`, con punto verde.

### 8.2 Barra de credibilidad

| Valor | ES | EN |
|---|---|---|
| `7` | Años construyendo software | Years building software |
| `[XX]` | Sistemas con LLM en producción | LLM systems in production |
| `3` | Clouds en producción · AWS, GCP, Azure | Clouds in production · AWS, GCP, Azure |
| `[XX]k` | Usuarios impactados | Users impacted |

### 8.3 Case studies

Los seis, con la estructura Problema → Solución → Stack → Impacto → Aprendizaje.

---

#### 1. Asistente de conocimiento interno con RAG — *categoría: rag*

**EN:** Internal knowledge assistant (RAG)

- **Problema (ES):** El equipo de soporte de [Empresa] consultaba documentación repartida en
  [X] fuentes distintas. Cada respuesta tomaba [XX] minutos y variaba según quién la contestara.
- **Solución:** Pipeline de ingesta con chunking semántico y metadatos por fuente, embeddings en
  pgvector, recuperación híbrida (vectorial + palabra clave) con reranking, y respuestas con cita
  obligatoria al documento origen. Streaming de tokens al cliente para percepción de inmediatez.
- **Arquitectura:** Ingesta → Chunking → Embeddings → Retrieval híbrido → Reranking → LLM → Citas
- **Stack:** Next.js (App Router, streaming), Python/FastAPI, PostgreSQL + pgvector, AWS Bedrock,
  Redis
- **Impacto:** tiempo de respuesta −[XX]%; [XX]% de respuestas con cita verificable;
  [XX] consultas al mes
- **Aprendizaje:** El reranking aportó más precisión que cambiar a un modelo más grande, a una
  fracción del costo. Exigir cita al documento origen eliminó las alucinaciones reportadas por
  los usuarios.

---

#### 2. Agente operativo con function calling — *categoría: agents*

**EN:** Operational agent with tool use

- **Problema:** Un proceso interno de [XX] pasos manuales entre el CRM, correo y hojas de cálculo
  consumía [XX] horas por semana del equipo de operaciones.
- **Solución:** Agente con herramientas tipadas y atómicas, límite máximo de pasos por ejecución,
  confirmación humana obligatoria antes de cualquier acción irreversible, reintentos idempotentes,
  y traza completa de cada ejecución para auditoría.
- **Arquitectura:** Trigger → Planificación → Herramientas tipadas → Gate humano → Ejecución → Traza
- **Stack:** Claude API (tool use), Node.js/TypeScript, Angular (panel de control),
  Azure Functions, colas
- **Impacto:** [XX] horas por semana recuperadas; [XX]% de ejecuciones completadas sin
  intervención humana; cero acciones irreversibles no autorizadas
- **Aprendizaje:** El diseño de las herramientas pesa más que el prompt. Herramientas atómicas e
  idempotentes convirtieron los fallos en reintentos seguros en lugar de en incidentes.

---

#### 3. Plataforma de evaluación y observabilidad de LLM — *categoría: llmops*

**EN:** LLM evaluation & observability platform

- **Problema:** Cada cambio de prompt o de modelo era una apuesta. No existía forma de saber si
  una versión mejoraba o empeoraba antes de que los usuarios lo notaran.
- **Solución:** Dataset dorado de [XX] casos representativos; evaluaciones automáticas de
  exactitud, fundamentación en la fuente y conformidad de formato; LLM-as-judge con rúbrica
  explícita para criterios subjetivos; gate en CI que bloquea el despliegue si el score baja del
  umbral; dashboards de latencia p95, costo por request y tasa de error por versión.
- **Arquitectura:** Dataset dorado → Suite de evals → LLM-as-judge → Gate en CI → Dashboards
- **Stack:** Python, pytest, OpenTelemetry, Azure AI Foundry, GitHub Actions, dashboard en Next.js
- **Impacto:** regresiones detectadas antes de producción; incidentes en producción −[XX]%;
  decisiones de modelo tomadas con datos y no por intuición
- **Aprendizaje:** Sin evaluaciones, "mejoramos el prompt" es una opinión. Esta es la pieza que
  más falta en los equipos que están adoptando IA, y la que convierte un prototipo en un producto.

---

#### 4. Feature de IA monetizada con billing por uso — *categoría: product*

**EN:** Monetized AI feature with usage-based billing

- **Problema:** La funcionalidad de IA era el mayor costo variable del producto y no se cobraba
  aparte. Los usuarios más intensivos generaban margen negativo.
- **Solución:** Medición de tokens por request mapeada a un sistema de créditos, Stripe metered
  billing con webhooks idempotentes, límites y alertas de consumo por plan, y caché semántica que
  reutiliza respuestas equivalentes para reducir el costo por llamada.
- **Arquitectura:** Request → Conteo de tokens → Créditos → Stripe metered → Alertas + límites
- **Stack:** Stripe (metered billing, webhooks), Next.js, GCP Cloud Run, PostgreSQL
- **Impacto:** costo de IA por usuario −[XX]%; la feature pasó de centro de costo a representar
  [XX]% del MRR
- **Aprendizaje:** El costo por token es una decisión de producto, no solo de infraestructura.
  Instrumentar el consumo desde el primer día es más barato que reconstruirlo después.

---

#### 5. Extracción documental estructurada — *categoría: documents*

**EN:** Structured document extraction

- **Problema:** [XX] documentos al mes ([tipo: facturas / expedientes / contratos]) capturados a
  mano, con [XX]% de error de captura y un rezago constante.
- **Solución:** OCR seguido de extracción con LLM forzada a un esquema estricto, validación del
  resultado contra el esquema antes de persistir, score de confianza por campo, y enrutamiento
  automático de los documentos de baja confianza a una cola de revisión humana.
- **Arquitectura:** OCR → Extracción con schema → Validación → Score de confianza → Revisión humana
- **Stack:** Python, Google Document AI, Claude API (structured outputs), GCP, Angular (cola de
  revisión)
- **Impacto:** [XX]% de documentos procesados sin intervención; tiempo por documento de [XX]
  minutos a [XX] segundos; error de captura −[XX]%
- **Aprendizaje:** Validar contra esquema y enrutar la baja confianza a un humano es lo que hace
  la diferencia entre una demo y algo que un área operativa acepta usar todos los días.

---

#### 6. Automatización conversacional multicanal — *categoría: integrations*

**EN:** Multichannel conversational automation

- **Problema:** [XX] mensajes diarios en WhatsApp e Instagram quedaban sin atender fuera de
  horario, con [XX]% de leads perdidos por falta de respuesta.
- **Solución:** Asistente con memoria de conversación por contacto, criterios explícitos de
  escalamiento a humano, plantillas aprobadas por Meta para mensajes iniciados por el negocio, y
  bandeja unificada donde el equipo retoma cualquier conversación con todo el contexto.
- **Arquitectura:** Webhook Meta → Contexto de conversación → LLM → Criterio de handoff →
  Bandeja unificada
- **Stack:** WhatsApp Cloud API, Meta Graph API, Node.js, Angular, AWS Lambda, DynamoDB
- **Impacto:** primera respuesta en menos de [XX] segundos, 24/7; [XX]% de conversaciones
  resueltas sin intervención humana; leads calificados +[XX]%
- **Aprendizaje:** Un criterio de escalamiento a humano bien definido es lo que impide que el
  bot dañe la relación con el cliente. Saber cuándo *no* responder es parte del diseño.

---

### 8.4 Stack

Seis grupos. Cada tecnología lleva contexto de uso, nunca un porcentaje.

**IA y LLMs** — Claude API, OpenAI API, RAG (embeddings, pgvector, recuperación híbrida,
reranking), function calling / tool use, structured outputs, caché semántica, ingeniería de prompts

**LLMOps y evaluación** — datasets dorados, LLM-as-judge, gates de evaluación en CI,
OpenTelemetry, trazas por request, tracking de costo por token

**Frontend** — Next.js (App Router, RSC, streaming de respuestas LLM), Angular, React,
TypeScript, SASS

**Backend** — Node.js, Python (FastAPI, Flask), PostgreSQL + pgvector, MySQL, MSSQL, Redis, colas

**Cloud y DevOps** — AWS (Bedrock, Lambda, S3, DynamoDB), Google Cloud (Cloud Run, Document AI),
Azure (Functions, AI Foundry), Docker, GitHub Actions

**Pagos e integraciones** — Stripe (metered billing, webhooks, suscripciones), Meta Graph API,
WhatsApp Cloud API

Ejemplo del formato de una entrada destacada:
`Next.js — [X] años · App Router, streaming de respuestas LLM, RSC`

### 8.5 Cómo llevo IA a producción

Título ES: `Cómo llevo IA a producción` · EN: `How I ship AI to production`

Diagrama de arquitectura de referencia (HTML + CSS, no imagen):

```
Cliente → API Gateway → Orquestador ─┬─ Retrieval (pgvector + rerank)
                                     ├─ Herramientas / Function calling
                                     └─ Proveedor LLM (+ modelo de respaldo)
                                            ↓
                          Evals · Trazas · Costo por token · Caché
```

Cuatro principios:

1. **Evaluar antes de desplegar.** Dataset dorado y gate en CI. Si el score baja, no sale.
2. **El costo es un requisito, no una sorpresa.** Presupuesto por token, caché semántica y
   enrutamiento al modelo más pequeño que resuelva la tarea.
3. **Fallar bien.** Timeouts, reintentos con backoff, degradación explícita y modelo de respaldo.
   Un proveedor caído no debe tumbar el producto.
4. **Observar todo.** Traza por request, latencia p95, fundamentación de la respuesta y costo por
   usuario. Lo que no se mide no se puede mejorar ni defender.

### 8.6 Experiencia

Timeline de 7 años, de 2019 a 2026. Estructura por entrada: periodo, rol, empresa, y de una a tres
líneas de logro con verbo de acción y resultado.

Entradas con marcadores a completar:

- `2019–20XX` · [Rol] · [Empresa] — inicio en desarrollo web tras titularse en Ingeniería Electrónica
- `20XX–20XX` · [Rol] · [Empresa] — fullstack con React/Angular y APIs
- `20XX–20XX` · [Rol] · [Empresa] — primeras integraciones cloud y de pagos
- `20XX–2026` · AI Engineer · [Empresa] — sistemas con LLMs en producción

La narrativa debe presentar la transición como progresión deliberada: electrónica dio el
pensamiento de sistemas y restricciones, el desarrollo fullstack dio la capacidad de entregar
producto completo, y la IA es la especialización sobre esas dos bases. Nunca como cambio de rumbo.

### 8.7 Sobre mí

**ES:** `Soy Ingeniero Electrónico y llevo siete años construyendo software. La electrónica me
dejó una forma de pensar que sigo usando todos los días: todo sistema tiene restricciones —
latencia, costo, energía, tolerancia a fallos — y el trabajo consiste en diseñar dentro de ellas.
Hoy aplico exactamente eso a sistemas con LLMs, donde las restricciones son el costo por token,
la latencia y la confiabilidad de un modelo que no es determinista. Me interesa la parte que suele
quedar sin resolver: llevar la IA del prototipo a algo que aguante usuarios reales.`

**EN:** `I'm an Electronics Engineer and I've spent seven years building software. Electronics left
me with a way of thinking I still use every day: every system has constraints — latency, cost,
power, fault tolerance — and the work is designing within them. Today I apply exactly that to LLM
systems, where the constraints are cost per token, latency, and the reliability of a model that
isn't deterministic. I'm drawn to the part that usually goes unsolved: taking AI from prototype to
something that holds up with real users.`

Layout: retrato (`uploads/avatar.png`) en columna estrecha con tratamiento de duotono en CSS
(escala de grises + mezcla con el acento), texto en la columna ancha. En móvil el retrato va
arriba, con altura acotada.

### 8.8 Contacto

**ES:** `¿Tienes un rol o un proyecto de IA en mente?` — `Respondo en menos de 24 horas.`
**EN:** `Have an AI role or project in mind?` — `I reply within 24 hours.`

Campos: nombre, email, empresa (opcional), mensaje. Accesos directos: `[EMAIL_PUBLICO]`,
LinkedIn, GitHub, y descarga de CV.

**Nota:** el email queda como marcador a propósito. Rodolfo debe decidir si publica su correo
laboral actual o uno personal — un correo con dominio de su empleador en un portafolio de búsqueda
de empleo es una señal que puede no querer dar.

---

## 9. Verificación

No hay framework de tests en el proyecto, así que la verificación es manual y explícita. Todos
los puntos deben confirmarse antes de considerar el trabajo terminado:

1. Consola del navegador sin errores ni warnings.
2. Toggle ES/EN: cambia **todos** los textos, incluidos los case studies renderizados, los
   placeholders del formulario y el atributo `lang` del documento.
3. La preferencia de idioma persiste al recargar.
4. Los 6 modales abren, cierran con `Esc`, cierran con clic en backdrop, y devuelven el foco.
5. Navegación completa con teclado: `Tab` recorre en orden lógico, el foco siempre es visible.
6. Con `prefers-reduced-motion: reduce` activo, todo el contenido es visible y legible sin animación.
7. Responsive verificado a 360px, 768px, 1024px y 1440px, sin scroll horizontal.
8. Zoom al 200% sin pérdida de contenido.
9. Lighthouse ≥ 95 en Performance y ≥ 95 en Accessibility.
10. Formulario: estados de carga, éxito y error se anuncian correctamente.
11. Búsqueda global de `[XX]` y `[Empresa]` — se documenta cuántos marcadores quedan por sustituir.

---

## 10. Fuera de alcance

- Framework, bundler o generador de sitios estáticos.
- Blog o sección de artículos.
- Modo claro. El sitio es oscuro por diseño.
- Analítica de terceros.
- Tests automatizados.
- Actualizar el PDF del CV (responsabilidad de Rodolfo).

---

## 11. Acciones que dependen de Rodolfo

Estas quedan documentadas en el `README.md` del proyecto al terminar la implementación:

| # | Acción | Urgencia |
|---|---|---|
| 1 | **Revocar o rotar la API key de Google Maps** expuesta en el repo | Inmediata |
| 2 | Sustituir los marcadores `[XX]` y `[Empresa]` con datos reales | Antes de publicar |
| 3 | Crear cuenta en Formspree y pegar el ID del formulario | Antes de publicar |
| 4 | Actualizar el CV en PDF: 7 años y perfil AI Engineer | Antes de publicar |
| 5 | Poner las URLs reales de LinkedIn y GitHub | Antes de publicar |
| 5b | Decidir el email público (`[EMAIL_PUBLICO]`): personal o laboral | Antes de publicar |
| 6 | Generar `og-image.png` de 1200×630 | Deseable |
| 7 | Verificar que los proyectos con NDA queden correctamente anonimizados | Antes de publicar |
