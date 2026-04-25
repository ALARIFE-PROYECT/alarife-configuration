# @alarife/configuration - Centralized configuration system for Alarife applications.

<div align="center">

[![NPM Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://www.npmjs.com/package/@alarife/configuration) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Centralized configuration for architect, centralizes argv, env, secure-env.**

</div>

## 📋 Table of Contents

- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Detailed API](#-detailed-api) ...
- [License](#-license)

## 🚀 Installation

```bash
npm install @alarife/configuration --save-dev
```

## 📦 Basic Usage

This package provides a small, pluggable configuration system. Create a `Configuration` instance, register one or more loaders (objects that extend `ConfigurationLoader`) and call `load()`. Loaders with higher `priority` run later and will override values set by earlier loaders.

Example (TypeScript):

```ts
import { Configuration, ConfigurationLoader } from '@alarife/configuration';

class DefaultLoader extends ConfigurationLoader {
	public priority = 1;
	private defaults = [
		{ argv: 'port', env: 'PORT', value: 3000 },
		{ argv: 'debug', env: 'DEBUG_MODE', value: false },
	];

	load(state) {
		for (const p of this.defaults) {
			state.setProperty(p);
		}
	}
}

class EnvLoader extends ConfigurationLoader {
	public priority = 2;
	load(state) {
		if (process.env.PORT) {
			state.setProperty({ argv: 'port', env: 'PORT', value: Number(process.env.PORT) });
		}
		if (typeof process.env.DEBUG_MODE !== 'undefined') {
			state.setProperty({ argv: 'debug', env: 'DEBUG_MODE', value: process.env.DEBUG_MODE === 'true' });
		}
	}
}

const config = new Configuration();
config.addLoader(new DefaultLoader());
config.addLoader(new EnvLoader());
config.load();

console.log('port:', config.getState().getProperty('port'));
console.log('debug:', config.getState().getProperty('debug'));
```

## 📖 Detailed API

### `ConfigurationLoader`

Abstract base class for configuration loaders. Implementors provide a numeric `priority` and a `load(state)` method.

```typescript
abstract class ConfigurationLoader {
	public abstract priority: number;
	abstract load(state: ConfigurationState): void;
}
```

| Method / Property | Description |
|---|---|
| `priority: number` | Numeric priority. Higher number = higher precedence. Loaders are sorted ascending and executed in that order, so loaders with larger `priority` values run later and can override earlier values. |
| `load(state: ConfigurationState): void` | Abstract method invoked during `Configuration.load()`. Implementations should call `state.setProperty(...)` to apply properties. |

---

### `Configuration`

High-level coordinator that registers loaders and applies them against a single `ConfigurationState`.

```typescript
const config = new Configuration(...loaders?: ConfigurationLoader[]);
```

| Method | Description |
|---|---|
| `addLoader(loader: ConfigurationLoader): void` | Register a loader instance to be executed when `load()` is called. |
| `load(): void` | Sorts registered loaders by `priority` (ascending) and invokes each loader's `load(state)` method. Loaders executed later may override earlier values. |
| `getState(): ConfigurationState` | Returns the internal `ConfigurationState` instance for direct inspection or manipulation. |

---

### `ConfigurationState`

In-memory storage for configuration properties and their aliases.

```typescript
const state = new ConfigurationState();
```

| Method | Description |
|---|---|
| `getProperty(key: string): any` | Return the value of the property that contains `key` in its alias list, or `undefined` if not present. |
| `setProperty(source: SourceProperty): void` | Add or update a property. Rules: each alias in `source.key` must be unique across all properties (otherwise a `Duplicate key` error is thrown). When updating an existing property you may add new aliases only if the incoming `source.key` includes all existing aliases — omitting existing aliases while adding new ones will throw an error. |
| `forEach(callback: (property: SourceProperty) => void): void` | Iterate over all stored properties. |
| `toArray(): SourceProperty[]` | Allows retrieving the stored parameter list |
| `export(): string` | Serialize the current state to a JSON string. |
| `import(data: string): void` | Parse JSON and import properties via `setProperty`. Throws an error on parse failure or invalid updates. |

--- 

### `SourceProperty`

Interface describing a property and its aliases.

```typescript
interface SourceProperty {
	argv: string;
	shortArgv?: string;
	env: string;
	value: any;
}
```

| Property | Description |
|---|---|
| `argv: string` | Alias for the command-line argument. |
| `shortArgv?: string` | Optional alias for a shorter version of the command-line argument. |
| `env: string` | Alias for the environment variable. |
| `value: any` | The property's value (string, number, boolean, object, ...). |

--- 

Notes:

- Error behavior: the library throws `Error` when encountering duplicate keys, invalid alias updates, or when `import()` receives invalid JSON.
- Recommended priority ordering: `1` = defaults, `2` = environment variables, `3` = command-line arguments (higher number wins).

### `CtxStore`

This service is used as a bridge at runtime after configuration in the main CLI thread.

```typescript
/** Service use Manual */
const store = new CtxStore();

/** Service use automatic */
import { ctxStore } from '@alarife/configuration';
```

Notes:

- This service is an extension of `ConfigurationState`.
- The instantiated form of this functionality accesses the `CONFIGURATION_STATE` environment variable


## 📄 License

This project is licensed under Apache-2.0. See the [LICENSE](./LICENSE) file for details.

--- 

<div align="center">

**Built with ❤️ by [Soria Garcia, Jose Eduardo](mailto:alarifeproyect@gmail.com)**

<sub>🌍 Product developed in Andalucia, España 🇪🇸</sub>

_Part of the Alarife ecosystem_

</div>
