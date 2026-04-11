import { ConfigurationState } from './ConfigurationState';

export abstract class ConfigurationLoader {
  /**
   * Priority of the loader.
   * 
   * A mayor numero mayor prioridad.
   * 
   * Example:
   * priority = 3 ==> Argv
   * priority = 2 ==> Env
   * priority = 1 ==> Default
   * 
   * Primero se carga 1, luego 2 y por ultimo 3, de esta forma si un valor esta en 1 y en 3, se quedara el de 3
   */
  public abstract priority: number;

  abstract load(state: ConfigurationState): void;
}
