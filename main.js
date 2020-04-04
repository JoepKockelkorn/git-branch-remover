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

  await Promise.all(branches.map((branch) => git.deleteLocalBranch(branch)));
  logSuccess(`Successfully deleted branches: ${branches.join(', ')}`);
};
