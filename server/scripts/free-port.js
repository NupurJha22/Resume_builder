/**
 * Frees the configured port before starting the dev server.
 * Prevents "EADDRINUSE" when a previous nodemon/node process is still running.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { execSync } = require('child_process');

const port = process.env.PORT || 5001;

function freePortOnWindows(p) {
  try {
    const output = execSync(`netstat -ano | findstr ":${p}"`, { encoding: 'utf8' });
    const pids = new Set();

    output.split('\n').forEach((line) => {
      if (!line.includes('LISTENING')) return;
      const parts = line.trim().split(/\s+/);
      const procId = parts[parts.length - 1];
      if (procId && procId !== '0' && procId !== String(process.pid)) {
        pids.add(procId);
      }
    });

    pids.forEach((procId) => {
      try {
        execSync(`taskkill /PID ${procId} /F`, { stdio: 'ignore' });
        console.log(`✓ Freed port ${p} (stopped PID ${procId})`);
      } catch {
        // Process may have already exited
      }
    });
  } catch {
    // No process on port — nothing to do
  }
}

function freePortOnUnix(p) {
  try {
    execSync(`lsof -ti:${p} | xargs kill -9 2>/dev/null`, { stdio: 'ignore', shell: true });
    console.log(`✓ Freed port ${p}`);
  } catch {
    // No process on port
  }
}

if (process.platform === 'win32') {
  freePortOnWindows(port);
} else {
  freePortOnUnix(port);
}
