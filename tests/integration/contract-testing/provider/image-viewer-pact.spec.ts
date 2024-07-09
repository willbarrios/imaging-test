import { Verifier } from '@pact-foundation/pact';
import { test } from '@playwright/test';
import path from 'path';

test.describe('Image Viewer Service', () => {
  test('Should validate the contract with Image Uploader', async () => {
    const opts = {
      providerBaseUrl: 'http://127.0.0.1:1234',
      pactUrls: [path.resolve(process.cwd(), 'pacts/imageuploader-imageviewer.json')],
    };

    const verifier = new Verifier(opts);
    await verifier.verifyProvider();
  });
});