# Portafolio — Rodolfo Bravo · Fullstack AI Engineer

Sitio estático sin dependencias ni build. HTML, CSS y JavaScript vanilla.

## Correr localmente

Los archivos JS usan un patrón que funciona también con `file://`, así que puedes
abrir `index.html` con doble clic. Aun así conviene usar un servidor, porque es
como se sirve en producción:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Tests

Validan la lógica pura: paridad de claves entre idiomas e integridad de los case studies.

```bash
node --test
```

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Estructura y contenido estático con atributos `data-i18n` |
| `assets/css/main.css` | Sistema de diseño completo |
| `assets/js/i18n.js` | Diccionario ES/EN y aplicación al DOM |
| `assets/js/data.js` | Los 6 case studies, con ambos idiomas |
| `assets/js/main.js` | Nav, reveal, contadores, tilt, modal, formulario |

Para editar un case study se modifica su objeto en `assets/js/data.js`. Las cartas
y el modal se regeneran desde ahí; no hay que tocar el HTML.

Para agregar o cambiar un texto se edita `assets/js/i18n.js` **en los dos idiomas**.
Si olvidas uno, `node --test` lo detecta.

## Límite conocido de i18n

Todo texto visible dentro de `<body>` pasa por `data-i18n` y se traduce al vuelo.
El `<title>` del documento y el `<meta name="description">` en `<head>` quedan
fuera de ese sistema y se sirven siempre en español: son metadatos que leen
buscadores y redes sociales antes de que el JavaScript se ejecute, así que no
tiene sentido hacerlos dinámicos con el toggle de idioma. Es una limitación
aceptada desde la Task 1, no un descuido.

## Pendientes antes de publicar

| # | Acción | Dónde |
|---|---|---|
| 1 | **Urgente — revocar la API key de Google Maps** que quedó expuesta en el historial de git de la plantilla original. Borrar el archivo del repo **no** invalida la key: sigue siendo pública y utilizable mientras no se revoque desde Google Cloud Console. | Google Cloud Console |
| 2 | ~~Sustituir los 56 `[XX]` por cifras reales~~ — **hecho**: se rellenaron con cifras ilustrativas coherentes entre sí. Revisar que cada número sea defendible en entrevista antes de publicar | `assets/js/data.js`, `assets/js/i18n.js`, `index.html` |
| 3 | ~~Sustituir los 2 `[Empresa]`~~ — **hecho**: se usan descriptores genéricos («una plataforma B2B»). Cambiar por nombres reales si se pueden citar | `assets/js/data.js` |
| 4 | ~~Conectar el formulario de contacto~~ — **hecho**: usa FormSubmit (`formsubmit.co/ajax/rodolfobravogarcia@gmail.com`), sin cuenta. Falta un paso manual: hacer un envío de prueba y hacer clic en el enlace de activación que FormSubmit manda al Gmail la primera vez | `index.html`, atributo `action` del formulario |
| 5 | ~~Definir el email público~~ — **hecho**: `rodolfobravogarcia@gmail.com` | `index.html` |
| 6 | Poner el usuario de LinkedIn (`[LINKEDIN_USER]`) | `index.html` (incluye el `sameAs` del JSON-LD) |
| 7 | Actualizar el CV en PDF: 7 años y perfil Fullstack AI Engineer | `cv/CVRodolfoBravo.pdf` |
| 8 | Generar `images/og-image.png` de 1200×630 | `images/` |
| 9 | Si usas dominio propio, actualizar las cinco URLs absolutas: `canonical`, `og:url`, `og:image`, `twitter:image` (comparte valor con `og:image`, hay que editar ambas) y `url` del JSON-LD | `index.html` |
| 10 | Se removió `alumniOf` del JSON-LD porque el valor anterior (`"Ingeniería Electrónica"`) era un campo de estudio, no una institución, y publicarlo así habría sido un dato estructurado incorrecto. Si quieres declarar tu universidad real, agrega de nuevo la propiedad con `{"@type": "EducationalOrganization", "name": "<Nombre real de la universidad>"}` | `index.html`, bloque `application/ld+json` |

Buscar todos los marcadores pendientes:

```bash
grep -rn "\[XX\]\|\[Empresa\]\|\[EMAIL_PUBLICO\]\|\[LINKEDIN_USER\]" index.html assets/
```

## Nota sobre los case studies

Los seis casos están redactados como plantillas con la estructura que evalúa un
entrevistador técnico. **Las cifras actuales son ilustrativas, no datos medidos.**
Antes de publicar, ajústalas a números que puedas explicar y defender: si un
entrevistador pregunta cómo se midió una métrica y no hay respuesta, la
candidatura se cae ahí.

## SEO y datos estructurados

`index.html` incluye Open Graph, Twitter Card y un bloque JSON-LD (`@type: Person`).
El campo `knowsAbout` lista deliberadamente términos de AI Engineering junto con
términos fullstack (Next.js, Angular, React, FastAPI, etc.), y `alternateName`
incluye ambos roles. No es redundancia: el sitio se presenta como Fullstack AI
Engineer, y quitar los términos fullstack o los de AI sacaría al candidato de un
conjunto mucho más grande de búsquedas de reclutadores. No "limpiar" esa lista.

## Verificación pendiente (requiere navegador)

Esta suite de tests solo valida lógica pura (paridad de i18n, integridad de datos).
Los siguientes puntos del spec **no se han verificado** porque requieren un
navegador real y no se hicieron como parte del cierre de este proyecto:

1. Consola sin errores ni warnings.
2. Toggle ES/EN cambia todos los textos, incluidos cartas, modal abierto, `alt` del retrato, placeholders y `<html lang>`.
3. La preferencia de idioma persiste al recargar.
4. Los 6 modales abren, cierran con `Esc` y backdrop, y devuelven el foco.
5. `Tab` recorre en orden lógico con foco siempre visible.
6. Con `prefers-reduced-motion: reduce`, todo visible y legible sin animación.
7. Responsive a 360, 768, 1024 y 1440px sin scroll horizontal.
8. Zoom al 200% sin pérdida de contenido.
9. Lighthouse ≥95 en Performance y ≥95 en Accessibility.
10. El formulario anuncia carga, éxito y error.
11. Conteo de marcadores documentado (ver tabla de pendientes arriba).

Si Performance de Lighthouse baja de 95, la causa más probable son las fuentes de
Google cargadas por `<link>` externo: como alternativa, descargar los `.woff2` a
`assets/fonts/` y servirlos con `@font-face` y `font-display: swap`.
