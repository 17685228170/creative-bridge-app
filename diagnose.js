const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('=== Creative Bridge Diagnostic ===\n');

// Check Node.js version
console.log('Node.js version:', process.version);

// Check if required files exist
const requiredFiles = [
  'package.json',
  'prisma/schema.prisma',
  'prisma/dev.db',
  'src/app/page.tsx',
  'src/app/api/auth/login/route.ts',
];

console.log('\nFile check:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
});

// Check environment
console.log('\nEnvironment:');
console.log('  PORT:', process.env.PORT || 'not set');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');

// Try to start a simple server
console.log('\nTrying to start server on port 3009...');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Creative Bridge Test Server\n');
});

server.listen(3009, () => {
  console.log('  ✓ Simple server started on http://localhost:3009');
  console.log('\nTest this URL in your browser!');
  console.log('If this works, the issue is with Next.js, not your system.');
  
  // Keep running
  setTimeout(() => {
    console.log('\nServer still running... Press Ctrl+C to stop');
  }, 5000);
});

server.on('error', (err) => {
  console.log('  ✗ Server error:', err.message);
});
