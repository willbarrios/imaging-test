import { Pact } from '@pact-foundation/pact';
import * as path from 'path';

const provider = new Pact({
  consumer: 'ImageUploader',
  provider: 'ImageViewer',
  port: 1234,
  host: '127.0.0.1',
  log: path.resolve(process.cwd(), '../logs', 'pact.log'),
  dir: path.resolve(process.cwd(), '../pacts'),
  logLevel: 'info',
  spec: 2
});

async function setupMockService() {
  await provider.setup();

  // Add interactions
  await provider.addInteraction({
    state: 'image metadata exists',
    uponReceiving: 'a request to send image metadata',
    withRequest: {
      method: 'POST',
      path: '/images',
      headers: { 'Content-Type': 'application/json' },
      body: { id: '123', name: 'MRI Scan', type: 'MRI', date: '2024-01-01' }
    },
    willRespondWith: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true }
    }
  });

  console.log('Mock service is running at http://127.0.0.1:1234');

  // Keep the process running
  process.stdin.resume();
}

setupMockService().catch(err => {
  console.error('Error setting up mock service:', err);
  process.exit(1);
});

// Clean up after using the service
process.on('SIGINT', () => {
    provider.finalize().then(() => {
      console.log('Pact mock server finalized');
      process.exit(0);
    });
  });