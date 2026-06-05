import fs from 'node:fs';
import path from 'node:path';
import { buildLibrariesPayload } from '../api/_lib/publicLibraries';

async function generate() {
  console.log('Generating static library data...');
  try {
    const payload = await buildLibrariesPayload();
    const dataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'libraries.json');
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`Successfully generated ${filePath} with ${payload.libraries.length} items.`);
  } catch (error) {
    console.error('Failed to generate static data:', error);
    process.exit(1);
  }
}

generate();
