#!/usr/bin/env node

import { Command } from 'commander';
import { syncCommand } from '../commands/sync';
import { listCommand } from '../commands/list';
import { setupCommand } from '../commands/setup';

const program = new Command();

program
  .name('keypo')
  .description('CLI tool for interacting with Keypo core functionality')
  .version('1.0.0');

// Add commands
program.addCommand(syncCommand);
program.addCommand(listCommand);
program.addCommand(setupCommand);

program.parse(process.argv); 