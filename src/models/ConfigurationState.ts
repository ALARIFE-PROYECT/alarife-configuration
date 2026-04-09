
export interface SourceProperty {
  envKey?: string;
  argKey?: string;
  value: any;
}

export class ConfigurationState {
  private state: SourceProperty[] = [];

  getProperty(key: string): any {
    const property = this.state.find((prop) => prop.envKey === key || prop.argKey === key);
    return property ? property.value : undefined;
  }

  setProperty(property: SourceProperty): void {
    const existingIndex = this.state.findIndex(
      (prop) => prop.envKey === property.envKey || prop.argKey === property.argKey
    );

    if (existingIndex !== -1) {
      this.state[existingIndex] = property;
    } else {
      this.state.push(property);
    }
  }

  forEach(callback: (property: SourceProperty) => void): void {
    this.state.forEach(callback);
  }
}
