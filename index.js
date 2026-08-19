const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, 'dist', 'index.js');

if (fs.existsSync(distPath)) {
  require(distPath);
} else {
  console.error('Compiled file not found at dist/index.js. Please run `npm run build` locally or ensure Render ran the build step.');
  process.exit(1);
}
