import { Page, Request, Response } from 'playwright';

interface Timing {
  startTime: number;
  requestStart: number;
  responseEnd: number;
}

interface RequestInfo {
  url: string;
  method: string;
  latency: string;
  bytesOut: string | undefined;
  headers: Record<string, string>;
  timing: Timing;
}

interface ResponseInfo {
  responseCode: number;
  bytesIn: string | undefined;
}

interface PerfMetrics {
  stepName: string;
  timeElapsed: string;
  visualComplete: number;
  navigationTime: number;
}

const requestInfo: Record<number, Record<number, RequestInfo>> = {};
const responseInfo: Record<number, Record<number, ResponseInfo>> = {};
const perfMetrics: Record<number, PerfMetrics> = {};
let step = 0;

function isUrlAllowed(request: Request): boolean {
  // Implement your URL filtering logic here
  return true;
}

export async function measurePerformance(
  executeSteps: () => Promise<void>,
  stepName: string,
  page: Page
): Promise<void> {
  try {
    // Callback for requestfinished event
    const requestListener = (request: Request) => {
      if (isUrlAllowed(request)) {
        const timing = request.timing() as Timing;
        const startTimeKey = timing.startTime;
        const headers = request.headers();
        const url = request.url();
        const latency = timing.responseEnd - timing.requestStart;
        const reqObj: RequestInfo = {
          url,
          method: request.method(),
          latency: latency.toFixed(2),
          bytesOut: request.postData(),
          headers,
          timing
        };
        if (requestInfo[step] === undefined) {
          requestInfo[step] = { [startTimeKey]: reqObj };
        } else {
          requestInfo[step] = { ...requestInfo[step], [startTimeKey]: reqObj };
        }
      }
    };

    // Callback for response event
    const responseListener = async (response: Response) => {
      const request = response.request();
      if (isUrlAllowed(request)) {
        const responseCode = response.status();
        const bytesIn = response.headers()['content-length'];
        const startTimeKey = (request.timing() as Timing).startTime;
        const resObj: ResponseInfo = { responseCode, bytesIn };
        if (responseInfo[step] === undefined) {
          responseInfo[step] = { [startTimeKey]: resObj };
        } else {
          responseInfo[step] = { ...responseInfo[step], [startTimeKey]: resObj };
        }
      }
    };

    // Enable the listeners to capture requests for given steps
    page.on('requestfinished', requestListener);
    page.on('response', responseListener);

    // Execute the steps with performance markers
    const start = performance.now();
    await executeSteps();
    const end = performance.now();

    // Remove the listeners for the step
    page.removeListener('requestfinished', requestListener);
    page.removeListener('response', responseListener);

    // Record the performance metrics
    const timeElapsed = end - start;
    const visualComplete = await page.evaluate(() => {
      const timing = window.performance.timing;
      const visualComplete = timing.loadEventEnd - timing.navigationStart;
      return visualComplete;
    });
    const navigationTime = await page.evaluate(() =>
      performance.getEntriesByType('navigation')
    );
    perfMetrics[step] = {
      stepName,
      timeElapsed: timeElapsed.toFixed(2),
      visualComplete,
      navigationTime: navigationTime[0].duration
    };
    step++; // Step Counter
  } catch (e) {
    e.message = `${stepName}: ${e.message}`;
    perfMetrics[step] = {
      stepName,
      timeElapsed: 'NA',
      visualComplete: 'NA',
      navigationTime: 'NA'
    };
    throw e;
  }
}
