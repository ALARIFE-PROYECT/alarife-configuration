export interface SourceProperty {
  /**
   * Clave del argumento en linea de comandos.
   *
   * por ejemplo: DEBUG_MODE
   * por ejemplo: node app.js --debug=true
   * por ejemplo: node app.js --debug
   * por ejemplo: node app.js -d
   *
   * key: ['debug', 'd', 'DEBUG_MODE']
   * valor: true
   */
  key: string[];

  value: any;
}

export class ConfigurationState {
  private keys: Set<string> = new Set();

  protected state: SourceProperty[] = [];

  /**
   * Retrieves the value of a property by its key.
   *
   * @param key
   * @returns
   */
  public getProperty(key: string): any {
    const property = this.state.find((prop) => prop.key.includes(key));
    return property ? property.value : undefined;
  }

  /**
   * Adds or updates a property in the configuration state.
   *
   * @param source
   */
public setProperty(source: SourceProperty): void {
  // Find property with any of the keys
  const existing = this.state.find((prop) => prop.key.some((k) => source.key.includes(k)));

  // Validate uniqueness of all keys (skip keys that belong to the property being updated)
  for (const key of source.key) {
    if (this.keys.has(key) && (!existing || !existing.key.includes(key))) {
      throw new Error(`Duplicate key: '${key}'`);
    }
  }

  if (existing) {
    // Ensure all existing keys are present in source before allowing new ones
    const incomingKeys = new Set(source.key);
    const newKeys = source.key.filter((k) => !existing.key.includes(k));

    if (newKeys.length > 0) {
      const missingKeys = existing.key.filter((k) => !incomingKeys.has(k));
      if (missingKeys.length > 0) {
        throw new Error(
          `Cannot add new key(s) [${newKeys.join(", ")}]: missing existing key(s) [${missingKeys.join(", ")}]`
        );
      }
    }

    // If a source key is missing from the existing list, add it.
    for (const key of source.key) {
      if (!existing.key.includes(key)) {
        existing.key.push(key);

        // Index new keys of the existing property
        this.keys.add(key);
      }
    }

    // Update existing property
    existing.value = source.value;
  } else {
    // Add new property
    this.state.push(source);

    // Index all keys of the new property
    for (const key of source.key) {
      this.keys.add(key);
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
}
