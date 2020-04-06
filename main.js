const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

module.exports = async function main() {
  const inquirer = require('inquirer');
  const simpleGit = require('simple-git/promise');
  const { logSuccess, log } = require('./logging');

  const git = simpleGit().silent(true);
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
  logSuccess(`Successfully deleted branch${branches.length > 0 ? 'es' : ''}: ${branches.join(', ')}`);
};

function forceDeleteGitBranch(branchName) {
  return execAsync(`git branch -D ${branchName}`);
}
