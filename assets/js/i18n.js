(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.I18n = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DICT = {
    es: {
      'a11y.skip': 'Ir al contenido',
      'a11y.langToggle': 'Cambiar idioma a inglés',
      'a11y.menu': 'Abrir menú de navegación',
      'a11y.closeModal': 'Cerrar detalle del proyecto',

      'nav.landmark': 'Principal',
      'nav.work': 'Casos',
      'nav.stack': 'Stack',
      'nav.production': 'Producción',
      'nav.experience': 'Experiencia',
      'nav.about': 'Sobre mí',
      'nav.contact': 'Contacto',

      'hero.kicker': 'AI Engineer · 7 años construyendo software · [XX] en sistemas de IA',
      'hero.roleLabel': 'Rol',
      'hero.available': 'Disponible para proyectos',
      'hero.h1a': 'Construyo IA que',
      'hero.h1accent': 'sobrevive',
      'hero.h1b': 'a producción.',
      'hero.lede': 'Siete años desarrollando software, los últimos [XX] enfocados en sistemas con LLMs: RAG, agentes con herramientas y evaluación continua. No demos — sistemas con usuarios reales, costos bajo control y observabilidad.',
      'hero.endToEnd': 'Del retrieval al checkout: diseño el sistema completo, no solo la llamada al modelo.',
      'hero.ctaWork': 'Ver casos de estudio',
      'hero.ctaCv': 'Descargar CV',
      'hero.ctaMail': 'Escríbeme',

      'proof.years': 'Años construyendo software',
      'proof.systems': 'Sistemas con LLM en producción',
      'proof.clouds': 'Clouds en producción · AWS, GCP, Azure',
      'proof.users': 'Usuarios impactados',

      'work.kicker': 'Casos de estudio',
      'work.title': 'Sistemas con LLMs que llegaron a usuarios reales.',
      'work.lede': 'Cada caso incluye el problema, la arquitectura, el stack y el impacto medido. Haz clic para ver el detalle completo.',
      'work.filterAll': 'Todos',
      'work.filterRag': 'RAG',
      'work.filterAgents': 'Agentes',
      'work.filterLlmops': 'LLMOps',
      'work.filterProduct': 'Producto',
      'work.filterDocuments': 'Documentos',
      'work.filterIntegrations': 'Integraciones',
      'work.readMore': 'Ver caso completo',
      'work.private': 'Proyecto privado',
      'work.labelProblem': 'Problema',
      'work.labelSolution': 'Solución',
      'work.labelArchitecture': 'Arquitectura',
      'work.labelStack': 'Stack',
      'work.labelImpact': 'Impacto',
      'work.labelLearned': 'Lo que aprendí',

      'stack.kicker': 'Stack',
      'stack.title': 'Lo que uso, y para qué lo uso.',
      'stack.lede': 'Sin porcentajes de autoevaluación: cada tecnología con el contexto real en el que la he usado.',
      'stack.groupAi': 'IA y LLMs',
      'stack.groupLlmops': 'LLMOps y evaluación',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupCloud': 'Cloud y DevOps',
      'stack.groupPayments': 'Pagos e integraciones',

      'production.kicker': 'Método',
      'production.title': 'Cómo llevo IA a producción.',
      'production.lede': 'La diferencia entre un prototipo que impresiona en una demo y un sistema que aguanta usuarios reales está en cuatro decisiones.',
      'production.p1t': 'Evaluar antes de desplegar',
      'production.p1d': 'Dataset dorado y gate en CI. Si el score baja del umbral, el cambio no sale. Sin evaluaciones, «mejoramos el prompt» es una opinión.',
      'production.p2t': 'El costo es un requisito, no una sorpresa',
      'production.p2d': 'Presupuesto por token, caché semántica y enrutamiento al modelo más pequeño que resuelva la tarea. Instrumentar el consumo desde el día uno es más barato que reconstruirlo después.',
      'production.p3t': 'Fallar bien',
      'production.p3d': 'Timeouts, reintentos con backoff, degradación explícita y modelo de respaldo. Un proveedor caído no debe tumbar el producto.',
      'production.p4t': 'Observar todo',
      'production.p4d': 'Traza por request, latencia p95, fundamentación de la respuesta y costo por usuario. Lo que no se mide no se puede mejorar ni defender.',
      'production.diagramLabel': 'Arquitectura de referencia',

      'experience.kicker': 'Trayectoria',
      'experience.title': 'Siete años, una dirección.',
      'experience.lede': 'De la electrónica al software, y del software a los sistemas con IA. Cada etapa construida sobre la anterior.',

      'about.kicker': 'Sobre mí',
      'about.title': 'Ingeniero antes que programador.',
      'about.body': 'Soy Ingeniero Electrónico y llevo siete años construyendo software. La electrónica me dejó una forma de pensar que sigo usando todos los días: todo sistema tiene restricciones — latencia, costo, energía, tolerancia a fallos — y el trabajo consiste en diseñar dentro de ellas. Hoy aplico exactamente eso a sistemas con LLMs, donde las restricciones son el costo por token, la latencia y la confiabilidad de un modelo que no es determinista. Me interesa la parte que suele quedar sin resolver: llevar la IA del prototipo a algo que aguante usuarios reales.',
      'about.portraitAlt': 'Retrato de Rodolfo Bravo',

      'contact.kicker': 'Contacto',
      'contact.title': '¿Tienes un rol o un proyecto de IA en mente?',
      'contact.lede': 'Respondo en menos de 24 horas.',
      'contact.name': 'Nombre',
      'contact.email': 'Correo',
      'contact.company': 'Empresa (opcional)',
      'contact.message': 'Cuéntame del rol o del proyecto',
      'contact.send': 'Enviar mensaje',
      'contact.sending': 'Enviando…',
      'contact.success': 'Mensaje enviado. Te respondo en menos de 24 horas.',
      'contact.error': 'No se pudo enviar. Escríbeme directo por correo.',
      'contact.orDirect': 'O directo, sin formulario:',

      'footer.rights': 'Todos los derechos reservados.',
      'footer.built': 'Sitio hecho a mano en HTML, CSS y JavaScript. Sin frameworks.'
    },
    en: {
      'a11y.skip': 'Skip to content',
      'a11y.langToggle': 'Switch language to Spanish',
      'a11y.menu': 'Open navigation menu',
      'a11y.closeModal': 'Close project detail',

      'nav.landmark': 'Main',
      'nav.work': 'Work',
      'nav.stack': 'Stack',
      'nav.production': 'Production',
      'nav.experience': 'Experience',
      'nav.about': 'About',
      'nav.contact': 'Contact',

      'hero.kicker': 'AI Engineer · 7 years building software · [XX] in AI systems',
      'hero.roleLabel': 'Role',
      'hero.available': 'Available for work',
      'hero.h1a': 'I build AI that',
      'hero.h1accent': 'survives',
      'hero.h1b': 'production.',
      'hero.lede': 'Seven years building software, the last [XX] focused on LLM systems: RAG, tool-using agents, and continuous evaluation. Not demos — systems with real users, costs under control, and observability.',
      'hero.endToEnd': 'From retrieval to checkout: I design the whole system, not just the model call.',
      'hero.ctaWork': 'View case studies',
      'hero.ctaCv': 'Download CV',
      'hero.ctaMail': 'Get in touch',

      'proof.years': 'Years building software',
      'proof.systems': 'LLM systems in production',
      'proof.clouds': 'Clouds in production · AWS, GCP, Azure',
      'proof.users': 'Users impacted',

      'work.kicker': 'Case studies',
      'work.title': 'LLM systems that reached real users.',
      'work.lede': 'Each case includes the problem, the architecture, the stack, and the measured impact. Click for the full detail.',
      'work.filterAll': 'All',
      'work.filterRag': 'RAG',
      'work.filterAgents': 'Agents',
      'work.filterLlmops': 'LLMOps',
      'work.filterProduct': 'Product',
      'work.filterDocuments': 'Documents',
      'work.filterIntegrations': 'Integrations',
      'work.readMore': 'Read full case',
      'work.private': 'Private project',
      'work.labelProblem': 'Problem',
      'work.labelSolution': 'Solution',
      'work.labelArchitecture': 'Architecture',
      'work.labelStack': 'Stack',
      'work.labelImpact': 'Impact',
      'work.labelLearned': 'What I learned',

      'stack.kicker': 'Stack',
      'stack.title': 'What I use, and what I use it for.',
      'stack.lede': 'No self-rated percentages: every technology with the real context I have used it in.',
      'stack.groupAi': 'AI and LLMs',
      'stack.groupLlmops': 'LLMOps and evaluation',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupCloud': 'Cloud and DevOps',
      'stack.groupPayments': 'Payments and integrations',

      'production.kicker': 'Method',
      'production.title': 'How I ship AI to production.',
      'production.lede': 'The difference between a prototype that impresses in a demo and a system that holds up with real users comes down to four decisions.',
      'production.p1t': 'Evaluate before deploying',
      'production.p1d': 'Golden dataset and a CI gate. If the score drops below threshold, the change does not ship. Without evals, "we improved the prompt" is an opinion.',
      'production.p2t': 'Cost is a requirement, not a surprise',
      'production.p2d': 'Per-token budget, semantic caching, and routing to the smallest model that solves the task. Instrumenting spend on day one is cheaper than rebuilding it later.',
      'production.p3t': 'Fail well',
      'production.p3d': 'Timeouts, retries with backoff, explicit degradation, and a fallback model. A provider outage should not take the product down.',
      'production.p4t': 'Observe everything',
      'production.p4d': 'Per-request traces, p95 latency, answer groundedness, and cost per user. What is not measured cannot be improved or defended.',
      'production.diagramLabel': 'Reference architecture',

      'experience.kicker': 'Track record',
      'experience.title': 'Seven years, one direction.',
      'experience.lede': 'From electronics to software, and from software to AI systems. Each stage built on the one before it.',

      'about.kicker': 'About',
      'about.title': 'Engineer before programmer.',
      'about.body': "I'm an Electronics Engineer and I've spent seven years building software. Electronics left me with a way of thinking I still use every day: every system has constraints — latency, cost, power, fault tolerance — and the work is designing within them. Today I apply exactly that to LLM systems, where the constraints are cost per token, latency, and the reliability of a model that isn't deterministic. I'm drawn to the part that usually goes unsolved: taking AI from prototype to something that holds up with real users.",
      'about.portraitAlt': 'Portrait of Rodolfo Bravo',

      'contact.kicker': 'Contact',
      'contact.title': 'Have an AI role or project in mind?',
      'contact.lede': 'I reply within 24 hours.',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.company': 'Company (optional)',
      'contact.message': 'Tell me about the role or the project',
      'contact.send': 'Send message',
      'contact.sending': 'Sending…',
      'contact.success': 'Message sent. I reply within 24 hours.',
      'contact.error': 'Could not send. Email me directly instead.',
      'contact.orDirect': 'Or reach me directly:',

      'footer.rights': 'All rights reserved.',
      'footer.built': 'Hand-built in HTML, CSS and JavaScript. No frameworks.'
    }
  };

  var LANGS = ['es', 'en'];

  function t(lang, key) {
    var table = DICT[lang] || DICT.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : key;
  }

  function detect(stored, navLang) {
    if (LANGS.indexOf(stored) !== -1) return stored;
    return String(navLang || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  function apply(rootEl, lang) {
    var count = 0;

    var nodes = rootEl.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(lang, nodes[i].getAttribute('data-i18n'));
      count++;
    }

    // data-i18n-attr="placeholder:contact.name" o varios separados por coma
    var attrNodes = rootEl.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var pairs = attrNodes[j].getAttribute('data-i18n-attr').split(',');
      for (var k = 0; k < pairs.length; k++) {
        var parts = pairs[k].split(':');
        if (parts.length !== 2) continue;
        attrNodes[j].setAttribute(parts[0].trim(), t(lang, parts[1].trim()));
        count++;
      }
    }

    if (rootEl.tagName === 'HTML') rootEl.lang = lang;
    return count;
  }

  return { DICT: DICT, LANGS: LANGS, t: t, detect: detect, apply: apply };
});
