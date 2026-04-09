import dotenv from 'dotenv';

import { NODE_ENV } from '../constants';
import { ConfigurationState } from './ConfigurationState';

export interface ConfigurationLoader {
  load(state: ConfigurationState): void;
}

export class EnvConfigurationLoader implements ConfigurationLoader {
  private loadEnvFile(path: string): Record<string, string> {
    const configResult = dotenv.config({ path });
    return configResult.parsed || {};
  }

  load(state: ConfigurationState): void {
    const environment = state.getProperty(NODE_ENV);
    if (environment) {
      const envConfig = this.loadEnvFile(`.env.${environment}`);
      Object.keys(envConfig).forEach((key) => {
        const appConfig = appConfigurationMap.find((config) => config.envKey === key);

        state.setProperty({ argKey: appConfig?.argKey, envKey: key, value: envConfig[key] });
      });
    }
  }
}

export class ArgvConfigurationLoader implements ConfigurationLoader {
  load(state: ConfigurationState): void {
    const args = process.argv.slice(2);
    appConfigurationMap.forEach(({ argKey, envKey, defaultValue, argvType }) => {
      const argvElement = args.find((arg) => arg.startsWith(`--${argKey}`));
      if (argvElement) {
        if (argvType === 'boolean') {
          state.setProperty({ argKey, envKey, value: true });
        } else {
          const [, value] = argvElement.split('=');
          state.setProperty({ argKey, envKey, value: value ?? defaultValue });
        }
      }
    });
  }
}

export class DefaultConfigurationLoader implements ConfigurationLoader {
  load(state: ConfigurationState): void {
    appConfigurationMap.forEach(({ argKey, envKey, defaultValue }) => {
      if (!!defaultValue) {
        state.setProperty({ argKey, envKey, value: defaultValue });
      }
    });
  }
}
