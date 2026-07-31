const { test } = require('node:test');
const assert = require('node:assert');
const I18n = require('../assets/js/i18n.js');

test('t devuelve la traducción de la clave', () => {
  assert.strictEqual(I18n.t('es', 'nav.work'), 'Casos');
  assert.strictEqual(I18n.t('en', 'nav.work'), 'Work');
});

test('t devuelve la clave cuando no existe la traducción', () => {
  assert.strictEqual(I18n.t('es', 'clave.inexistente'), 'clave.inexistente');
});

test('detect prioriza el valor guardado', () => {
  assert.strictEqual(I18n.detect('en', 'es-MX'), 'en');
  assert.strictEqual(I18n.detect('es', 'en-US'), 'es');
});

test('detect ignora valores guardados inválidos', () => {
  assert.strictEqual(I18n.detect('fr', 'en-US'), 'en');
  assert.strictEqual(I18n.detect('', 'es-MX'), 'es');
});

test('detect cae al navegador cuando no hay valor guardado', () => {
  assert.strictEqual(I18n.detect(null, 'es-MX'), 'es');
  assert.strictEqual(I18n.detect(null, 'en-GB'), 'en');
  assert.strictEqual(I18n.detect(null, 'pt-BR'), 'en');
  assert.strictEqual(I18n.detect(null, undefined), 'en');
});

test('los diccionarios es y en tienen exactamente las mismas claves', () => {
  const es = Object.keys(I18n.DICT.es).sort();
  const en = Object.keys(I18n.DICT.en).sort();
  assert.deepStrictEqual(es, en, 'es y en deben tener las mismas claves');
});

test('ninguna traducción está vacía', () => {
  for (const lang of ['es', 'en']) {
    for (const [key, value] of Object.entries(I18n.DICT[lang])) {
      assert.ok(String(value).trim().length > 0, `${lang}.${key} está vacía`);
    }
  }
});
