import chalk from 'chalk';

function logSuccess(message) {
  console.log(chalk.green(message));
}

function log(message) {
  console.log(message);
}

function logError(message) {
  console.error(chalk.red(message));
}

export { logSuccess, log, logError };
