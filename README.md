# Keypo Secrets CLI

A command-line interface for managing secrets using Keypo decentralized storage. Protect your API keys, credentials, and other sensitive data without trusting an intermediary.

## Official CLI

The official hosted version is available on npm:

```bash
npm install -g @keypo/cli
```

See the package on [npm](https://www.npmjs.com/package/@keypo/cli).

This repository is the open-source codebase. You can self-host, audit, or modify it as needed.

## Self-Hosting / Building from Source

```bash
git clone https://github.com/keypo-us/keypo-secrets-cli.git
cd keypo-secrets-cli
npm install
npm run build
```

To link the CLI locally for development:

```bash
npm link
```

You can then use the `keypo` command directly from your terminal.

## Usage

### Setup

Initialize and configure your Keypo CLI environment:

```bash
keypo setup
```

This will prompt you for:
- Private key
- RPC URL (with a default option)

### Sync

Synchronize files with the Keypo network by replacing placeholders with decrypted values:

```bash
keypo sync <input-file> <output-file>
```

The sync command:
- Reads from the input file
- Finds placeholders in the format `${key_name}`
- Searches for each key in the Keypo network
- Decrypts the values using your wallet
- Replaces placeholders with decrypted values
- Writes the result to the output file

**Example:**

```bash
# Input file (config.txt) contains:
# API_KEY=${api_key}
# DATABASE_URL=${database_url}

keypo sync config.txt config-decrypted.txt

# Output file (config-decrypted.txt) will contain:
# API_KEY=actual_decrypted_api_key_value
# DATABASE_URL=actual_decrypted_database_url_value
```

### List

List your keys stored in the Keypo network:

```bash
keypo list
```

Shows all keys with their name and owner information.

## How It Works

The CLI uses a placeholder replacement flow:

1. You write configuration files with `${key_name}` placeholders
2. The `sync` command reads each placeholder and looks up the corresponding key on the Keypo decentralized storage network
3. Values are decrypted using your wallet's private key
4. The resolved values replace the placeholders in the output file

Your secrets are stored on the Keypo decentralized storage network and are only accessible to authorized wallets.

## Dependencies

- `@keypo/typescript-sdk` -- Keypo client SDK
- `@keypo/typescript-sdk-server` -- Keypo server SDK
- `ethers` -- Ethereum wallet and provider utilities
- `commander` -- CLI framework

## Requirements

- Node.js v14+
- npm v6+

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
