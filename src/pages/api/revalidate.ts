import { createHmac } from 'node:crypto';

import type { NextApiRequest, NextApiResponse } from 'next';
import PQueue from 'p-queue';

export default async function handleWebhook(
  request: NextApiRequest,
  response: NextApiResponse<string>,
) {
  if (request.method !== 'POST') {
    console.log(`405 Method not allowed: ${request.method}`);
    response.status(405).send('Method not allowed');
    return;
  }

  const body = await getRawBody(request);
  if (!body) {
    console.log('400 Bad request (empty body)');
    response.status(400).send('Bad request (empty body)');
    return;
  }

  const signature = createHmac('sha256', process.env.WEBHOOK_SECRET ?? '')
    .update(body)
    .digest('hex');

  if (signature !== request.headers['x-signature']) {
    console.log(
      `403 Forbidden: signature ${request.headers['x-signature']} is different from ${signature}`,
    );
    response.status(403).send('Forbidden');
  }
  const jsonBody = JSON.parse(body) as string[];

  const queue = new PQueue({ concurrency: 10 });
  await queue.addAll(
    jsonBody.map(page => async () => {
      console.log(`Revalidating ${page}`);
      try {
        await response.revalidate(page);
      } catch (error: unknown) {
        console.log((error as Error).message);
      }
    }),
  );

  response.status(200).send('OK');
  return;
}

function getRawBody(request: NextApiRequest) {
  return new Promise<string>(resolve => {
    let bodyChunks: any[] = [];
    request.on('end', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      resolve(rawBody);
    });
    request.on('data', chunk => bodyChunks.push(chunk));
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
