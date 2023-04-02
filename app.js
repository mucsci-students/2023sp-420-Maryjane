const { exec, spawn } = require('child_process');

const args = process.argv;

if (args.includes("cli")) {
  spawn('node', ['src/initCLI.js'], { stdio: 'inherit' });
} else {
  const install = exec('npm run gui');
  install.stdout.pipe(process.stdout);
}