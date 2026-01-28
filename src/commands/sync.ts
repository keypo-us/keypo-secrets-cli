import { Command } from 'commander';
import { getKeypoInstance, getKeypoRefsConfig } from '../utils/keypo';
import { ethers } from 'ethers';
import { search, type DecryptConfig, decryptServer, postProcess } from '@keypo/typescript-sdk-server'
import fs from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Function to present search results and get user choice
async function selectDataIdentifier(searchResult: any, key: string, walletAddress: string): Promise<string> {
  const dataIdentifiers = Object.keys(searchResult);
  
  if (dataIdentifiers.length === 0) {
    throw new Error(`No data found for key: ${key}`);
  }
  
  if (dataIdentifiers.length === 1) {
    return dataIdentifiers[0];
  }
  
  console.log(`\nMultiple results found for key "${key}":`);
  dataIdentifiers.forEach((identifier, index) => {
    const data = searchResult[identifier];
    const owner = data.owner || 'N/A';
    const ownerDisplay = owner.toLowerCase() === walletAddress.toLowerCase() ? 'you' : owner;
    console.log(`${index + 1}. ${identifier}`);
    console.log(`   Name: ${data.dataMetadata?.name || 'N/A'}`);
    console.log(`   Type: ${data.dataMetadata?.type || 'N/A'}`);
    console.log(`   Owner: ${ownerDisplay}`);
    console.log('');
  });
  
  let validChoice = false;
  let dataIdentifier: string;
  
  while (!validChoice) {
    const choice = await prompt(`Select which result to use (1-${dataIdentifiers.length}): `);
    const choiceIndex = parseInt(choice) - 1;
    
    if (choiceIndex >= 0 && choiceIndex < dataIdentifiers.length) {
      dataIdentifier = dataIdentifiers[choiceIndex];
      validChoice = true;
    } else {
      console.log(`Invalid choice. Please enter a number between 1 and ${dataIdentifiers.length}.`);
    }
  }
  
  return dataIdentifier!;
}

// command takes in a file path as an argument
export const syncCommand = new Command()
  .name('sync')
  .description('Sync a file with Keypo')
  .argument('<input-file>', 'Path to the input file')
  .argument('<output-file>', 'Path to the output file')
  .action(async (inputFile: string, outputFile: string): Promise<void> => {
    try {
      console.log('Connecting to Keypo...');
      const config = await getKeypoInstance();
      const provider = new ethers.providers.JsonRpcProvider(config.rpcURL);
      const wallet = new ethers.Wallet(config.privateKey, provider);
      const ONE_HOUR_FROM_NOW = new Date(
        Date.now() + 1000 * 60 * 60,
      ).toISOString();
      
      // Fetch Keypo configuration from refs.json
      console.log('Fetching Keypo configuration...');
      const keypoConfig = await getKeypoRefsConfig();
      
      const decryptConfig: DecryptConfig = {
        registryContractAddress: keypoConfig.RegistryContractAddress,
        chain: keypoConfig.Chain,
        expiration: ONE_HOUR_FROM_NOW,
        apiUrl: keypoConfig.KeypoApiUrl
      }

      const inputContent = fs.readFileSync(inputFile, 'utf8');
      const matches = inputContent.match(/\${(.*?)}/g) || [];
      
      let decryptedFile = inputContent;
      for (const match of matches) {
        const key = match.slice(2, -1); // Remove ${ and }
        try {
          const searchResult = await search(key, wallet.address);
          
          // Let user select which dataIdentifier to use if multiple results
          const dataIdentifier = await selectDataIdentifier(searchResult, key, wallet.address);
          
          const decryptResult = await decryptServer(
            dataIdentifier,
            wallet,
            decryptConfig,
            false
          );
          const decryptedDataString = postProcess(
            decryptResult.decryptedData, 
            decryptResult.metadata
          );
          decryptedFile = decryptedFile.replace(match, decryptedDataString as string);
        } catch (error) {
          console.error(`Error decrypting ${key}:`, error instanceof Error ? error.message : 'Unknown error');
          process.exit(1);
        }
      }

      // Write the decrypted file back to the original file
      fs.writeFileSync(outputFile, decryptedFile);
      console.log(`File updated successfully: ${outputFile}`);

      console.log('Keypo initialized successfully!');
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error initializing Keypo:', error.message);
      } else {
        console.error('An unknown error occurred while initializing Keypo');
      }
      process.exit(1);
    } finally {
      rl.close();
    }
  }); 