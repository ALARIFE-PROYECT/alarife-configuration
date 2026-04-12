import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigurationState } from '../../src/models/ConfigurationState';

describe('ConfigurationState', () => {
  let state: ConfigurationState;

  beforeEach(() => {
    state = new ConfigurationState();
  });

  describe('duplicate key rejection', () => {
    // Debe lanzar error cuando una key nueva pertenece a una propiedad diferente ya registrada
    it('should throw when a new key collides with a key from a different property', () => {
      state.setProperty({ key: ['PORT'], value: 3000 });
      state.setProperty({ key: ['HOST'], value: 'localhost' });

      assert.throws(
        () => state.setProperty({ key: ['PORT', 'HOST'], value: 'x' }),
        { message: "Duplicate key: 'HOST'" },
      );
    });

    // Debe lanzar error cuando alguna de las keys del nuevo source colisiona con una key de otra propiedad
    it('should throw when any key in the new source collides with a key of another property', () => {
      state.setProperty({ key: ['HOST', 'h'], value: 'localhost' });
      state.setProperty({ key: ['PORT'], value: 3000 });

      // Encuentra la propiedad HOST vía 'h', pero 'PORT' pertenece a otra propiedad
      assert.throws(
        () => state.setProperty({ key: ['h', 'PORT'], value: 9090 }),
        { message: "Duplicate key: 'PORT'" },
      );
    });
  });

  describe('setProperty – update value', () => {
    // Debe actualizar el valor de una propiedad existente cuando se comparte al menos una key
    it('should update the value of an existing property that shares a key', () => {
      state.setProperty({ key: ['PORT'], value: 3000 });
      state.setProperty({ key: ['PORT', 'p'], value: 8080 });

      assert.equal(state.getProperty('PORT'), 8080);
    });

    // Debe poder leer el valor actualizado a través de cualquier alias
    it('should reflect the updated value through all aliases', () => {
      state.setProperty({ key: ['DEBUG', 'd'], value: false });
      state.setProperty({ key: ['DEBUG', 'd'], value: true });

      assert.equal(state.getProperty('DEBUG'), true);
      assert.equal(state.getProperty('d'), true);
    });
  });

  describe('setProperty – add new keys to existing property', () => {
    // Debe añadir las keys nuevas del source a la propiedad existente
    it('should merge new keys from the incoming source into the existing property', () => {
      state.setProperty({ key: ['PORT'], value: 3000 });
      state.setProperty({ key: ['PORT', 'p'], value: 3000 });

      assert.equal(state.getProperty('p'), 3000);
    });

    // Las keys originales deben seguir siendo accesibles tras el merge
    it('should keep original keys accessible after merging new ones', () => {
      state.setProperty({ key: ['HOST'], value: 'localhost' });
      state.setProperty({ key: ['HOST', 'h', 'hostname'], value: '0.0.0.0' });

      assert.equal(state.getProperty('HOST'), '0.0.0.0');
      assert.equal(state.getProperty('h'), '0.0.0.0');
      assert.equal(state.getProperty('hostname'), '0.0.0.0');
    });

    // Tras el merge, las keys añadidas deben estar protegidas contra duplicados futuros
    it('should reject a duplicate after merged keys have been indexed', () => {
      state.setProperty({ key: ['PORT'], value: 3000 });
      state.setProperty({ key: ['PORT', 'p'], value: 3000 });

      // 'p' pertenece a PORT; una propiedad diferente (HOST) intenta usar 'p'
      assert.throws(
        () => state.setProperty({ key: ['HOST', 'p'], value: 'x' }),
        { message: "Cannot add new key(s) [HOST]: missing existing key(s) [PORT]" },
      );
    });
  });

  describe('getProperty – retrieve by any key', () => {
    // Debe devolver undefined si la key no existe
    it('should return undefined for a non-existent key', () => {
      assert.equal(state.getProperty('MISSING'), undefined);
    });

    // Debe devolver el valor correcto al buscar por cualquiera de las keys registradas
    it('should return the correct value when queried by any registered key', () => {
      state.setProperty({ key: ['DEBUG', 'd', 'DEBUG_MODE'], value: true });

      assert.equal(state.getProperty('DEBUG'), true);
      assert.equal(state.getProperty('d'), true);
      assert.equal(state.getProperty('DEBUG_MODE'), true);
    });
  });

  describe('ConfigurationState export/import', () => {
        it('exports state as JSON and imports into a new Configuration preserving values', () => {
          const state = new ConfigurationState();
          state.setProperty({ key: ['DEBUG', 'd', 'DEBUG_MODE'], value: true });

          const exported = state.export();

          state.import(exported);
    
          const finalValue = state.getProperty('DEBUG_MODE');
          assert.strictEqual(finalValue, true);
        });
    
        // Debe lanzar un error si se intenta importar una cadena JSON inválida.
        it('throws on invalid JSON during import', () => {
          const state = new ConfigurationState();
          assert.throws(() => state.import('not-a-json'), /Failed to import configuration state:/);
        });
  });
});