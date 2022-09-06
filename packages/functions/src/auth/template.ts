import { NetlifyResponse } from '../../shared/types';
import template from './done.html';

export function renderTemplate(
  statusCode: number,
  ctx: { type: string; redirectTo?: string; userData?: unknown },
): NetlifyResponse {
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
    body: template.replace('</head>', `${metaRefresh}${globalContext}</head>`),
    headers,
  };
}
