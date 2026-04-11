import { ConfigurationState } from '../models/ConfigurationState';

/**
 * ! para hacer esto, antes necesito thread, el dato mostrado aqui viene por RCP
 */
class CtxStore extends ConfigurationState {
  constructor() {
    super();
    this.importState();
  }

  private importState(): void {
    // buscar el estado en el process.argv
    // rellenar this.state con el estado encontrado
  }
}

export const ctxStore = new CtxStore();
