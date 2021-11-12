import parser from 'node-html-parser';

let parse: typeof parser;
if (typeof parser === 'function') {
  parse = parser;
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parse = parser.parse || parser.default;
}

export { parse };
