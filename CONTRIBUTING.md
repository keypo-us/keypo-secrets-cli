# Contributing to Keypo Secrets CLI

Thank you for your interest in contributing.

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/keypo-us/keypo-secrets-cli.git
   cd keypo-secrets-cli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Link locally (optional, for testing the CLI):

   ```bash
   npm link
   ```

## Building

```bash
npm run build
```

This compiles the TypeScript source in `src/` to JavaScript in `dist/`.

For watch mode during development:

```bash
npm run dev
```

## Submitting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/keypo-us/keypo-secrets-cli/issues) with a clear description and steps to reproduce (if applicable).

## Pull Requests

1. Fork the repository and create a branch from `main`
2. Make your changes
3. Ensure the project builds without errors (`npm run build`)
4. Open a pull request with a description of the change
