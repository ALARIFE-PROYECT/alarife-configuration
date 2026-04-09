import { ConfigurationPostLoader, SecureConfigurationPostLoader } from './ConfigPostLoader';
import {
  ArgvConfigurationLoader,
  ConfigurationLoader,
  DefaultConfigurationLoader,
  EnvConfigurationLoader
} from './ConfigLoader';
import { ConfigurationState } from './ConfigurationState';

export class Configuration {
  /**
   * Lista de loaders
   * * Esta lista debe ir de menos a mas prioridad, para que asi el ultimo sobrescriba los valores anteriores
   */
  private loaders: ConfigurationLoader[] = [
    new DefaultConfigurationLoader(), // prioridad 0
    new EnvConfigurationLoader(), // prioridad 1
    new ArgvConfigurationLoader() // prioridad 2
  ];

  private postLoaders: ConfigurationPostLoader[] = [
    new SecureConfigurationPostLoader() // prioridad 0
  ];

  private state: ConfigurationState = new ConfigurationState();

  constructor() {
    this.load();
  }

  private load(): void {
    for (const loader of this.loaders) {
      loader.load(this.state);
    }

    for (const postLoader of this.postLoaders) {
      postLoader.load(this.state);
    }
  }

  getProperty(key: string): any {
    return this.state.getProperty(key);
  }

  toString(): string {
    return JSON.stringify(this.state, null, 2);
  }
}
