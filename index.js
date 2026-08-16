const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, 'dist', 'index.js');

function runDist() {
  require(distPath);
}

if (fs.existsSync(distPath)) {
  runDist();
} else {
  console.error('Compiled file not found at dist/index.js. Attempting to build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    if (fs.existsSync(distPath)) {
      runDist();
    } else {
      console.error('Build completed but dist/index.js still missing.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Automatic build failed:', err);
    process.exit(1);
  }
}
