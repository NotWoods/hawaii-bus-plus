import { Helmet } from '@hawaii-bus-plus/preact-helmet';
import parse from 'node-html-parser';

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
