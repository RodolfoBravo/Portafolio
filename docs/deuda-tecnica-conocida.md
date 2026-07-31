# Deuda técnica conocida

Lista de puntos menores identificados durante el rediseño y triados como **no
bloqueantes** por la revisión final de rama. Ninguno afecta el funcionamiento, la
accesibilidad medida ni el rendimiento del sitio.

Se documentan aquí para que no se pierdan y para que quien los toque después sepa
que fueron decisiones conscientes, no descuidos.

## Métricas verificadas en navegador (2026-07-31)

Lighthouse desktop, Chrome headless, servido en localhost:

| Categoría | Puntaje |
|---|---|
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

CLS 0.041 · LCP 0.8s · TBT 0ms · cero fallos de accesibilidad · cero errores de consola.

Verificado además con Playwright: los 6 modales abren y cierran con `Escape` y con
clic en el backdrop y devuelven el foco a su carta; el focus trap no se escapa; sin
scroll horizontal a 360, 768, 1024 y 1440px; con `prefers-reduced-motion: reduce`
ningún contenido queda oculto; detección y persistencia de idioma correctas en los
locales `es-MX`, `es-ES`, `en-US` y `pt-BR`.

## Agrupado por tipo de arreglo

### Higiene de tokens

- `.stack__hlTitle` codifica `.875rem`, que es exactamente el valor del token
  `--fs-small`. Debería referenciar el token.
- El rojo de error del formulario es el literal `#F87171`. El set de tokens ya tiene
  `--live` para estado positivo; falta un `--error` que complete el par.
- `.diagram__node` y `.modal__archStep` son el mismo patrón de chip monoespaciado
  declarado dos veces. Dos instancias todavía no son un patrón; si aparece una
  tercera, conviene unificarlas.

### Rendimiento y retención

- El observer de reveal no deja de observar las cartas antes de que `renderCards`
  reemplace el contenido del grid, así que un cambio de idioma deja hasta 6 nodos
  desprendidos retenidos por el observer. Acotado y sin efecto visible.
- `bindTilt` llama a `getBoundingClientRect()` en cada `pointermove` en lugar de
  cachear el rect en `pointerenter`. Fuerza una lectura de layout por frame mientras
  el cursor está sobre una carta.
- `getAttribute('action')` se lee dos veces en `initForm` sin cachear.
- `initMarquee` no es idempotente: una segunda llamada volvería a duplicar el track
  y rompería el `translateX(-50%)`. Hoy `ready()` dispara una sola vez.

### Detalles de accesibilidad de bajo impacto

- El `aria-label` del botón de menú móvil no distingue entre abierto y cerrado. El
  estado lo comunica correctamente `aria-expanded`, así que la etiqueta es
  complementaria.
- El orden de tabulación del menú móvil pone el toggle de idioma antes de los
  enlaces recién desplegados, porque `#navLinks` precede a `.nav__actions` en el
  DOM. Los enlaces siguen siendo alcanzables con `Shift+Tab`. `Escape` tampoco
  cierra el menú.
- `og:locale` usa el regional `es_MX` mientras `<html lang>` usa el genérico `es`.
  Sirven propósitos distintos y ninguno es incorrecto.

### Estructura y limpieza

- `initNav()` agrupa tres responsabilidades (menú, barra de progreso, sección
  activa). Aceptable a este tamaño.
- El cómputo de la etiqueta de categoría está duplicado entre `renderCards` y
  `buildModalHtml`. Extraerlo a un helper y añadir un test que verifique que las
  seis categorías resuelven a una clave real cerraría permanentemente el riesgo de
  la concatenación de strings.
- `splitWords` emitiría un span de palabra vacío si una traducción estuviera vacía.
  No alcanzable con el diccionario actual.
- `I18n.apply` devuelve el número de operaciones de traducción, no de nodos, cuando
  un elemento tiene varios pares en `data-i18n-attr`. Ningún consumidor lee el valor
  de retorno.
- `:focus-visible` declara un `border-radius: 2px` que casi nunca se aplica: todo
  componente con radio propio lo declara después con igual especificidad y gana.
- `.card` conserva `text-align: left` y `width: 100%`, restos de cuando era un
  `<button>`. Además, al ser toda la carta clicable, seleccionar texto dentro de una
  carta abre el modal al soltar el ratón.
- `initForm` llama a `checkValidity()`/`reportValidity()`, pero el formulario no
  tiene `novalidate`, así que la validación nativa actúa antes. Es redundancia
  inofensiva: o se añade `novalidate` y se asume el control de los mensajes, o se
  eliminan esas dos líneas.
- El test de ordenamiento del grid en `tests/main.test.js` parsea el HTML generado
  por `renderCards` con una expresión regular. Coincide con la salida actual, pero
  es frágil si cambia la forma del markup.

### Fuera del objetivo declarado

- Por debajo de unos 343px de ancho de viewport aparece scroll horizontal, porque
  varios grids usan `minmax(320px, 1fr)`. El objetivo del spec es 360px, que sí se
  cumple. `minmax(min(320px, 100%), 1fr)` lo resolvería sin coste.
- El `<title>` y el `<meta description>` no cambian de idioma: viven fuera del
  sistema de i18n del DOM porque se leen antes de que corra el JavaScript.

## Decisiones tomadas, no deuda

Se registran para que no se "corrijan" por error más adelante:

- **`.kicker` usa el color de acento en las siete secciones, no solo en el hero.**
  La regla de un solo acento significa un solo *color* de acento, no un solo uso.
  Coincide con el mockup aprobado.
- **Los marcadores `[XX]`, `[Empresa]`, `[Rol]` y compañía son visibles a propósito.**
  Son la lista de trabajo pendiente del dueño del sitio, y destacan en lugar de
  disimularse. Ver la tabla de pendientes del `README.md`.
- **Los roles del timeline son idénticos en ambos idiomas** porque su contenido es
  `[Rol] · [Empresa]`, sin texto traducible. Las descripciones sí se traducen.
- **El límite de duración de animaciones es por tipo de movimiento**, no único:
  interacción ≤250ms, entrada ≤700ms, loops ambientales sin límite pero obligados a
  estar gateados por `prefers-reduced-motion`. Un pulso de 400ms sería un parpadeo
  agresivo, peor para accesibilidad.
- **La barra de progreso de scroll se implementó solo en JavaScript**, sin la vía
  CSS `animation-timeline`. Un único camino de código en lugar de dos.
