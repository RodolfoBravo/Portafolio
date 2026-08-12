(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.I18n = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DICT = {
    es: {
      'a11y.skip': 'Ir al contenido',
      'a11y.langToggle': 'ES/EN — cambiar idioma a inglés',
      'a11y.menu': 'Abrir menú de navegación',
      'a11y.closeModal': 'Cerrar detalle del proyecto',
      'a11y.metrics': 'Métricas',
      'a11y.filters': 'Filtros',
      'a11y.carousel': 'Casos de estudio, carrusel',
      'a11y.prev': 'Casos anteriores',
      'a11y.next': 'Casos siguientes',
      'a11y.page': 'Página',

      'nav.landmark': 'Principal',
      'nav.work': 'Casos',
      'nav.stack': 'Stack',
      'nav.production': 'Producción',
      'nav.about': 'Sobre mí',
      'nav.contact': 'Contacto',

      'hero.kicker': 'Fullstack AI Engineer · 7 años construyendo software · 3 en sistemas de IA',
      'hero.roleLabel': 'Rol',
      'hero.available': 'Disponible para proyectos',
      'hero.h1a': 'Construyo IA que',
      'hero.h1accent': 'sobrevive',
      'hero.h1b': 'a producción.',
      'hero.lede': 'Siete años desarrollando software, los últimos tres enfocados en sistemas con LLMs: RAG, agentes con herramientas y evaluación continua. No demos — sistemas con usuarios reales, costos bajo control y observabilidad.',
      'hero.endToEnd': 'Del retrieval al checkout: diseño el sistema completo, no solo la llamada al modelo.',
      'hero.ctaWork': 'Ver casos de estudio',
      'hero.ctaCv': 'Descargar CV',
      'hero.ctaMail': 'Escríbeme',

      'proof.kicker': 'Evidencia en producción',
      'proof.years': 'Años construyendo software',
      'proof.systems': 'Sistemas con LLM en producción',
      'proof.clouds': 'Clouds en producción · AWS, GCP, Azure',
      'proof.users': 'Usuarios impactados',
      'proof.resultsLabel': 'Resultados medidos en casos de estudio',
      'proof.r1': 'Tiempo de respuesta en RAG',
      'proof.r2': 'Respuestas con cita verificable',
      'proof.r3': 'Costo de IA por usuario',
      'proof.r4': 'Documentos procesados sin intervención',
      'proof.r5': 'Incidentes en producción',
      'proof.r6': 'Leads calificados',

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
      'stack.hl1t': 'Next.js · Angular · React',
      'stack.hl1d': '5 años · App Router, RSC y streaming de respuestas de LLM al cliente. Angular donde el front ya es empresarial.',
      'stack.hl2t': 'Claude · GPT · Gemini',
      'stack.hl2d': 'Tool use, structured outputs y control de costo por token en producción. Copilot dentro del loop de desarrollo.',
      'stack.hl3t': 'Node · .NET · Spring · Python',
      'stack.hl3d': 'Express, .NET 8, Java Spring Boot y Python/FastAPI: entro al backend que ya corre en vez de pedir que lo reescriban.',
      'stack.hl4t': 'AWS · GCP · Azure',
      'stack.hl4d': 'Bedrock, Cloud Run y Document AI, Functions y AI Foundry. Tres nubes, no una demo en cada una.',
      'stack.endToEndKicker': 'Base fullstack',
      'stack.endToEnd': 'Entrego el sistema completo alrededor del modelo, no solo la llamada a la API.',
      'stack.flowFront': 'Frontend',
      'stack.flowApi': 'API',
      'stack.flowData': 'Base de datos',
      'stack.flowPay': 'Pagos',
      'stack.flowShip': 'Despliegue',
      'stack.chipHybrid': 'Retrieval híbrido',
      'stack.chipCache': 'Caché semántica',
      'stack.chipEvalsCi': 'Evals en CI',
      'stack.chipTraces': 'Trazas por request',
      'stack.chipTokenCost': 'Costo por token',
      'stack.groupAi': 'IA y LLMs',
      'stack.groupLlmops': 'LLMOps y evaluación',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupData': 'Bases de datos',
      'stack.groupCloud': 'Cloud y DevOps',
      'stack.groupPayments': 'Pagos e integraciones',

      'production.kicker': 'Método',
      'production.title': 'Cómo llevo IA a producción.',
      'production.lede': 'La diferencia entre un prototipo que impresiona en una demo y un sistema que aguanta usuarios reales está en cuatro decisiones.',
      'production.nodeClient': 'Cliente',
      'production.nodeOrchestrator': 'Orquestador',
      'production.nodeTools': 'Herramientas',
      'production.nodeLlmSub': '+ modelo de respaldo',
      'production.nodeResponse': 'respuesta',
      'production.railLabel': 'Observabilidad',
      'production.livePulse': 'Petición en vivo',
      'production.baseTraces': 'Trazas',
      'production.baseCost': 'Costo por token',
      'production.baseCache': 'Caché',
      'production.p1t': 'Evaluar antes de desplegar',
      'production.p1d': 'Dataset dorado y gate en CI. Si el score baja del umbral, el cambio no sale. Sin evaluaciones, «mejoramos el prompt» es una opinión.',
      'production.p2t': 'El costo es un requisito, no una sorpresa',
      'production.p2d': 'Presupuesto por token, caché semántica y enrutamiento al modelo más pequeño que resuelva la tarea. Instrumentar el consumo desde el día uno es más barato que reconstruirlo después.',
      'production.p3t': 'Fallar bien',
      'production.p3d': 'Timeouts, reintentos con backoff, degradación explícita y modelo de respaldo. Un proveedor caído no debe tumbar el producto.',
      'production.p4t': 'Observar todo',
      'production.p4d': 'Traza por request, latencia p95, fundamentación de la respuesta y costo por usuario. Lo que no se mide no se puede mejorar ni defender.',
      'production.diagramLabel': 'Arquitectura de referencia',
      'production.diagramAlt': 'Esquema de la arquitectura: el cliente llama a un API Gateway, que pasa la petición al orquestador. El orquestador se apoya en tres componentes: retrieval con pgvector y rerank, herramientas vía function calling, y un LLM con modelo de respaldo. La respuesta vuelve al cliente. Un riel de observabilidad atraviesa todas las etapas con evals, trazas, costo por token y caché.',

      'about.kicker': 'Sobre mí',
      'about.title': 'Ingeniero antes que programador.',
      'about.body': 'Soy Ingeniero Electrónico y llevo siete años construyendo software. La electrónica me dejó una forma de pensar que sigo usando todos los días: todo sistema tiene restricciones — latencia, costo, energía, tolerancia a fallos — y el trabajo consiste en diseñar dentro de ellas. Hoy aplico exactamente eso a sistemas con LLMs, donde las restricciones son el costo por token, la latencia y la confiabilidad de un modelo que no es determinista. Me interesa la parte que suele quedar sin resolver: llevar la IA del prototipo a algo que aguante usuarios reales.',
      'about.portraitAlt': 'Retrato de Rodolfo Bravo',
      'about.caption': 'Rodolfo Bravo · Ingeniero Electrónico',
      'about.f1k': 'Trayectoria',
      'about.f1v': '7 años construyendo software',
      'about.f2k': 'Enfoque',
      'about.f2v': 'Sistemas con LLMs en producción',
      'about.f3k': 'Método',
      'about.f3v': 'Diseñar dentro de restricciones',

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

      'footer.rights': 'Todos los derechos reservados.'
    },
    en: {
      'a11y.skip': 'Skip to content',
      'a11y.langToggle': 'ES/EN — switch language to Spanish',
      'a11y.menu': 'Open navigation menu',
      'a11y.closeModal': 'Close project detail',
      'a11y.metrics': 'Metrics',
      'a11y.filters': 'Filters',
      'a11y.carousel': 'Case studies, carousel',
      'a11y.prev': 'Previous cases',
      'a11y.next': 'Next cases',
      'a11y.page': 'Page',

      'nav.landmark': 'Main',
      'nav.work': 'Work',
      'nav.stack': 'Stack',
      'nav.production': 'Production',
      'nav.about': 'About',
      'nav.contact': 'Contact',

      'hero.kicker': 'Fullstack AI Engineer · 7 years building software · 3 in AI systems',
      'hero.roleLabel': 'Role',
      'hero.available': 'Available for work',
      'hero.h1a': 'I build AI that',
      'hero.h1accent': 'survives',
      'hero.h1b': 'production.',
      'hero.lede': 'Seven years building software, the last three focused on LLM systems: RAG, tool-using agents, and continuous evaluation. Not demos — systems with real users, costs under control, and observability.',
      'hero.endToEnd': 'From retrieval to checkout: I design the whole system, not just the model call.',
      'hero.ctaWork': 'View case studies',
      'hero.ctaCv': 'Download CV',
      'hero.ctaMail': 'Get in touch',

      'proof.kicker': 'Production evidence',
      'proof.years': 'Years building software',
      'proof.systems': 'LLM systems in production',
      'proof.clouds': 'Clouds in production · AWS, GCP, Azure',
      'proof.users': 'Users impacted',
      'proof.resultsLabel': 'Measured results from case studies',
      'proof.r1': 'RAG response time',
      'proof.r2': 'Answers with verifiable citation',
      'proof.r3': 'AI cost per user',
      'proof.r4': 'Documents processed with no intervention',
      'proof.r5': 'Production incidents',
      'proof.r6': 'Qualified leads',

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
      'stack.hl1t': 'Next.js · Angular · React',
      'stack.hl1d': '5 years · App Router, RSC, and streaming LLM responses to the client. Angular where the front end is already enterprise.',
      'stack.hl2t': 'Claude · GPT · Gemini',
      'stack.hl2d': 'Tool use, structured outputs, and per-token cost control in production. Copilot inside the development loop.',
      'stack.hl3t': 'Node · .NET · Spring · Python',
      'stack.hl3d': 'Express, .NET 8, Java Spring Boot, and Python/FastAPI: I work inside the backend you already run instead of asking for a rewrite.',
      'stack.hl4t': 'AWS · GCP · Azure',
      'stack.hl4d': 'Bedrock, Cloud Run and Document AI, Functions and AI Foundry. Three clouds, not one demo each.',
      'stack.endToEndKicker': 'Full-stack foundation',
      'stack.endToEnd': 'I ship the whole system around the model, not just the API call.',
      'stack.flowFront': 'Frontend',
      'stack.flowApi': 'API',
      'stack.flowData': 'Database',
      'stack.flowPay': 'Payments',
      'stack.flowShip': 'Deployment',
      'stack.chipHybrid': 'Hybrid retrieval',
      'stack.chipCache': 'Semantic caching',
      'stack.chipEvalsCi': 'Evals in CI',
      'stack.chipTraces': 'Per-request traces',
      'stack.chipTokenCost': 'Cost per token',
      'stack.groupAi': 'AI and LLMs',
      'stack.groupLlmops': 'LLMOps and evaluation',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupData': 'Databases',
      'stack.groupCloud': 'Cloud and DevOps',
      'stack.groupPayments': 'Payments and integrations',

      'production.kicker': 'Method',
      'production.title': 'How I ship AI to production.',
      'production.lede': 'The difference between a prototype that impresses in a demo and a system that holds up with real users comes down to four decisions.',
      'production.nodeClient': 'Client',
      'production.nodeOrchestrator': 'Orchestrator',
      'production.nodeTools': 'Tools',
      'production.nodeLlmSub': '+ fallback model',
      'production.nodeResponse': 'response',
      'production.railLabel': 'Observability',
      'production.livePulse': 'Live request',
      'production.baseTraces': 'Traces',
      'production.baseCost': 'Cost per token',
      'production.baseCache': 'Cache',
      'production.p1t': 'Evaluate before deploying',
      'production.p1d': 'Golden dataset and a CI gate. If the score drops below threshold, the change does not ship. Without evals, "we improved the prompt" is an opinion.',
      'production.p2t': 'Cost is a requirement, not a surprise',
      'production.p2d': 'Per-token budget, semantic caching, and routing to the smallest model that solves the task. Instrumenting spend on day one is cheaper than rebuilding it later.',
      'production.p3t': 'Fail well',
      'production.p3d': 'Timeouts, retries with backoff, explicit degradation, and a fallback model. A provider outage should not take the product down.',
      'production.p4t': 'Observe everything',
      'production.p4d': 'Per-request traces, p95 latency, answer groundedness, and cost per user. What is not measured cannot be improved or defended.',
      'production.diagramLabel': 'Reference architecture',
      'production.diagramAlt': 'Architecture schematic: the client calls an API Gateway, which passes the request to the orchestrator. The orchestrator draws on three components: retrieval with pgvector and rerank, tools via function calling, and an LLM with a fallback model. The response returns to the client. An observability rail runs across every stage with evals, traces, cost per token, and cache.',

      'about.kicker': 'About',
      'about.title': 'Engineer before programmer.',
      'about.body': "I'm an Electronics Engineer and I've spent seven years building software. Electronics left me with a way of thinking I still use every day: every system has constraints — latency, cost, power, fault tolerance — and the work is designing within them. Today I apply exactly that to LLM systems, where the constraints are cost per token, latency, and the reliability of a model that isn't deterministic. I'm drawn to the part that usually goes unsolved: taking AI from prototype to something that holds up with real users.",
      'about.portraitAlt': 'Portrait of Rodolfo Bravo',
      'about.caption': 'Rodolfo Bravo · Electronics Engineer',
      'about.f1k': 'Track record',
      'about.f1v': '7 years building software',
      'about.f2k': 'Focus',
      'about.f2v': 'LLM systems in production',
      'about.f3k': 'Method',
      'about.f3v': 'Designing within constraints',

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

      'footer.rights': 'All rights reserved.'
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
