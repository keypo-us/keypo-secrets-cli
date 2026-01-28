import { loadConfig } from './config';

// Fetch Keypo configuration from refs.json
export async function getKeypoRefsConfig() {
  try {
    const response = await fetch('https://dotenv.keypo.io/refs.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch Keypo config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Keypo configuration:', error);
    throw error;
  }
}

export async function getKeypoInstance() {
  const config = loadConfig();
  if (!config) {
    throw new Error('Keypo is not configured. Please run "keypo setup" first.');
  }
  
  return {
    privateKey: config.privateKey,
    rpcURL: config.rpcURL
  };
} 