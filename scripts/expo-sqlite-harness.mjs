// Runs a test file with `expo-sqlite` swapped for the Node SQLite stub, so the
// project's real db.js / migrations.js / queries.js execute unmodified.
// Usage: node scripts/expo-sqlite-harness.mjs <test-file>
import { registerHooks } from 'node:module';
import { extname } from 'node:path';
import { pathToFileURL } from 'node:url';

const stub = new URL('./expo-sqlite-stub.mjs', import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'expo-sqlite') {
      return { url: stub, shortCircuit: true };
    }

    // Metro resolves extensionless imports; Node needs the real file name.
    if (specifier.startsWith('.') && extname(specifier) === '') {
      try {
        return nextResolve(`${specifier}.js`, context);
      } catch {
        return nextResolve(`${specifier}/index.js`, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const testFile = process.argv[2];

if (!testFile) {
  console.error('Usage: node scripts/expo-sqlite-harness.mjs <test-file>');
  process.exit(1);
}

await import(pathToFileURL(testFile).href);
