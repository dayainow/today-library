import { buildLibrariesPayload } from './api/_lib/publicLibraries';

async function test() {
  console.log('Starting fetch...');
  const start = Date.now();
  try {
    const payload = await buildLibrariesPayload();
    console.log(`Success! Fetched ${payload.libraries.length} libraries.`);
  } catch (err) {
    console.error('Failed:', err);
  }
  console.log(`Took ${Date.now() - start}ms`);
}

test();
