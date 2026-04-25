import { ConfigurationLoader } from '../../src/models/ConfigLoader';
import { ConfigurationState } from '../../src/models/ConfigurationState';

export class DefaultConfigurationLoader extends ConfigurationLoader {
  public priority: number = 1;

  constructor(private command: { name: string; options: any[] }) {
    super();
  }

  load(state: ConfigurationState): void {
    this.command.options.forEach((option) => {
      state.setProperty({ argv: option.name, shortArgv:option.shortName, env: option.env, value: option.defaultValue });
    });
  }
}

export class ArgvConfigurationLoader extends ConfigurationLoader {
  public priority: number = 3;

  constructor(private command: { name: string; options: any[]; value: Record<string, any> }) {
    super();
  }

  load(state: ConfigurationState): void {
    this.command.options.forEach((option) => {
      state.setProperty({ argv: option.name, shortArgv: option.shortName, env: option.env, value: this.command.value[option.name] });
    });
  }
}
