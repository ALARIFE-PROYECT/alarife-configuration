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

      /**
       * @alarife/commander sera quien configure la relacion entre argv y env
       */

      // Object.keys(envConfig).forEach((key) => {
      //   const appConfig = appConfigurationMap.find((config) => config.envKey === key);

      //   state.setProperty({ argKey: appConfig?.argKey, envKey: key, value: envConfig[key] });
      // });
    }
  }
}

export class ArgvConfigurationLoader implements ConfigurationLoader {
  load(state: ConfigurationState): void {
    /**
     * No existe mapeo de configuraciones todo estara mapeado por @alarife/commander
     * Lo que este retorne es lo correcto y se llevara al ConfigurationState
     */


    // const args = process.argv.slice(2);
    // appConfigurationMap.forEach(({ argKey, envKey, defaultValue, argvType }) => {
    //   const argvElement = args.find((arg) => arg.startsWith(`--${argKey}`));
    //   if (argvElement) {
    //     if (argvType === 'boolean') {
    //       state.setProperty({ argKey, envKey, value: true });
    //     } else {
    //       const [, value] = argvElement.split('=');
    //       state.setProperty({ argKey, envKey, value: value ?? defaultValue });
    //     }
    //   }
    // });
  }
}

export class DefaultConfigurationLoader implements ConfigurationLoader {
  load(state: ConfigurationState): void {
    /**
     * @alarife/commander tendra configurado los valores por defecto, solo hay que leer los ARGV
     */

    // appConfigurationMap.forEach(({ argKey, envKey, defaultValue }) => {
    //   if (!!defaultValue) {
    //     state.setProperty({ argKey, envKey, value: defaultValue });
    //   }
    // });
  }
}
