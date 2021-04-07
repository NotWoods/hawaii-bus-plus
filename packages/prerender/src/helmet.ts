import { Helmet } from '@hawaii-bus-plus/preact-helmet';
import parser from 'node-html-parser';

let parse: typeof parser;
if (typeof parser === 'function') {
  parse = parser;
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parse = parser.parse || parser.default;
}

export function injectHelmet(html: string) {
  const helmet = Helmet.renderStatic();
  const root = parse(html);

  root
    .querySelector('html')
    ?.setAttributes(
      helmet.htmlAttributes.toComponent() as Record<string, string>,
    );
  root
    .querySelector('body')
    ?.setAttributes(
      helmet.bodyAttributes.toComponent() as Record<string, string>,
    );

  root.querySelector('title')?.remove();
  const head = root.querySelector('head');
  if (head) {
    head.innerHTML +=
      helmet.title.toString() + helmet.meta.toString() + helmet.link.toString();
  }

  root.removeWhitespace();
  return root.toString();
}
