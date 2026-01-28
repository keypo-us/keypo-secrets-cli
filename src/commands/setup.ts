import { Command } from 'commander';
import { saveConfig, loadConfig } from '../utils/config';
import { getKeypoRefsConfig } from '../utils/keypo';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Get default RPC URL from Keypo refs.json
async function getDefaultRpcUrl(): Promise<string> {
  try {
    const config = await getKeypoRefsConfig();
    return config.BundlerRpcUrl || 'https://sepolia.base.org';
  } catch (error) {
    console.warn('Warning: Could not fetch default RPC URL from Keypo config, using fallback');
    return 'https://sepolia.base.org';
  }
}

export const setupCommand = new Command()
  .name('setup')
  .description('Setup Keypo environment with API credentials')
  .action(async (): Promise<void> => {
    try {
      console.log('Setting up Keypo environment...');
      
      // Get default RPC URL from Keypo config
      const defaultRpcUrl = await getDefaultRpcUrl();
      
      // Get API credentials
      const privateKey = await prompt('Enter your Private Key: ');
      const rpcURLInput = await prompt(`Enter your RPC URL (press Enter for default ${defaultRpcUrl}): `);
      const rpcURL = rpcURLInput.trim() || defaultRpcUrl;
      
      // Save the configuration
      saveConfig({ privateKey, rpcURL });
      
      console.log('Keypo environment setup completed!');
      console.log('Configuration saved in ~/.keypo/config.json');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error setting up environment:', error.message);
      } else {
        console.error('An unknown error occurred while setting up environment');
      }
      process.exit(1);
    } finally {
      rl.close();
    }
  }); 