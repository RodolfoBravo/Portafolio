const { test } = require('node:test');
const assert = require('node:assert');
const CaseStudies = require('../assets/js/data.js');

const CATEGORIES = ['rag', 'agents', 'llmops', 'product', 'documents', 'integrations'];
const LANG_FIELDS = ['title', 'tagline', 'problem', 'solution', 'learned'];

test('hay exactamente 6 case studies', () => {
  assert.strictEqual(CaseStudies.length, 6);
});

test('los ids son únicos', () => {
  const ids = CaseStudies.map(c => c.id);
  assert.strictEqual(new Set(ids).size, 6, 'hay ids duplicados: ' + ids.join(', '));
});

test('cada categoría válida aparece una vez', () => {
  const cats = CaseStudies.map(c => c.category).sort();
  assert.deepStrictEqual(cats, [...CATEGORIES].sort());
});

test('cada case study tiene stack y arquitectura no vacíos', () => {
  for (const c of CaseStudies) {
    assert.ok(Array.isArray(c.stack) && c.stack.length >= 3, `${c.id}: stack insuficiente`);
    assert.ok(Array.isArray(c.architecture) && c.architecture.length >= 3, `${c.id}: arquitectura insuficiente`);
  }
});

test('cada case study tiene los dos idiomas completos', () => {
  for (const c of CaseStudies) {
    for (const lang of ['es', 'en']) {
      assert.ok(c[lang], `${c.id}: falta el bloque ${lang}`);
      for (const field of LANG_FIELDS) {
        assert.ok(String(c[lang][field] || '').trim().length > 0, `${c.id}.${lang}.${field} está vacío`);
      }
      assert.ok(Array.isArray(c[lang].impact) && c[lang].impact.length >= 2,
        `${c.id}.${lang}.impact necesita al menos 2 entradas`);
    }
  }
});

test('ningún case study contiene HTML crudo en sus textos', () => {
  // Los textos se insertan vía innerHTML al construir cartas y modal, así que
  // una etiqueta suelta rompería el layout. Este test la detecta antes.
  // stack y architecture también se interpolan en innerHTML (chip() en las
  // cartas, y architecture en el modal), así que deben cubrirse también.
  for (const c of CaseStudies) {
    for (const lang of ['es', 'en']) {
      const blob = [c[lang].title, c[lang].tagline, c[lang].problem,
                    c[lang].solution, c[lang].learned, ...c[lang].impact,
                    c.stack.join(' '), c.architecture.join(' ')].join(' ');
      assert.ok(!/<[a-z/]/i.test(blob), `${c.id}.${lang} contiene HTML crudo`);
    }
  }
});
