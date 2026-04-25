import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CtxStore } from '../../src/service/CtxStore';

describe('CtxStore', () => {
  // Verifica que la clase CtxStore se inicialice correctamente con un JSON válido en CONFIGURATION_STATE
  it('initializes with valid JSON in CONFIGURATION_STATE', () => {
    process.env.CONFIGURATION_STATE = JSON.stringify([
        { argv: 'port', env: 'PORT', value: 3000 },
        { argv: 'debug', env: 'DEBUG_MODE', value: false }
      ]);

    const ctxStoreInstance = new CtxStore();

    assert.deepStrictEqual(ctxStoreInstance.toArray(), [
      { argv: 'port', env: 'PORT', value: 3000 },
      { argv: 'debug', env: 'DEBUG_MODE', value: false }
    ]);
  });

  // Verifica que la clase CtxStore no inicialice con un JSON inválido en CONFIGURATION_STATE
  it('does not initialize with invalid JSON in CONFIGURATION_STATE', () => {
    process.env.CONFIGURATION_STATE = '[]';

    const ctxStoreInstance = new CtxStore();

    assert.deepStrictEqual(ctxStoreInstance.toArray(), []);
  });

  // Verifica que la clase CtxStore no inicialice si CONFIGURATION_STATE no está definida
  it('does not initialize if CONFIGURATION_STATE is undefined', () => {
    delete process.env.CONFIGURATION_STATE;

    const ctxStoreInstance = new CtxStore();

    assert.deepStrictEqual(ctxStoreInstance.toArray(), []);
  });
});