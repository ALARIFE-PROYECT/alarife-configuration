import { ConfigurationState, SourceProperty } from '../models/ConfigurationState';

/**
 * CtxStore is a specialized configuration state that can be initialized from an environment variable.
 */
export class CtxStore extends ConfigurationState {
  constructor(inputState?: string) {
    super();

    const state = inputState ?? process.env.CONFIGURATION_STATE;
    if (state) {
      this.import(state);
    }
  }

  *[Symbol.iterator](): IterableIterator<SourceProperty> {
    yield* this.state;
  }
}

export const ctxStore = new CtxStore();
