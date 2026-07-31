(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CaseStudies = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return [
    {
      id: 'rag-knowledge',
      category: 'rag',
      stack: ['Next.js', 'Python / FastAPI', 'PostgreSQL + pgvector', 'AWS Bedrock', 'Redis'],
      architecture: ['Ingesta', 'Chunking', 'Embeddings', 'Retrieval híbrido', 'Reranking', 'LLM', 'Citas'],
      link: null,
      es: {
        title: 'Asistente de conocimiento interno con RAG',
        tagline: 'Búsqueda semántica sobre documentación dispersa, con citas verificables.',
        problem: 'El equipo de soporte de [Empresa] consultaba documentación repartida en [XX] fuentes distintas. Cada respuesta tomaba [XX] minutos y variaba según quién la contestara.',
        solution: 'Pipeline de ingesta con chunking semántico y metadatos por fuente, embeddings en pgvector, recuperación híbrida (vectorial más palabra clave) con reranking, y respuestas con cita obligatoria al documento origen. Streaming de tokens al cliente para percepción de inmediatez.',
        impact: [
          'Tiempo de respuesta −[XX]%',
          '[XX]% de respuestas con cita verificable',
          '[XX] consultas al mes'
        ],
        learned: 'El reranking aportó más precisión que cambiar a un modelo más grande, a una fracción del costo. Exigir cita al documento origen eliminó las alucinaciones reportadas por los usuarios.'
      },
      en: {
        title: 'Internal knowledge assistant (RAG)',
        tagline: 'Semantic search over scattered documentation, with verifiable citations.',
        problem: 'The support team at [Empresa] was searching documentation spread across [XX] different sources. Each answer took [XX] minutes and varied depending on who wrote it.',
        solution: 'Ingestion pipeline with semantic chunking and per-source metadata, embeddings in pgvector, hybrid retrieval (vector plus keyword) with reranking, and answers that must cite the source document. Token streaming to the client for perceived immediacy.',
        impact: [
          'Response time −[XX]%',
          '[XX]% of answers carry a verifiable citation',
          '[XX] queries per month'
        ],
        learned: 'Reranking bought more accuracy than switching to a larger model, at a fraction of the cost. Requiring a source citation eliminated the hallucinations users had been reporting.'
      }
    },
    {
      id: 'ops-agent',
      category: 'agents',
      stack: ['Claude API (tool use)', 'Node.js / TypeScript', 'Angular', 'Azure Functions', 'Colas'],
      architecture: ['Trigger', 'Planificación', 'Herramientas tipadas', 'Gate humano', 'Ejecución', 'Traza'],
      link: null,
      es: {
        title: 'Agente operativo con function calling',
        tagline: 'Automatización de un proceso multi-paso con confirmación humana en lo irreversible.',
        problem: 'Un proceso interno de [XX] pasos manuales entre el CRM, correo y hojas de cálculo consumía [XX] horas por semana del equipo de operaciones.',
        solution: 'Agente con herramientas tipadas y atómicas, límite máximo de pasos por ejecución, confirmación humana obligatoria antes de cualquier acción irreversible, reintentos idempotentes, y traza completa de cada ejecución para auditoría.',
        impact: [
          '[XX] horas por semana recuperadas',
          '[XX]% de ejecuciones sin intervención humana',
          'Cero acciones irreversibles no autorizadas'
        ],
        learned: 'El diseño de las herramientas pesa más que el prompt. Herramientas atómicas e idempotentes convirtieron los fallos en reintentos seguros en lugar de en incidentes.'
      },
      en: {
        title: 'Operational agent with tool use',
        tagline: 'Multi-step automation with a human gate on anything irreversible.',
        problem: 'An internal [XX]-step manual process spanning the CRM, email, and spreadsheets consumed [XX] hours per week from the operations team.',
        solution: 'Agent with typed, atomic tools, a hard step limit per run, mandatory human confirmation before any irreversible action, idempotent retries, and a full trace of every run for auditing.',
        impact: [
          '[XX] hours per week recovered',
          '[XX]% of runs completed with no human intervention',
          'Zero unauthorized irreversible actions'
        ],
        learned: 'Tool design matters more than the prompt. Atomic, idempotent tools turned failures into safe retries instead of incidents.'
      }
    },
    {
      id: 'llm-evals',
      category: 'llmops',
      stack: ['Python', 'pytest', 'OpenTelemetry', 'Azure AI Foundry', 'GitHub Actions', 'Next.js'],
      architecture: ['Dataset dorado', 'Suite de evals', 'LLM-as-judge', 'Gate en CI', 'Dashboards'],
      link: null,
      es: {
        title: 'Plataforma de evaluación y observabilidad de LLM',
        tagline: 'Un gate en CI que impide desplegar si la calidad baja del umbral.',
        problem: 'Cada cambio de prompt o de modelo era una apuesta. No existía forma de saber si una versión mejoraba o empeoraba antes de que los usuarios lo notaran.',
        solution: 'Dataset dorado de [XX] casos representativos; evaluaciones automáticas de exactitud, fundamentación en la fuente y conformidad de formato; LLM-as-judge con rúbrica explícita para criterios subjetivos; gate en CI que bloquea el despliegue si el score baja del umbral; dashboards de latencia p95, costo por request y tasa de error por versión.',
        impact: [
          'Regresiones detectadas antes de producción',
          'Incidentes en producción −[XX]%',
          'Decisiones de modelo tomadas con datos'
        ],
        learned: 'Sin evaluaciones, «mejoramos el prompt» es una opinión. Es la pieza que más falta en los equipos que adoptan IA, y la que convierte un prototipo en un producto.'
      },
      en: {
        title: 'LLM evaluation & observability platform',
        tagline: 'A CI gate that blocks deploys when quality drops below threshold.',
        problem: 'Every prompt or model change was a gamble. There was no way to know whether a version was better or worse before users noticed.',
        solution: 'Golden dataset of [XX] representative cases; automated evaluations for accuracy, groundedness, and format conformance; LLM-as-judge with an explicit rubric for subjective criteria; a CI gate that blocks deployment when the score drops below threshold; dashboards for p95 latency, cost per request, and error rate per version.',
        impact: [
          'Regressions caught before production',
          'Production incidents −[XX]%',
          'Model decisions made on data'
        ],
        learned: 'Without evals, "we improved the prompt" is an opinion. This is the piece most missing in teams adopting AI, and the one that turns a prototype into a product.'
      }
    },
    {
      id: 'ai-billing',
      category: 'product',
      stack: ['Stripe (metered billing)', 'Next.js', 'GCP Cloud Run', 'PostgreSQL'],
      architecture: ['Request', 'Conteo de tokens', 'Créditos', 'Stripe metered', 'Alertas y límites'],
      link: null,
      es: {
        title: 'Feature de IA monetizada con billing por uso',
        tagline: 'De centro de costo a línea de ingreso, con el costo por token instrumentado.',
        problem: 'La funcionalidad de IA era el mayor costo variable del producto y no se cobraba aparte. Los usuarios más intensivos generaban margen negativo.',
        solution: 'Medición de tokens por request mapeada a un sistema de créditos, Stripe metered billing con webhooks idempotentes, límites y alertas de consumo por plan, y caché semántica que reutiliza respuestas equivalentes para reducir el costo por llamada.',
        impact: [
          'Costo de IA por usuario −[XX]%',
          'La feature pasó a representar [XX]% del MRR',
          'Margen positivo en todos los planes'
        ],
        learned: 'El costo por token es una decisión de producto, no solo de infraestructura. Instrumentar el consumo desde el primer día es más barato que reconstruirlo después.'
      },
      en: {
        title: 'Monetized AI feature with usage-based billing',
        tagline: 'From cost center to revenue line, with cost per token instrumented.',
        problem: 'The AI feature was the product\'s largest variable cost and was not billed separately. Heavy users produced negative margin.',
        solution: 'Per-request token metering mapped to a credit system, Stripe metered billing with idempotent webhooks, per-plan usage limits and alerts, and a semantic cache that reuses equivalent answers to cut cost per call.',
        impact: [
          'AI cost per user −[XX]%',
          'The feature grew to [XX]% of MRR',
          'Positive margin across every plan'
        ],
        learned: 'Cost per token is a product decision, not just an infrastructure one. Instrumenting spend on day one is cheaper than rebuilding it later.'
      }
    },
    {
      id: 'doc-extraction',
      category: 'documents',
      stack: ['Python', 'Google Document AI', 'Claude API (structured outputs)', 'GCP', 'Angular'],
      architecture: ['OCR', 'Extracción con schema', 'Validación', 'Score de confianza', 'Revisión humana'],
      link: null,
      es: {
        title: 'Extracción documental estructurada',
        tagline: 'PDF a JSON validado, con revisión humana solo donde hace falta.',
        problem: '[XX] documentos al mes ([tipo de documento]) capturados a mano, con [XX]% de error de captura y un rezago constante.',
        solution: 'OCR seguido de extracción con LLM forzada a un esquema estricto, validación del resultado contra el esquema antes de persistir, score de confianza por campo, y enrutamiento automático de los documentos de baja confianza a una cola de revisión humana.',
        impact: [
          '[XX]% de documentos procesados sin intervención',
          'Tiempo por documento de [XX] min a [XX] s',
          'Error de captura −[XX]%'
        ],
        learned: 'Validar contra esquema y enrutar la baja confianza a un humano es lo que hace la diferencia entre una demo y algo que un área operativa acepta usar todos los días.'
      },
      en: {
        title: 'Structured document extraction',
        tagline: 'PDF to validated JSON, with human review only where it is needed.',
        problem: '[XX] documents per month ([document type]) captured by hand, with a [XX]% capture error rate and a constant backlog.',
        solution: 'OCR followed by schema-constrained LLM extraction, validation against the schema before persisting, per-field confidence scoring, and automatic routing of low-confidence documents to a human review queue.',
        impact: [
          '[XX]% of documents processed with no intervention',
          'Time per document from [XX] min to [XX] s',
          'Capture errors −[XX]%'
        ],
        learned: 'Validating against a schema and routing low confidence to a human is what separates a demo from something an operations team will actually use every day.'
      }
    },
    {
      id: 'omnichannel-bot',
      category: 'integrations',
      stack: ['WhatsApp Cloud API', 'Meta Graph API', 'Node.js', 'Angular', 'AWS Lambda', 'DynamoDB'],
      architecture: ['Webhook Meta', 'Contexto de conversación', 'LLM', 'Criterio de handoff', 'Bandeja unificada'],
      link: null,
      es: {
        title: 'Automatización conversacional multicanal',
        tagline: 'WhatsApp e Instagram atendidos 24/7, con escalamiento a humano bien definido.',
        problem: '[XX] mensajes diarios en WhatsApp e Instagram quedaban sin atender fuera de horario, con [XX]% de leads perdidos por falta de respuesta.',
        solution: 'Asistente con memoria de conversación por contacto, criterios explícitos de escalamiento a humano, plantillas aprobadas por Meta para mensajes iniciados por el negocio, y bandeja unificada donde el equipo retoma cualquier conversación con todo el contexto.',
        impact: [
          'Primera respuesta en menos de [XX] segundos, 24/7',
          '[XX]% de conversaciones resueltas sin humano',
          'Leads calificados +[XX]%'
        ],
        learned: 'Un criterio de escalamiento a humano bien definido es lo que impide que el bot dañe la relación con el cliente. Saber cuándo no responder es parte del diseño.'
      },
      en: {
        title: 'Multichannel conversational automation',
        tagline: 'WhatsApp and Instagram covered 24/7, with a well-defined human handoff.',
        problem: '[XX] daily messages on WhatsApp and Instagram went unanswered outside business hours, losing [XX]% of leads to slow response.',
        solution: 'Assistant with per-contact conversation memory, explicit human-escalation criteria, Meta-approved templates for business-initiated messages, and a unified inbox where the team picks up any conversation with full context.',
        impact: [
          'First response under [XX] seconds, 24/7',
          '[XX]% of conversations resolved without a human',
          'Qualified leads +[XX]%'
        ],
        learned: 'A well-defined human handoff is what keeps the bot from damaging the customer relationship. Knowing when not to answer is part of the design.'
      }
    }
  ];
});
