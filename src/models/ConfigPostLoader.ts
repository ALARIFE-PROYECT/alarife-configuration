import crypto from 'crypto';

import { ConfigurationLoader } from './ConfigLoader';
import { ConfigurationState } from './ConfigurationState';
// import { ENCRYPT_KEY } from './ConfigurationEnvKeys';

// const ALGORITHM = 'aes-256-gcm';
// const IV_LENGTH = 16;
// const AUTH_TAG_LENGTH = 16;
// const CIPHER_PREFIX = 'ENC[';

export interface ConfigurationPostLoader extends ConfigurationLoader {}

export class SecureConfigurationPostLoader implements ConfigurationPostLoader {
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
