import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);
import simpleGit from 'simple-git';
import inquirer from 'inquirer';

import { logSuccess, log } from './logging.js';

export default async function main() {
  const git = simpleGit();
  const { current, all: allBranches } = await git.branchLocal();
  const filteredBranches = allBranches.filter((b) => b !== current);
  if (filteredBranches.length === 0) {
    log('Your current branch is the only branch.');
    return;
  }
  const { branches } = await inquirer.prompt({
    name: 'branches',
    message: 'Which branches would you like to delete?',
    choices: [...filteredBranches],
    type: 'checkbox',
  });

  const output = await Promise.all(branches.map((branch) => forceDeleteGitBranch(branch)));
  if (branches.length === 0) {
    logSuccess(`Deleting no branches`);
    return;
  }
  logSuccess(`Successfully deleted branch${branches.length > 1 ? 'es' : ''}:\n${branches.map((b) => `- ${b}`).join('\n')}`);
}

function forceDeleteGitBranch(branchName) {
  return execAsync(`git branch -D ${branchName}`);
}
