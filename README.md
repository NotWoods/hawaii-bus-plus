# Hawaii Bus Plus

## Contributing

This repository is a monorepo which leverages [pnpm](https://pnpm.js.org/) for dependency management.

To begin, please install `pnpm`:

```bash
$ npm install pnpm -g
$ pnpm recursive install
```

[hawaii-gtfs](https://github.com/NotWoods/hawaii-gtfs/) is required to be checked out as a sibling directory. The GTFS file will automatically be loaded from there to be used to generate the API.

### Running

#### Build the API

```bash
pnpm run api
```

Uses the `@hawaii-bus-plus/api-gen` package to generate an API file, which is placed in the client package's public directory.

#### Test the code

```bash
pnpm recursive test
```

Runs the test script in every single package.

#### Run the client

```bash
pnpm run dev
```

Uses the `@hawaii-bus-plus/client` package to start a server on `localhost:3000`. [Vite](https://vitejs.dev/) is used for the dev server and automatically deals with bundling.
