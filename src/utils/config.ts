import { KeypoConfig } from '../types/config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.keypo');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure the config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.chmodSync(CONFIG_DIR, 0o700); // Only owner can read/write/execute
}

export function saveConfig(config: KeypoConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  fs.chmodSync(CONFIG_FILE, 0o600); // Only owner can read/write
}

export function loadConfig(): KeypoConfig | null {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading configuration:', error);
    return null;
  }
} 