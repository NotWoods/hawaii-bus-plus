import parser, { type Options, type HTMLElement } from 'node-html-parser';

let parse: (data: string, options?: Partial<Options>) => HTMLElement;
if (typeof parser === 'function') {
  parse = parser;
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parse = parser.parse || parser.default;
}

export { parse };
