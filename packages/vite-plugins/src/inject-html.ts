import type { Plugin } from 'vite';

interface Options {
  head?: string | Promise<string>;
  body?: string | Promise<string>;
}

export function injectHtml(options: Options = {}): Plugin {
  async function replaceTag(
    html: string,
    tag: string,
    replacement: string | Promise<string>,
  ) {
    return html.replace(tag, tag + (await replacement));
  }

  return {
    name: 'inject-html',
    async transformIndexHtml(html) {
      if (options.head) {
        html = await replaceTag(html, '<head>', options.head);
      }
      if (options.body) {
        html = await replaceTag(html, '<body>', options.body);
      }
      return html;
    },
  };
}
