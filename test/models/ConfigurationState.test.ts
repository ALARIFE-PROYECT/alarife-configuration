import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigurationState } from '../../src/models/ConfigurationState';

describe('ConfigurationState', () => {
  let state: ConfigurationState;

  beforeEach(() => {
    state = new ConfigurationState();
  });

  describe('duplicate key rejection', () => {
    it('throws when attempting to change an existing key of the same type', () => {
      state.setProperty({ argv: 'port', env: 'PORT', value: 3000 });
      state.setProperty({ argv: 'host', value: 'localhost' });

      assert.throws(
        () => state.setProperty({ argv: 'port', env: 'PORT_1', value: 'x' }),
        { message: "Cannot change env from 'PORT' to 'PORT_1'" },
      );
    });

    it('throws when attempting to change the argv of a matched property', () => {
      state.setProperty({ env: 'PORT', argv: 'port', value: 3000 });

      assert.throws(
        () => state.setProperty({ env: 'PORT', argv: 'newPort', value: 4000 }),
        { message: "Cannot change argv from 'port' to 'newPort'" },
      );
    });
  });

  describe('setProperty – update value', () => {
    it('should update the value of an existing property that shares a key', () => {
      state.setProperty({ argv: 'PORT', value: 3000 });
      state.setProperty({ argv: 'PORT', shortArgv: 'p', value: 8080 });

      assert.equal(state.getProperty('PORT'), 8080);
    });

    it('should reflect the updated value through all aliases', () => {
      state.setProperty({ argv: 'DEBUG', shortArgv: 'd', value: false });
      state.setProperty({ argv: 'DEBUG', shortArgv: 'd', value: true });

      assert.equal(state.getProperty('DEBUG'), true);
      assert.equal(state.getProperty('d'), true);
    });
  });

  describe('setProperty – add new keys to existing property', () => {
    it('should merge new keys from the incoming source into the existing property', () => {
      state.setProperty({ argv: 'PORT', value: 3000 });
      state.setProperty({ argv: 'PORT', shortArgv: 'p', value: 3000 });

      assert.equal(state.getProperty('p'), 3000);
    });

    it('should keep original keys accessible after merging new ones', () => {
      state.setProperty({ env: 'HOST', value: 'localhost' });
      state.setProperty({ env: 'HOST', argv: 'hostname', shortArgv: 'h', value: '0.0.0.0' });

      assert.equal(state.getProperty('HOST'), '0.0.0.0');
      assert.equal(state.getProperty('hostname'), '0.0.0.0');
      assert.equal(state.getProperty('h'), '0.0.0.0');
    });

    it('should reject changing an existing key after keys have been merged', () => {
      state.setProperty({ argv: 'PORT', value: 3000 });
      state.setProperty({ argv: 'PORT', shortArgv: 'p', value: 3000 });

      assert.throws(
        () => state.setProperty({ argv: 'HOST', shortArgv: 'p', value: 'x' }),
        { message: "Cannot change argv from 'PORT' to 'HOST'" },
      );
    });
  });

  describe('getProperty – retrieve by any key', () => {
    it('should return undefined for a non-existent key', () => {
      assert.equal(state.getProperty('MISSING'), undefined);
    });

    it('should return the correct value when queried by any registered key', () => {
      state.setProperty({ argv: 'DEBUG', shortArgv: 'd', env: 'DEBUG_MODE', value: true });

      assert.equal(state.getProperty('DEBUG'), true);
      assert.equal(state.getProperty('d'), true);
      assert.equal(state.getProperty('DEBUG_MODE'), true);
    });
  });

  describe('ConfigurationState export/import', () => {
    it('exports state as JSON and imports into a new Configuration preserving values', () => {
      const s1 = new ConfigurationState();
      s1.setProperty({ argv: 'DEBUG', shortArgv: 'd', env: 'DEBUG_MODE', value: true });

      const exported = s1.export();

      const s2 = new ConfigurationState();
      s2.import(exported);

      const finalValue = s2.getProperty('DEBUG_MODE');
      assert.strictEqual(finalValue, true);
    });

    it('throws on invalid JSON during import', () => {
      const s = new ConfigurationState();
      assert.throws(() => s.import('not-a-json'), /Failed to import configuration state:/);
    });
  });
});