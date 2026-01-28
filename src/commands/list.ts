import { Command } from 'commander';
import { list } from '@keypo/typescript-sdk'
import * as ethers from 'ethers';
import { getKeypoInstance } from '../utils/keypo';

export const listCommand = new Command()
  .name('list')
  .description('List Keypo resources')
  .action(async (): Promise<void> => {
    try {
      console.log('connecting to Keypo...');
      const config = await getKeypoInstance();
      const provider = new ethers.providers.JsonRpcProvider(config.rpcURL);
      const wallet = new ethers.Wallet(config.privateKey, provider);

      const entries = await list(wallet.address);
      
      if (!entries || Object.keys(entries).length === 0) {
        console.log('No keys found.');
      } else {
        console.log('Keys:');
        Object.keys(entries).forEach((key: string) => {
          const entry = entries[key];
          let fileUseType = undefined;
          if (entry && entry.dataMetadata && entry.dataMetadata.userMetaData) {
            try {
              const meta = JSON.parse(entry.dataMetadata.userMetaData);
              fileUseType = meta.fileUseType;
            } catch { /* ignore JSON parse errors */ }
          }
          if (fileUseType !== 'key') return;
          const owner = entry.owner || 'N/A';
          const ownerDisplay = owner.toLowerCase() === wallet.address.toLowerCase() ? 'you' : owner;
          console.log(`- ${key}`);
          if (entry && typeof entry === 'object') {
            console.log(`  Name: ${entry.dataMetadata?.name || 'N/A'}`);
            console.log(`  Owner: ${ownerDisplay}`);
          }
        });
      }
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error listing resources:', error.message);
      } else {
        console.error('An unknown error occurred while listing resources');
      }
      process.exit(1);
    }
  }); 