import { readFile } from 'fs';
import { promisify } from 'util';
import { NetlifyResponse } from '../../shared/types';

const readFileAsync = promisify(readFile);

const templatePath = require.resolve('./done.html');
const templateReady = readFileAsync(templatePath, 'utf8');

export async function renderTemplate(
  statusCode: number,
  ctx: { type: string; redirectTo?: string; userData?: unknown },
): Promise<NetlifyResponse> {
  const template = await templateReady;
  const globalContext = `<script>window.ctx = ${JSON.stringify(ctx)}</script>`;
  const metaRefresh = ctx.redirectTo
    ? `<meta http-equiv="refresh" content="0; URL=${ctx.redirectTo}" />`
    : '';

  const headers: NetlifyResponse['headers'] = {
    'Content-Type': 'text/html',
  };
  if (ctx.redirectTo) {
    headers['Location'] = ctx.redirectTo;
  }

  return {
    statusCode,
    body: template.replace(
      '<!--head-html-->',
      `${metaRefresh}${globalContext}`,
    ),
    headers,
  };
}
