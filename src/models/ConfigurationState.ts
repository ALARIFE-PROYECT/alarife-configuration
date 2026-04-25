import { env } from 'process';

export interface SourceProperty {
  /**
   * Clave del argumento en linea de comandos.
   *
   * por ejemplo: DEBUG_MODE
   * por ejemplo: node app.js --debug=true
   * por ejemplo: node app.js --debug
   * por ejemplo: node app.js -d
   *
   * argv: 'debug'
   * shortArgv: 'd'
   * env: 'DEBUG_MODE'
   * valor: true
   */
  argv?: string;

  shortArgv?: string;

  env?: string;

  value: any;
}

export class ConfigurationState {
  private keys: Set<string> = new Set();

  protected state: SourceProperty[] = [];

  constructor() {}

  private addKey(existing: SourceProperty, source: SourceProperty, keyType: 'argv' | 'shortArgv' | 'env'): void {
    if (source[keyType] !== existing[keyType]) { // significa que se intenta cambiar el keyType

      // no se permite reasignar keys
      if (existing[keyType] && source[keyType]) { // significa que ya existe un keyType y se intenta cambiar a otro valor
        throw new Error(`Cannot change ${keyType} from '${existing[keyType]}' to '${source[keyType]}'`);
      }

      // Si el source tiene un keyType que el existing no tiene, se agrega ese keyType al existing
      if (source[keyType]) {
        existing[keyType] = source[keyType]; // asigna el nuevo keyType al existing
        this.keys.add(source[keyType]);
      }
    }
  }

  /**
   * Retrieves the value of a property by its key.
   *
   * @param key
   * @returns
   */
  public getProperty(key: string): any {
    const property = this.state.find((prop) => prop.argv === key || prop.shortArgv === key || prop.env === key);
    return property ? property.value : undefined;
  }

  /**
   * Adds or updates a property in the configuration state.
   *
   * @param source
   */
  public setProperty(source: SourceProperty): void {
    // Validate that the source has at least one key (env or argv)
    if (!source.env && !source.argv && !source.shortArgv) {
      throw new Error('Source must have at least one key (env, argv, or shortArgv)');
    }

    // Find property with any of the keys
    const existing = this.state.find(
      (st) =>
        (source.argv && st.argv === source.argv) ||
        (source.shortArgv && st.shortArgv === source.shortArgv) ||
        (source.env && st.env === source.env)
    );

    if (existing) {
      this.addKey(existing, source, 'argv');
      this.addKey(existing, source, 'shortArgv');
      this.addKey(existing, source, 'env');

      existing.value = source.value;
    } else {
      // Add new property
      this.state.push(source);

      // Index the new property
      if (source.argv) {
        this.keys.add(source.argv);
      }

      if (source.shortArgv) {
        this.keys.add(source.shortArgv);
      }

      if (source.env) {
        this.keys.add(source.env);
      }
    }
  }

  /**
   * Allows iterating over all properties in the configuration state.
   *
   * @param callback
   */
  public forEach(callback: (property: SourceProperty) => void): void {
    this.state.forEach(callback);
  }

  /**
   * Exports the configuration state as an array of SourceProperty objects.
   * 
   * @returns 
   */
  public toArray(): SourceProperty[] {
    return this.state;
  }

  /**
   * Exports the configuration state as a JSON string.
   *
   * @returns
   */
  public export(): string {
    return JSON.stringify(this.state);
  }

  /**
   * Imports properties from a JSON string, replacing the current state.
   *
   * @param data
   */
  public import(data: string) {
    try {
      const parsed: SourceProperty[] = JSON.parse(data);
      for (const prop of parsed) {
        this.setProperty(prop);
      }
    } catch (error) {
      throw new Error(`Failed to import configuration state: ${(error as Error).message}`);
    }
  }
}
