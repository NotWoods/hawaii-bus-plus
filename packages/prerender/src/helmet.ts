import { Helmet } from '@notwoods/preact-helmet';
import { parse } from './parser.js';

export function injectHelmet(html: string) {
  const helmet = Helmet.renderStatic();
  const root = parse(html);

  function addAttributes(selector: string, attributes: Record<string, string>) {
    const element = root.querySelector(selector);
    if (element) {
      element.setAttributes({ ...element.attributes, ...attributes });
    }
  }

  addAttributes(
    'html',
    helmet.htmlAttributes.toComponent() as Record<string, string>,
  );
  addAttributes(
    'body',
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
