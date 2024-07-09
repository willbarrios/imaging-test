import { test, expect } from '@playwright/test';

const fetch = async (url: string, options: any) => {
  const nodeFetch = (await import('node-fetch')).default;
  return nodeFetch(url, options);
};

test.describe('Image Uploader Service', () => {

  test('Should send image metadata to Image Viewer service', async () => {
    const response = await fetch('http://127.0.0.1:1234/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '123', name: 'MRI Scan', type: 'MRI', date: '2024-01-01' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });
});