import { Pact } from '@pact-foundation/pact';
import { test, expect } from '@playwright/test';
import path from 'path';
import fetch from 'node-fetch';

const provider = new Pact({
  consumer: 'ImageUploader',
  provider: 'ImageViewer',
  port: 1234,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info',
});

/*
test.describe('Image Uploader Service', () => {
  test.beforeAll(() => provider.setup());
  test.afterAll(() => provider.finalize());

  test('should send image metadata to Image Viewer service', async () => {
    await provider.addInteraction({
      state: 'image metadata exists',
      uponReceiving: 'a request to send image metadata',
      withRequest: {
        method: 'POST',
        path: '/images',
        headers: { 'Content-Type': 'application/json' },
        body: { id: '123', name: 'MRI Scan', type: 'MRI', date: '2024-01-01' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true },
      },
    });

    const response = await fetch('http://localhost:1234/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '123', name: 'MRI Scan', type: 'MRI', date: '2024-01-01' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });

    await provider.verify();
  });
});
*/