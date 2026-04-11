// this.loaders = [
//   // new DefaultConfigurationLoader(), // prioridad 0
//   // new EnvConfigurationLoader(), // prioridad 1
//   // new ArgvConfigurationLoader() // prioridad 2
// ];
// todos los loades vienen de fuera, TODO ESTO ESTA EN EL CLI

import { ConfigurationLoader } from '../../src/models/ConfigLoader';
import { ConfigurationState } from '../../src/models/ConfigurationState';

export class DefaultConfigurationLoader extends ConfigurationLoader {
  public priority: number = 1;

  load(state: ConfigurationState): void {
    // este recorreta la configuracion del comando de commander y añadira al estado:
    // name, shortName y env
    // como valor su default value
  }
}

export class EnvConfigurationLoader extends ConfigurationLoader {
  public priority: number = 2;

  private loadEnvFile(path: string): Record<string, string> {
    const configResult = dotenv.config({ path });
    return configResult.parsed || {};
  }

  load(state: ConfigurationState): void {
    // este hara esto, pero su implementacion estara en el CLI

    const environment = state.getProperty(NODE_ENV);
    if (environment) {
      const envConfig = this.loadEnvFile(`.env.${environment}`);

      // Object.keys(envConfig).forEach((key) => {
      //   const appConfig = appConfigurationMap.find((config) => config.envKey === key);

      //   state.setProperty({ argKey: appConfig?.argKey, envKey: key, value: envConfig[key] });
      // });
    }
  }
}

export class ArgvConfigurationLoader extends ConfigurationLoader {
  public priority: number = 3;

  load(state: ConfigurationState): void {
    // este recorrera el resultaod del comando de commander y añadira al estado:
    // name, shortName y env
    // y el valor que se le ha pasado por linea de comandos
  }
}

//------------------------------------- el post loader tambien esta en el cli
// el cli configura los parametros de cifrado no el config

// import crypto from 'crypto';

// import { ConfigurationLoader } from './ConfigLoader';
// import { ConfigurationState } from './ConfigurationState';
// import { ENCRYPT_KEY } from './ConfigurationEnvKeys';

// const ALGORITHM = 'aes-256-gcm';
// const IV_LENGTH = 16;
// const AUTH_TAG_LENGTH = 16;
// const CIPHER_PREFIX = 'ENC[';

// export interface ConfigurationPostLoader extends ConfigurationLoader {}

export class SecureConfigurationLoader extends ConfigurationLoader {
  public priority: number = 4;
  // private derivedKey?: Uint8Array;

  // private createDerivedKey(password: string): void {
  //   this.derivedKey = new Uint8Array(crypto.scryptSync(password, 'salt', 32));
  // }

  // private decrypt(cipherValue: string): string {
  //   const payload = Buffer.from(cipherValue.slice(CIPHER_PREFIX.length), 'hex');

  //   const iv = new Uint8Array(payload.subarray(0, IV_LENGTH));
  //   const authTag = new Uint8Array(payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH));
  //   const encrypted = new Uint8Array(payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH));

  //   const decipher = crypto.createDecipheriv(ALGORITHM, this.derivedKey!, iv);
  //   decipher.setAuthTag(authTag);

  //   let decrypted = decipher.update(encrypted, undefined, 'utf8');
  //   decrypted += decipher.final('utf8');
  //   return decrypted;
  // }

  load(state: ConfigurationState): void {
    // console.log("🚀 ~ SecureConfigurationPostLoader ~ load ~ state:", state)
    // const encryptKey = 'age12hmtsadz37de2q85tvzvxyqs64h65fm8hlkcy8w93a4m6uglqcmq2rgerk';
    // if (!encryptKey) {
    //   return;
    // }
    // this.createDerivedKey(encryptKey);
    // state.forEach((property) => {
    //   console.log("🚀 ~ SecureConfigurationPostLoader ~ load ~ property:", property)
    //   if (property.value && typeof property.value === 'string' && property.value.includes(CIPHER_PREFIX)) {
    //     property.value = this.decrypt(property.value);
    //     console.log("🚀 ~ SecureConfigurationPostLoader ~ load ~ property.value:", property.value)
    //   }
    // });
  }
}
