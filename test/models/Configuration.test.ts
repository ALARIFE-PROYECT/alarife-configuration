import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Configuration } from '../../src/models/Configuration';
import { ConfigurationLoader } from '../../src/models/ConfigLoader';
import { ConfigurationState } from '../../src/models/ConfigurationState';
import { DefaultConfigurationLoader, ArgvConfigurationLoader } from '../mock/mock-loaders';

describe('Configuration', () => {
  // Verifica que los loaders se ejecutan en orden de prioridad (menor a mayor).
  it('loaders execute in ascending priority order', () => {
    const calls: string[] = [];

    class RecorderLoader extends ConfigurationLoader {
      public priority: number;
      constructor(
        public id: string,
        priority: number
      ) {
        super();
        this.priority = priority;
      }

      load(_state: ConfigurationState): void {
        calls.push(this.id);
      }
    }

    const cfg = new Configuration();

    // Add loaders in mixed order; configuration should sort by priority when loading
    cfg.addLoader(new RecorderLoader('middle', 2));
    cfg.addLoader(new RecorderLoader('high', 3));
    cfg.addLoader(new RecorderLoader('low', 1));

    cfg.load();

    assert.deepStrictEqual(calls, ['low', 'middle', 'high']);
  });

  // Comprueba que un loader con mayor prioridad sobrescribe el valor establecido por uno de menor prioridad.
  it('higher priority loader overrides lower priority value', () => {
    const option = { name: 'debug', shortName: 'd', env: 'DEBUG_MODE', defaultValue: false };
    const defaultCommand = { name: 'run', options: [option] };
    const argvCommand = { name: 'run', options: [option], value: { debug: true } };

    const cfg = new Configuration();
    cfg.addLoader(new DefaultConfigurationLoader(defaultCommand));
    cfg.addLoader(new ArgvConfigurationLoader(argvCommand));

    cfg.load();

    const finalValue = cfg.getState().getProperty('DEBUG_MODE');
    assert.strictEqual(finalValue, true);
  });
});
