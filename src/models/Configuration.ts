import { ConfigurationLoader } from './ConfigLoader';
import { ConfigurationState } from './ConfigurationState';

export class Configuration {
  /**
   * Lista de loaders
   * * Esta lista debe ir de menos a mas prioridad, para que asi el ultimo sobrescriba los valores anteriores
   */
  private loaders: ConfigurationLoader[] = [];

  private state: ConfigurationState = new ConfigurationState();

  constructor(...loaders: ConfigurationLoader[]) {
    this.loaders = loaders;
  }

  private getLoaders(source: ConfigurationLoader[]): ConfigurationLoader[] {
    return source.sort((a, b) => a.priority - b.priority);
  }

  public addLoader(loader: ConfigurationLoader): void {
    this.loaders.push(loader);
  }

  public load(): ConfigurationState {
    for (const loader of this.getLoaders(this.loaders)) {
      loader.load(this.state);
    }

    return this.state;
  }

  public getState(): ConfigurationState {
    return this.state;
  }
}
